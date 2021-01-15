import React, { Component } from 'react'
import { getWeekday } from '../Calculations';

export default class Weekday extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             notesText: '',
             date: props.day,
             notesDate: new Date(Date.parse(props.day)),
             day: props.day.getDay()
        }

        this.updatevalue = this.updatevalue.bind(this)
        this.sendNotes = this.sendNotes.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }
    componentDidMount(){
        const { note } = this.props;
        if( note !== undefined ) {
            this.setState({
                notesText: note.notesText,
                notesDate: note.notesDate,
                notesID: note.notesID
            })
        }
    }
    sendNotes(){
        this.props.updateNotes(this.state)
    }

    updatevalue(e) {
        this.setState({ notesText: e.target.value })
    }
    render() {
        const { day } = this.props
        const { notesText } = this.state
        return (
            <li>
                <div className='day'>{getWeekday(day.getDay())}</div>
                <div className='date'>
                    {`${day.getMonth() + 1}-${day.getDate()}`}
                </div>
                <textarea 
                    className='weekday-note'
                    value={notesText} 
                    onChange={this.updatevalue} 
                    name="note" 
                    cols="20" 
                    rows="5"
                    onBlur={this.sendNotes}
                />
            </li>
        )
    }
}