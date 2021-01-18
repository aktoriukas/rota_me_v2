import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
import { makeSqlDate } from '../Functions';
import Axios from 'axios';
import { getHolidays, saveHolidays } from '../API';


export default class EmployeesOptions extends Component {

    constructor(props) {
        super(props)
        const { person } = this.props
        console.log(person)

        this.state = {
             startDate: new Date(),
             endDate: new Date(),
             peopleName: person.peopleName,
             peopleRole: person.peopleRole,
             peopleID: person.peopleID,
             holidaysStartDate: makeSqlDate(new Date()),
             holidaysEndDate: makeSqlDate(new Date())
        }
        this.updatename = this.updatename.bind(this)
        this.updateRole = this.updateRole.bind(this)
        this.updateStarting = this.updateStarting.bind(this)
        this.updateEnding = this.updateEnding.bind(this)
    }
    componentDidMount = async () => {
        const { peopleID } = this.state
        const { usersID, API } = this.props
        const holidays = await getHolidays(Axios, API, usersID, peopleID)
    }
    updateStarting(t) { this.setState({ holidaysStartDate: makeSqlDate(t), startDate: t }) }
    updateEnding(t) { this.setState({ holidaysEndDate: makeSqlDate(t), endDate: t }) }
    updatename = (e) => { this.setState({ peopleName: e.target.value}) }
    updateRole = (e) => { this.setState({ peopleRole: e.target.value}) }
    addHolidays = async () => { 
        const { peopleID, holidaysStartDate, holidaysEndDate } = this.state
        const { usersID, API } = this.props
        await saveHolidays(Axios, API, usersID, peopleID, holidaysStartDate, holidaysEndDate)
    }

    render() {
        const { peopleName, peopleRole, startDate, endDate } = this.state
        return (
            <div className='employees-options'>
                <div className='about form'>
                    <label>Name</label>
                    <input className='input' onChange={this.updatename} value={peopleName}/>
                    <label>Role</label>
                    <input className='input' onChange={this.updateRole} value={peopleRole}/>
                </div>
                <div className='holidays'>
                    <div className='add-new'>
                        <p>Add new Holidays</p>
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

                    </div>
                </div>
                <button className='button'>save</button>
            </div>
        )
    }
}