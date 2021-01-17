import React, { Component } from 'react';
import Person from './Person';
import { getMondayDate } from '../Calculations';
import { GetPeople, GetShifts, GetLocations, GetNotes, SaveDatatoDB } from '../API';
import { getStandartDate, getAllTotal, getUpdatedShifts } from '../Functions'
import WeekDays from './WeekDays';
import RotaFooter from './RotaFooter';
import AlertBox from './AlertBox';
import Header from './Header';

export default class Rota extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             isLoaded: false,
             people: [],
             date: new Date(),
             monday: getMondayDate(new Date()),
             allWeekTotal: 0,
             alertBox: false,
             locations: {},
             notes: undefined,
             userAccess: props.userAccess,
             message: ''
        }
        this.updateDate = this.updateDate.bind(this)
        this.updateStateWithData = this.updateStateWithData.bind(this)
        this.clearOldShifts = this.clearOldShifts.bind(this)
        this.updatePeopleShifts = this.updatePeopleShifts.bind(this)
        this.saveData = this.saveData.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.rerender = this.rerender.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.updateNotes = this.updateNotes.bind(this)
        this.getDataFromAPI = this.getDataFromAPI.bind(this)
        this.getLocations = this.getLocations.bind(this)

        // Prototype to add days
        /*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }    
    }
    updateStateWithData(shifts, people, notes, locations) {
        shifts.forEach(shift => {

            let jsDate = new Date(Date.parse(shift.shiftsDate));
            let weekDay = jsDate.getDay();
            if(weekDay === 0) { weekDay = 7}

            for(let i=0; i < people.length; i++) {

                if ( shift.peopleID === people[i]['peopleID']){

                    people[i]['weekDays'][weekDay] = {}
                    people[i]['weekDays'][weekDay] = {
                        startingTime: shift.startingTime,
                        finishingTime: shift.finishingTime,
                        date: jsDate,
                        shiftID: shift.shiftsID,
                        location: shift.location,
                        locationID: shift.locationsID,
                        shiftBreak: shift.shiftBreak
                    }
                }
            }
        });
        this.setState({
            people: people,
            notes: notes,
            locations: locations,
            isLoaded: true
        }, () => this.calculateAllTotal() )
    }
    clearOldShifts() {
        return new Promise(resolve => {
            this.setState({ people: undefined, isLoaded: false }, () => resolve())
        })
    }
    calculateAllTotal() {

        const total = getAllTotal([...this.state.people])
        this.setState({ allWeekTotal: total })
    }
    getLocations = async () => {
        const { Axios, API, usersID } = this.props
        const locations = await GetLocations(Axios, API, usersID)
        this.rerender()
        return locations
    }
    getDataFromAPI = async () => {
        const { Axios, API, usersID } = this.props
        const monday = getStandartDate(this.state.monday);
        const sunday = getStandartDate(this.state.monday.addDays(6));
        try {
            const locations = await GetLocations(Axios, API, usersID)
            const people = await GetPeople(Axios, API, usersID)
            const shifts = await GetShifts(Axios, API, usersID, monday, sunday)
            const notes = await GetNotes(Axios, API, usersID, monday, sunday)
            await this.clearOldShifts()
            this.updateStateWithData(shifts, people, notes, locations)   
        }
        catch(err){ console.log(err) }
    }
    componentDidMount = () => {
        this.getDataFromAPI()
    }
 
    updateDate(t) {
        let monday = getMondayDate(t)
        this.setState({
            date: t,
            monday: monday
        }, () => this.getDataFromAPI() )
    }
    updatePeopleShifts(shift) {

        const updatedPeople = getUpdatedShifts(shift, this.state.people, this.props.usersID)

        this.setState({
            people: updatedPeople
        }, () => this.calculateAllTotal())
    }
    updateNotes(newNotes) {
        this.setState({ notes: newNotes })
    }
    saveData = async () => {

        const { Axios, API, usersID } = this.props
        const respond = await SaveDatatoDB(Axios, API, usersID, this.state)
        this.setState({ alertBox: true, message: respond})
    }

    closeAlert() {
        this.setState({ alertBox: false, message: '' })
    }

    rerender = () => this.getDataFromAPI();

    render() {
        const { isLoaded, people, alertBox, locations, monday, notes, allWeekTotal, message } = this.state;
        const { Axios, usersID, API } = this.props;
        let peopleElements = []
        if(isLoaded) {
            peopleElements = people.map(person => {
                return (
                    <Person 
                        locations={locations} 
                        monday={monday} 
                        updatePeopleShifts={this.updatePeopleShifts} 
                        key={person.peopleID} 
                        person={person} 
                    />
                )
            })    
        }
        return (
            <div className={`rota-container ${alertBox ? 'lock':''}`}>

                <header id='top-rota-header'>
                    <this.props.DatePicker 
                        onChange={this.updateDate}
                        value={this.state.date}
                    />
                    <Header
                        Axios={Axios}
                        rerender={this.rerender}
                        locations={locations}
                        getLocations={this.getLocations}
                        API={API}
                        usersID={usersID}
                    />
                </header>
                {isLoaded ?
                    <ul className='rota-header'>
                        <li className='name'>Name</li>
                        <li>
                            <WeekDays 
                                monday={monday}
                                notes={notes}
                                updateNotes={this.updateNotes}
                                />
                        </li>
                        <li className='week-total'>Week total</li>
                    </ul>            
                :
                    ''
                }

                {isLoaded ?
                    peopleElements
                    :
                    <div>Loading</div>
                }
                <RotaFooter
                    allWeekTotal={allWeekTotal}
                    saveData={this.saveData}
                />
                {alertBox ?
                    <AlertBox 
                        message={message}
                        close={this.closeAlert}
                    />
                :
                    ''
                }
            </div>

        )
    }
}
