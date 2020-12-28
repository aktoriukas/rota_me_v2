import React, { Component } from 'react';
import { convertToMinutes, calculateTotal, convertToString } from '../Calculations';

export default class Shift extends Component {
    constructor(props) {
        super(props)

        let startingTime = 0;
        let finishingTime = 0;

        try {
            startingTime = props.person.weekDays[props.day].startingTime
            finishingTime = props.person.weekDays[props.day].finishingTime
        }
        catch {

        }

        this.state = {
             startingTime: startingTime,
             finishingTime: finishingTime,
             startingMinutes: 0,
             finishingMinutes: 0,
             person: this.props.person,
             day: this.props.day,
             total: 0,
             totalMinutes: 0
        }
        this.updateTime = this.updateTime.bind(this)
    }
    componentDidMount() {
        const { startingTime, finishingTime } = this.state
        let newTotal = 0;
        let newTotalMinutes = 0; 
        let finishingMinutes = 0; 
        let startingMinutes = 0;

        try {
            finishingMinutes = convertToMinutes(finishingTime) 
            startingMinutes = convertToMinutes(startingTime)  
            newTotalMinutes = calculateTotal(startingMinutes, finishingMinutes) 
            newTotal = convertToString(newTotalMinutes)
        }
        catch {

        }

        this.setState({
            finishingMinutes: finishingMinutes,
            startingMinutes: startingMinutes,
            totalMinutes: newTotalMinutes,
            total: newTotal
        }, this.props.updateWeeklyState(this.state)
         , this.props.updateTotalWeek(newTotalMinutes, this.state.day))
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
                        value={this.state.startingTime}
                    ></input>
                    <input 
                        className='time finishing'
                        type='time' 
                        onChange={(e)=> this.updateTime(e)}
                        onBlur={() => this.props.updateWeeklyState(this.state)}
                        value={this.state.finishingTime}
                    ></input>
                </div>
                <span className={`shift-total`}>
                    {this.state.total}
                </span>
            </li>
        )
    }
}
