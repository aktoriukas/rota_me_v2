import React, { Component } from 'react';
import { convertToMinutes, calculateTotal, convertToString } from '../Calculations';

export default class Shift extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            startingTime: '',
            finishingTime: '',
            totalString: '',
            totalMinutes: ''
        }
    }
    componentDidMount() {
        if (this.props.shift !== undefined) {
            const { startingTime, finishingTime} = this.props.shift
            let startingMinutes, finishingMinutes, totalMinutes, totalString;

            startingMinutes = convertToMinutes(startingTime)
            finishingMinutes = convertToMinutes(finishingTime)
            totalMinutes = calculateTotal(startingMinutes, finishingMinutes)
            totalString = convertToString(totalMinutes)
            this.setState({
                startingTime: startingTime,
                finishingTime: finishingTime,
                totalString: totalString,
                totalMinutes: totalMinutes
            })
        }
    }
    static getDerivedStateFromProps(props,state) {
        let startingMinutes, finishingMinutes, totalMinutes, totalString, startingTim, finishingTim;

        if (props.shift !== undefined) {
            const { startingTime, finishingTime} = props.shift

            startingMinutes = convertToMinutes(startingTime)
            finishingMinutes = convertToMinutes(finishingTime)
            totalMinutes = calculateTotal(startingMinutes, finishingMinutes)
            totalString = convertToString(totalMinutes)
            startingTim = startingTime;
            finishingTim = finishingTime;

            console.log(props)
        } else {
            startingTim = ''
            finishingTim = ''
            totalMinutes = ''
            totalString = ''    
        }

        return{
            startingTime: startingTim,
            finishingTime: finishingTim,
            totalString: totalString,
            totalMinutes: totalMinutes
        }    
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
                    {this.state.totalString}
                </span>
            </li>
        )
    }
}
