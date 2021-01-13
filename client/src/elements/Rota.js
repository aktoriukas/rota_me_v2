import React, { Component } from 'react';
import Person from './Person';
import { getMondayDate, convertToMinutes, calculateTotal } from '../Calculations';
import { getStandartDate, makeSqlDate } from '../Functions'
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
        this.addShiftsToPeople = this.addShiftsToPeople.bind(this)
        this.clearOldShifts = this.clearOldShifts.bind(this)
        this.updatePeopleShifts = this.updatePeopleShifts.bind(this)
        this.saveData = this.saveData.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.rerender = this.rerender.bind(this)
        this.getLocations = this.getLocations.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.updateNotes = this.updateNotes.bind(this)

        // Prototype to add days
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }    
    }
    getPeople =  () => {
        return new Promise(resolve => {
            let newPeople;
            const userID = {
                userID: this.props.usersID
            }
            this.props.Axios.get(`${this.props.API}/api/getPeople`, { params: { userID } })
            .then(response => {
                newPeople = [...response.data];
                newPeople.map((item) => item.weekDays = []);
              resolve(newPeople)
            })
        })
    }
    getLocations() {
        const userID = {
            userID: this.props.usersID
        }
        this.props.Axios.get(`${this.props.API}/api/getLocations`, { params: { userID } })
        .then( response => this.setState({ locations: response.data }) )
    }
    getNotes = () => {
        return new Promise(resolve => {
            let interval = {
                weekBegining: getStandartDate(this.state.monday),
                weekEnd : getStandartDate(this.state.monday.addDays(6)),
                userID: this.props.usersID   
            }
            this.props.Axios.get(`${this.props.API}/api/getNotes`, { params: {interval} })
            .then((response)=> {
                let notes = [...response.data]
                resolve(notes)
            })
        })
    }
    getShifts = () => {
        return new Promise(resolve => {
      
            let interval = {
                weekBegining: getStandartDate(this.state.monday),
                weekEnd : getStandartDate(this.state.monday.addDays(6)),
                userID: this.props.usersID   
            }
            this.props.Axios.get(`${this.props.API}/api/getShifts`, { params: {interval} })
            .then((response)=> {
                let shift = [...response.data]
                resolve(shift)
            })
        });
    };
    addShiftsToPeople(shifts, people, notes) {
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
            isLoaded: true
        }, () => this.calculateAllTotal() )
    }
    clearOldShifts() {
        this.setState({ people: undefined, isLoaded: false })
    }
    calculateAllTotal() {
        let peopleCopy = [...this.state.people]
        let total = 0;
        let startingTime, finishingTime, dayTotal
        peopleCopy.forEach(person => {
            person.weekDays.forEach(day => {
                startingTime = convertToMinutes(day.startingTime)
                finishingTime = convertToMinutes(day.finishingTime)
                dayTotal = calculateTotal(startingTime, finishingTime) 
                total += dayTotal
            })
        });
        this.setState({ allWeekTotal: total })
    }
    componentDidMount = async (state) => {

        try {
            this.getLocations()

            const people = await this.getPeople()
            const shifts = await this.getShifts()
            const notes = await this.getNotes()
            this.clearOldShifts()
            this.addShiftsToPeople(shifts, people, notes)   
        }
        catch(err){ console.log(err) }
    }
 
    updateDate(t) {
        let monday = getMondayDate(t)
        // Clear shifts
        this.setState({
            date: t,
            monday: monday
        }, () => this.componentDidMount() )
    }
    updatePeopleShifts(shift) {
        const { people } = this.state
        let peopleCopy = [...people].map(person => {
            if ( person.peopleID === shift.peopleID) {
                person.weekDays[shift.weekDay] = {};
                person.weekDays[shift.weekDay] = {
                    startingTime: shift.startingTime,
                    finishingTime: shift.finishingTime,
                    date: shift.date,
                    locationID: shift.locationID,
                    shiftID: shift.shiftID,
                    userID: this.props.usersID,
                    shiftBreak: shift.shiftBreal
                }
            }
            return person
        })
        this.setState({
            people: peopleCopy
        }, this.calculateAllTotal)
    }
    updateNotes(newNotes) {
        const { notes } = this.state;
        let copyNotes = [...notes]
        console.log(copyNotes)
        console.log(newNotes)
        let index = copyNotes.findIndex(note => note.notesID === newNotes.noteID)
        if(index >= 0) {
            copyNotes[index].notesText = newNotes.notesText
        }else {
            copyNotes.push(newNotes)
        }
        this.setState({ notes: copyNotes })
    }
    saveData = () => {
        let update = [];
        let insert = [];
        if(this.state.userAccess === 1){
            this.state.people.forEach(person => {
                person.weekDays.forEach(day => {
                    let shift = {}
    
                    let sqlDate = makeSqlDate(day.date)
                    shift = {
                        peopleID: person.peopleID,
                        startingTime: day.startingTime,
                        finishingTime: day.finishingTime,
                        date: sqlDate,
                        locationID: day.locationID,
                        userID: this.props.usersID
                    }
                    console.log(this.props)
                    if ( day.shiftID === undefined) {
                        insert.push(shift)
                    } else {
                        shift.shiftID = day.shiftID
                        update.push(shift)
                    }
                })
            })
            this.props.Axios.put(`${this.props.API}/api/update`, {
                update: update,
                insert: insert
            }).then(() =>  this.setState({ 
                alertBox: true,
                message: 'Your data have been saved'
            }) )
        }else {
            this.setState({
                alertBox: true,
                message: 'You not allowed this action'
            })
        }
    }

    closeAlert() {
        this.setState({ 
            alertBox: false,
            message: ''
        })
    }

    rerender = () => this.componentDidMount();

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
