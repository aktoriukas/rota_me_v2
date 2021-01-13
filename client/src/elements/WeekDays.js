import React, { Component } from 'react';
import Weekday from './Weekday';
import { getStandartDate } from '../Functions';

export default class WeekDays extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             notesVisible: false,
             monday: props.monday
        }
        this.toggleNotes = this.toggleNotes.bind(this)
    }
    

    toggleNotes(){
        this.setState({ notesVisible: !this.state.notesVisible })
    }
    static getDerivedStateFromProps(props, state) {
        let week = []
        const { monday } = state;

        class WeekDay {
            constructor(day, date, note) {
                this.day = day;
                this.date = date;
                this.note = note;
            }
            setDate(){
                this.date = this.date.addDays(this.day)
            }
        }
        for(let i = 0; i < 7; i++) {
            week[i] = new WeekDay(i, new Date(monday))
            week[i].setDate()

            if( props.notes !== undefined ) {
                for (let u = 0; u < props.notes.length; u++) {
                    let jsDate = new Date(Date.parse(props.notes[u].notesDate));
                    if( jsDate.getDay() === week[i].date.getDay()) {
                        week[i].note = props.notes[u]
                    }
                }
            }
        }
        return {week: week}
    } 

    render() {

        const { notesVisible } = this.state
        return (
            <>
                <ul 
                    className={`weekdays ${notesVisible ? 'notes' : ''}`}>
                    {this.state.week.map( day => <Weekday updateNotes={this.props.updateNotes} key={day.day} note={day.note} day={day.date}/>)}
                </ul>
                <button className='button notes' onClick={this.toggleNotes}>
                    {notesVisible ? 'hide notes' : 'show notes'}
                </button>
            </>
        )
    }
}