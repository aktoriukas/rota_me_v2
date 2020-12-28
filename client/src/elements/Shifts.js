import React, { Component } from 'react';
import Shift from './Shift';
import { convertToString } from '../Calculations';

export default class Shifts extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             weekTotal: 0,
             weekTotalMinutes: 0,
             week: []
        }
        this.updateTotalWeek = this.updateTotalWeek.bind(this)
    }
    updateTotalWeek(minutes, day) {
        let newWeek = this.state.week.slice()
        let totalMinutes = 0;
        let total = '';

        newWeek[day] = minutes

        for (let i = 0; i < newWeek.length; i++) {
            if (newWeek[i] !== undefined) {
                totalMinutes += newWeek[i]
            }
        }
        total = convertToString(totalMinutes);

        this.setState({ 
            week: newWeek,
            weekTotal: total,
            weekTotalMinutes: totalMinutes
        })
    }

    render() {
        let shifts = [];
        let overTime = 2400; // 40H

        for(let i = 1; i <= 7; i++) {
            shifts.push(
            <Shift 
                key={i} 
                day={i}
                updateWeeklyState={this.props.updateWeeklyState}
                person={this.props.person}
                updateTotalWeek={this.updateTotalWeek}
            />
        )}
        return (
            <>
                <ul className='shifts-container'>
                    {shifts}
                </ul>
                <span className={`week-total ${this.state.weekTotalMinutes > overTime ? 'overtime':''}`}>
                    <span>
                    {this.state.weekTotal}
                    </span>
                </span>
            </>
        )
    }
}
