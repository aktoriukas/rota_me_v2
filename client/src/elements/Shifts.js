import React, { Component } from 'react';
import Shift from './Shift';
// import { convertToString } from '../Calculations';
// import WeekDays from './WeekDays';

export default class Shifts extends Component {


    render() {
        const {weekDays} = this.props.person;
        let shifts = [];
        for (let i = 1; i < 8; i++) {
            shifts.push(
                <Shift 
                    person={this.props.person}
                    shift={weekDays[i]} key={i} 
                    handleChange={this.props.handleChange}
                    updateWeekTotal={this.props.updateWeekTotal}
                    weekDay={i}
                    monday={this.props.monday}
                />
            )
        }
        return (
            <div className='shifts-container'>
            {shifts}
            </div>
        )
    }
}
