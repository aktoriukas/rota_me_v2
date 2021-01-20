import React, { Component } from 'react';
import Shifts from './Shifts';
import { getTotalObj, convertToString } from '../Calculations';

export default class Person extends Component {

    constructor(props) {
        super(props)

        this.state = {
            week: [],
            totalWeekString: '',
            totalWeekMin: 0
        }
        this.handleChange = this.handleChange.bind(this)
    }
    componentDidMount() {
        // Update total week with new data

        const { person } = this.props
        const { week } = this.state
        let newTotalWeekMin = 0
        let total = []
        let newWeek = [...week]
        try {
            person.weekDays.forEach((day, index) => {
                if (day === undefined) return
                if (person.holidays[index]) return
                const { totalMinutes } = getTotalObj(day.startingTime, day.finishingTime)
                total.push(totalMinutes)
                newWeek[index] = totalMinutes
            });
            newTotalWeekMin = total.reduce((acc, cur) => acc + cur)
        } catch { }
        const totalWeekString = convertToString(newTotalWeekMin)

        this.setState({
            week: newWeek,
            totalWeekMin: newTotalWeekMin,
            totalWeekString: totalWeekString,
            personId: person.peopleID
        })
    }
    handleChange(shift) {
        let newTotalWeekMin, newTotalWeekString
        let newWeek = [...this.state.week]

        newWeek[shift.weekDay] = shift.totalMinutes
        newTotalWeekMin = newWeek.reduce((acc, cur) => {
            if (cur === undefined) { cur = 0 }
            if (acc === undefined) { acc = 0 }
            return acc + cur
        })
        newTotalWeekString = convertToString(newTotalWeekMin)

        this.setState({
            week: newWeek,
            totalWeekMin: newTotalWeekMin,
            totalWeekString: newTotalWeekString

        }, this.props.updatePeopleShifts(shift))
    }

    render() {
        const { totalWeekMin } = this.state
        let overTime = 2400; // 40H

        return (
            <div className='person-container'>
                <div className='about'>
                    <h3 className='name'>{this.props.person.peopleName}</h3>
                    <h4 className='title'>{this.props.person.peopleRole}</h4>
                </div>
                <Shifts
                    person={this.props.person}
                    handleChange={this.handleChange}
                    updateWeekTotal={this.updateWeekTotal}
                    monday={this.props.monday}
                    locations={this.props.locations}
                />
                <div className={`week-total ${totalWeekMin > overTime ? 'overtime' : ''}`}>
                    <span>{this.state.totalWeekString}</span>
                </div>
            </div>
        )
    }
}
