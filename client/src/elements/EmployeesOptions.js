import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
import { makeSqlDate } from '../Functions';
import Axios from 'axios';
import { getHolidays, saveHolidays, deleteHolidays, saveChanges } from '../API';


export default class EmployeesOptions extends Component {

    constructor(props) {
        super(props)
        const { person } = this.props

        this.state = {
             startDate: new Date(),
             endDate: new Date(),
             peopleName: person.peopleName,
             peopleRole: person.peopleRole,
             peopleID: person.peopleID,
             holidaysStartDate: makeSqlDate(new Date()),
             holidaysEndDate: makeSqlDate(new Date()),
             holidays: []
        }
        this.updatename = this.updatename.bind(this)
        this.updateRole = this.updateRole.bind(this)
        this.updateStarting = this.updateStarting.bind(this)
        this.updateEnding = this.updateEnding.bind(this)
        this.updateHolidays = this.updateHolidays.bind(this)
        this.getHolidaysAPI = this.getHolidaysAPI.bind(this)
        this.saveChanges = this.saveChanges.bind(this)
    }
    componentDidMount = () => {
        this.getHolidaysAPI()
    }
    getHolidaysAPI = async () => {
        const { peopleID } = this.state
        const { usersID, API } = this.props
        const holidays = await getHolidays(Axios, API, usersID, peopleID)
        this.updateHolidays(holidays)
    }
    updateHolidays = (holidays) => { this.setState({ holidays }) }
    updateStarting(t) { this.setState({ holidaysStartDate: makeSqlDate(t), startDate: t }) }
    updateEnding(t) { this.setState({ holidaysEndDate: makeSqlDate(t), endDate: t }) }
    updatename = (e) => { this.setState({ peopleName: e.target.value}) }
    updateRole = (e) => { this.setState({ peopleRole: e.target.value}) }
    addHolidays = async () => { 
        if ( this.props.userAccess > 1) {
            this.props.showAlert('no access')
            return }
        const { peopleID, holidaysStartDate, holidaysEndDate } = this.state
        const { usersID, API } = this.props
        await saveHolidays(Axios, API, usersID, peopleID, holidaysStartDate, holidaysEndDate)
        this.props.showAlert('saved')
        this.getHolidaysAPI()
    }
    deleteHolidays = async (id) => {
        if ( this.props.userAccess > 1) {
            this.props.showAlert('access denied')
            return }
        const { usersID, API } = this.props
        await deleteHolidays(Axios, API, usersID, id)
        this.props.showAlert('deleted')
        this.getHolidaysAPI()
    }
    saveChanges = async () => {
        if ( this.props.userAccess > 1) {
            this.props.showAlert('access denied')
            return }
        const { usersID, API } = this.props
        const { peopleID, peopleName, peopleRole } = this.state
        await saveChanges( Axios, API, usersID, peopleID, peopleName, peopleRole);
        this.props.showAlert('saved')
    }

    render() {
        const { peopleName, peopleRole, startDate, endDate, holidays } = this.state

        let Holidays = holidays.map(item => {
            let start = new Date(Date.parse(item.holidaysStartDate));
            let end = new Date(Date.parse(item.holidaysEndDate));
            start = makeSqlDate(start)
            end = makeSqlDate(end)
            return (
                <div key={item.holidaysID} className='hol'>
                    <span className='start'>{start}</span>
                    <span className='end'>{end}</span>
                    <button 
                        className='button' 
                        onClick={() => this.deleteHolidays(item.holidaysID)}>
                        delete
                    </button>
                </div>
            )
        })
        return (
            <div className='employees-options-inner'>
                <div className='about form'>
                    <label>Name</label>
                    <input className='input' onChange={this.updatename} value={peopleName}/>
                    <label>Role</label>
                    <input className='input' onChange={this.updateRole} value={peopleRole}/>
                </div>
                <div className='holidays'>
                    <div className='add-new'>
                        <h1>Add new Holidays</h1>
                        <DatePicker 
                            className='start'
                            onChange={this.updateStarting}
                            value={startDate}
                        />
                        <DatePicker 
                            className='end'
                            onChange={this.updateEnding}
                            value={endDate}
                        />
                        <button onClick={this.addHolidays} className='button'>add</button>
                    </div>
                    <div className='holidays-list'>
                        <h1>Holidays</h1>
                        {Holidays}
                    </div>
                </div>
                <button onClick={this.saveChanges} className='button'>save</button>
            </div>
        )
    }
}