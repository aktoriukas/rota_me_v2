import React, { Component } from 'react';
import { convertToMinutes, calculateTotal, convertToString } from '../Calculations';

export default class Shift extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             startingTime: '',
             finishingTime: '',
             startingMinutes: 0,
             finishingMinutes: 0,
             person: this.props.person,
             day: this.props.day,
             total: 0,
             totalMinutes: 0
        }
        this.updateTime = this.updateTime.bind(this)
    }
    
    updateTime (e) {

        const { value, className } = e.target;
        let newTotal, newTotalMinutes, finishingMinutes, startingMinutes, startingTime, finishingTime;

        if (className.includes('finishing')) {

            finishingMinutes = convertToMinutes(value);
            newTotalMinutes = calculateTotal(this.state.startingMinutes, finishingMinutes)
            startingMinutes = this.state.startingMinutes;
            finishingTime = value;
            startingTime = this.state.startingTime;

        } else if (className.includes('starting')) {

            startingMinutes = convertToMinutes(value);
            newTotalMinutes = calculateTotal(startingMinutes, this.state.finishingMinutes)
            finishingMinutes = this.state.finishingMinutes;
            startingTime = value;
            finishingTime = this.state.finishingTime;
        }
        newTotal = convertToString(newTotalMinutes);
        this.props.updateTotalWeek(newTotalMinutes, this.state.day);

        this.setState({
            finishingTime: finishingTime,
            finishingMinutes: finishingMinutes,
            startingTime: startingTime,
            startingMinutes: startingMinutes,
            totalMinutes: newTotalMinutes,
            total: newTotal
        })

    }

    render() {

        return (
            <li className='shift-container'>
                <div className='shift'>
                    <input 
                        className='time starting'
                        type='time' 
                        onChange={(e)=> this.updateTime(e)}
                        onBlur={() => this.props.updateWeeklyState(this.state)}
                    ></input>
                    <input 
                        className='time finishing'
                        type='time' 
                        onChange={(e)=> this.updateTime(e)}
                        onBlur={() => this.props.updateWeeklyState(this.state)}
                    ></input>
                </div>
                <span className={`shift-total`}>
                    {this.state.total}
                </span>
            </li>
        )
    }
}
