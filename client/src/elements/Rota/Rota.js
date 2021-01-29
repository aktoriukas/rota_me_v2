import React, { Component } from 'react';
import Person from './Person';
import { getMondayDate } from '../../Calculations';
import { GetPeople, GetShifts, GetLocations, GetNotes, SaveDatatoDB, GetWeekHolidays } from '../../API';
import { getStandartDate, getAllTotal, getUpdatedShifts, addHolidays, resetDateTime, getThisWeekDate } from '../../Functions'
import WeekDays from './Rota-header/WeekDays';
import RotaFooter from './RotaFooter';
import AlertBox from '../PopUps/AlertBox';
import Header from '../Options/Header';
import Loading from '../PopUps/Loading';
import LogoSmall from '../../icons/rota_me-small.svg'

import { connect } from 'react-redux';
import {
    setDate,
    getPeople,
    getLocations,
    getNotes,
    loadRota,
    clearOldShifts,
    openAlertBox,
    closeAlertBox,
    updateAllWeekTotal
} from '../../actions'


class Rota extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoaded: false,
            people: [],
            date: new Date(),
            monday: getMondayDate(new Date()),
            // alertBox: false,
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
        Date.prototype.addDays = function (days) {
            let date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
    }
    updateStateWithData(shifts, people, notes, locations, holidays, sunday) {


        people.forEach(person => person.holidays = [])
        shifts.forEach(shift => {
            let jsDate = new Date(Date.parse(shift.shiftsDate));
            let weekDay = jsDate.getDay();
            if (weekDay === 0) { weekDay = 7 }
            for (let i = 0; i < people.length; i++) {

                if (shift.peopleID === people[i]['peopleID']) {
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
        addHolidays(people, holidays, resetDateTime(this.state.monday), new Date(Date.parse(sunday)))

        this.saveDataToStore(people, notes, locations)

        this.setState({
            people: people,
            notes: notes,
            locations: locations,
            isLoaded: true
        }, () => this.calculateAllTotal())
    }
    clearOldShifts() {
        this.props.dispatch(clearOldShifts())
        return new Promise(resolve => {
            this.setState({ people: undefined, isLoaded: false }, () => resolve())
        })
    }
    calculateAllTotal() {

        const total = getAllTotal([...this.state.people])
        this.props.dispatch(updateAllWeekTotal(total))
        // this.setState({ allWeekTotal: total })
    }
    getLocations = async () => {
        const { Axios, API, usersID } = this.props
        const locations = await GetLocations(Axios, API, usersID)
        this.rerender()
        return locations
    }
    getDataFromAPI = async () => {
        const { Axios, API, usersID, rota } = this.props
        const monday = getStandartDate(this.state.monday);
        const sunday = getStandartDate(this.state.monday.addDays(6));
        try {
            const locations = await GetLocations(Axios, rota.API, usersID)
            const people = await GetPeople(Axios, rota.API, usersID)
            const shifts = await GetShifts(Axios, rota.API, usersID, monday, sunday)
            const notes = await GetNotes(Axios, rota.API, usersID, monday, sunday)
            const holidays = await GetWeekHolidays(Axios, rota.API, usersID, monday, sunday)
            await this.clearOldShifts()
            this.updateStateWithData(shifts, people, notes, locations, holidays, sunday)
        }
        catch (err) { console.log(err) }
    }
    componentDidMount = () => {
        const date = getThisWeekDate(new Date())

        this.getDataFromAPI()
        this.props.dispatch(setDate(date))
    }
    saveDataToStore(people, notes, locations) {
        const { dispatch, rota } = this.props;

        dispatch(getPeople(people))
        dispatch(getNotes(notes))
        dispatch(getLocations(locations))
        dispatch(loadRota())
        dispatch(updateAllWeekTotal(getAllTotal([...rota.people])))
    }

    updateDate(t) {
        const date = getThisWeekDate(t)

        this.props.dispatch(setDate(date))

        this.setState({
            date: t,
            monday: date.monday
        }, () => this.getDataFromAPI())
    }
    updatePeopleShifts(shift) {

        const updatedPeople = getUpdatedShifts(shift, this.state.people, this.props.usersID)

        this.setState({
            people: updatedPeople
        }, () => this.calculateAllTotal())
    }
    updateNotes(newNotes) { this.setState({ notes: newNotes }) }
    saveData = async () => {

        const { Axios, API, usersID } = this.props
        const respond = await SaveDatatoDB(Axios, API, usersID, this.state)
        this.props.dispatch(openAlertBox(respond))
        this.setState({ alertBox: true })
    }

    closeAlert() {
        this.props.dispatch(closeAlertBox())
        this.setState({ alertBox: false })
    }
    rerender = () => this.getDataFromAPI();

    render() {
        const { isLoaded, people, alertBox, locations, monday, notes } = this.state;
        const { Axios, usersID, API, rota } = this.props;
        let peopleElements = []
        if (rota.rotaIsLoaded) {
            peopleElements = rota.people.map(person => {
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
            <div className={`rota-container ${alertBox ? 'lock' : ''}`}>

                <header id='top-rota-header'>
                    <img src={LogoSmall} className='logo-small'></img>
                    <button onClick={() => this.updateDate(new Date())} className='button today'>today</button>
                    <this.props.DatePicker
                        onChange={this.updateDate}
                        value={rota.date.today}
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
                    <Loading />
                }
                <RotaFooter
                    allWeekTotal={rota.hoursCalc.allWeekTotal}
                    saveData={this.saveData}

                />
                {rota.alertBox.visible ?
                    <AlertBox
                        message={rota.alertBox.message}
                        close={this.closeAlert}
                    />
                    :
                    ''
                }
            </div>

        )
    }
}
const mapStateToProps = (state) => {
    return { rota: state.rotaReducer }
}

export default connect(mapStateToProps)(Rota)