import React, { Component } from 'react';
import {  getTotalObj } from '../Calculations';
// import TimeField from 'react-simple-timefield';
export default class Shift extends Component {

    constructor(props) {
        super(props)
        let date = new Date(props.monday);
        date = date.addDays(props.weekDay -1)

        this.state = {
            startingTime: '',
            finishingTime: '',
            totalString: '',
            totalMinutes: 0,
            peopleID: props.person.peopleID,
            date: date,
            weekDay: props.weekDay,
            location: '',
            locationID: 0
        }
        this.updateTime = this.updateTime.bind(this)
        this.updateState = this.updateState.bind(this)
        this.changeLocation = this.changeLocation.bind(this)
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
        const { shift } = this.props
        if (shift !== undefined) {
            const { startingTime, finishingTime} = this.props.shift
            const { totalMinutes, totalString } = getTotalObj(startingTime, finishingTime)

            this.setState({ 
                location: shift.location, 
                locationID: shift.locationID,
                shiftID: shift.shiftID
            })
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
    changeLocation(e) {
        this.setState({ locationID: e.target.value},() => {
            this.props.handleChange(this.state)
        })
    }

    render() {
        const { totalString, totalMinutes, locationID } = this.state;
        const { handleChange, locations } = this.props;
        let shiftState = ''
        // console.log(this.state)
        if (totalMinutes === 0) {
            shiftState = 'off'
        }
        let backgroundColor;
        if (locationID === 0 ) { backgroundColor = 'transparent'}
        const locationColor = {
            backgroundColor: backgroundColor
        }
        return (
            <li className={`shift-container ${shiftState}`}>
                <div className='shift'>
                    <input 
                        className='time starting'
                        type='time' 
                        defaultValue={this.state.startingTime}
                        onChange={this.updateTime}
                        onBlur={() => handleChange(this.state)}
                    ></input>
                    <input 
                        className='time finishing'
                        type='time' 
                        defaultValue={this.state.finishingTime}
                        onChange={this.updateTime}
                        onBlur={() => handleChange(this.state)}
                    ></input>
                </div>
                <span className={`shift-total`}>
                    {totalString === '' ? '-' : totalString}
                </span>
                <div className='location-selector'>
                <select 
                    value={locationID}
                    onChange={this.changeLocation}
                    onBlur={() => handleChange(this.state)}
                    style={locationColor}
                    >
                    <option value='0'>OFF</option>
                    {locations.map(location => {
                        return (
                            <option 
                                key={location.locationsID}
                                value={location.locationsID}
                                >
                            {location.location}
                            </option>
                        )
                    })}
                </select>
                </div>
            </li>
        )
    }
}
