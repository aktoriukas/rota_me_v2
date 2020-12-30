import React, { Component } from 'react';
import Shift from './Shift';
// import { convertToString } from '../Calculations';
// import WeekDays from './WeekDays';

export default class Shifts extends Component {


    render() {
        const {weekDays} = this.props.person;
        let shifts = [];
        // let overTime = 2400; // 40H
        for (let i = 1; i < 8; i++) {
            shifts.push(<Shift shift={weekDays[i]} key={i} />)
        }

        return (
            <div className='shifts-container'>
            {shifts}
            </div>
        )
    }
}
