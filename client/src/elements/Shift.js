import React, { Component } from 'react';
import { convertToMinutes, calculateTotal, convertToString, getTotalObj } from '../Calculations';
// import TimeField from 'react-simple-timefield';
export default class Shift extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            startingTime: '',
            finishingTime: '',
            totalString: '',
            totalMinutes: '',
            peopleID: props.person.peopleID,
            weekDay: props.weekDay
        }
        this.updateTime = this.updateTime.bind(this)
        this.updateState = this.updateState.bind(this)
    }
    updateState(startingTime, finishingTime, totalString, totalMinutes) {
        this.setState({
            startingTime: startingTime,
            finishingTime: finishingTime,
            totalString: totalString,
            totalMinutes: totalMinutes
        })
    }

    componentDidMount() {
        if (this.props.shift !== undefined) {
            const { startingTime, finishingTime} = this.props.shift
            const { totalMinutes, totalString } = getTotalObj(startingTime, finishingTime)

            this.updateState(startingTime, finishingTime, totalString, totalMinutes)
        }
    }

    updateTime(e) {
        let startingTime, finishingTime;

        if (e.target.className.includes('starting')){
            startingTime = e.target.value;
            finishingTime = this.state.finishingTime
        }else {
            startingTime = this.state.startingTime
            finishingTime = e.target.value;
        }
        const {totalMinutes, totalString} = getTotalObj(startingTime, finishingTime)
        this.updateState(startingTime, finishingTime, totalString, totalMinutes)
    }

    render() {
        const { totalString } = this.state;
        return (
            <li className='shift-container'>
                <div className='shift'>
                    <input 
                        className='time starting'
                        type='time' 
                        defaultValue={this.state.startingTime}
                        onChange={this.updateTime}
                        onBlur={() => this.props.handleChange(this.state)}
                    ></input>
                    <input 
                        className='time finishing'
                        type='time' 
                        defaultValue={this.state.finishingTime}
                        onChange={this.updateTime}
                        onBlur={() => this.props.handleChange(this.state)}
                    ></input>
                </div>
                <span className={`shift-total`}>
                    {totalString === '' ? '-' : totalString}
                </span>
            </li>
        )
    }
}
