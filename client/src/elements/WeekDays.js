import React, { Component } from 'react';
import Weekday from './Weekday';

export default class WeekDays extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             notesVisible: false,
             monday: props.monday,
             week: []
        }
        this.toggleNotes = this.toggleNotes.bind(this)
        this.updateNotes = this.updateNotes.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }
    

    toggleNotes(){
        this.setState({ notesVisible: !this.state.notesVisible })
    }
    componentDidMount () {
        let week = [];
        let newNotes = [];
        const { monday } = this.state;
        const { notes } = this.props;

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

            if( notes !== undefined ) {
                for (let u = 0; u < notes.length; u++) {
                    let jsDate = new Date(Date.parse(notes[u].notesDate));
                    if( jsDate.getDay() === week[i].date.getDay()) {
                        week[i].note = notes[u]
                        newNotes[i] = notes[u]
                        newNotes[i].notesDate = jsDate
                    }
                }
            }
        }
        this.setState({
            week: week,
            notes: newNotes
        })
    } 
    updateNotes(newNote){
        let day = newNote.day - 1 < 0 ? 6 : newNote.day - 1;
        let notes = [...this.state.notes].map((not) => not)
        notes[day] = newNote
        this.setState({ notes }, () => {
            this.props.updateNotes(this.state.notes)
        })
    }

    render() {

        const { notesVisible } = this.state
        return (
            <>
                <ul 
                    className={`weekdays ${notesVisible ? 'notes' : ''}`}>
                    {this.state.week.map( day => <Weekday updateNotes={this.updateNotes} key={day.day} note={day.note} day={day.date}/>)}
                </ul>
                <button className='button notes' onClick={this.toggleNotes}>
                    {notesVisible ? 'hide notes' : 'show notes'}
                </button>
            </>
        )
    }
}