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
        this.updateWeekTotal = this.updateWeekTotal.bind(this)
    }
    updateWeekTotal(state) {
        let weekCopy = [...this.state.week]
        weekCopy[state.weekDay] = state.totalMinutes
        let totalMin = weekCopy.reduce((acc, cur) => acc + cur)
        console.log(weekCopy)
        this.setState({
            week: weekCopy,
            totalWeekMin: totalMin
        })
    }
    static getDerivedStateFromProps(props, state) {
        let totalWeekMin = 0;
        let total = []
        try {
            props.person.weekDays.forEach(day => {
                if (day === undefined) { return}
                const { totalMinutes } = getTotalObj(day.startingTime, day.finishingTime)
                total.push(totalMinutes)
            });
            totalWeekMin = total.reduce((acc, cur) => acc + cur)
        }catch {}

        const totalWeekString = convertToString(totalWeekMin)
        return {
            totalWeekMin: totalWeekMin,
            totalWeekString: totalWeekString
        }
    }
    handleChange(state) {
        // console.log(state)
    }

    render() {
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
                    // updateWeeklyState={this.props.updateWeeklyState}
                />
                <div className='week-total'>
                    <span>{this.state.totalWeekString}</span>
                </div>
            </div>
        )
    }
}
