import React, { Component } from 'react';
import Person from './Person';
import { getStartingDay } from '../Calculations';
import WeekDays from './WeekDays';

export default class Rota extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             isLoaded: false,
             date: new Date()

        }
        this.updateWeeklyState = this.updateWeeklyState.bind(this)
        this.updateDate = this.updateDate.bind(this)
    }
    updateWeeklyState(day) {

        const { people, date } = this.state;
        let newPeople = [];

        for (let key in people) {
            newPeople[key] = people[key]
        }

        // loop throuth people / find same id
        for (let i = 0; i < people.length; i++) {
            if(people[i].id === day.person.id) {

                // make new day if it's empty
                if( newPeople[i].weekDays[day.day] == undefined) {
                    newPeople[i].weekDays[day.day] = {}
                }
                newPeople[i].weekDays[day.day].startingTime = day.startingTime;
                newPeople[i].weekDays[day.day].finishingTime = day.finishingTime;

                // add date
                let shiftDate = new Date(date.getTime());

                shiftDate.setDate(shiftDate.getDate() + (day.day - shiftDate.getDay()) )
                shiftDate.toISOString()

                newPeople[i].weekDays[day.day].date = shiftDate;
            }
        }


        this.setState({
            people: newPeople
        })
    }
    componentDidMount() {

        // get data from database
        this.props.Axios.get('http://localhost:3001/api/get').then((respons)=> {
            let newPeople = [...respons.data];
            newPeople.map((item) => item.weekDays = [])
            this.setState({
                people: newPeople,
                isLoaded: true
            })
        })
    }
    // set week starting date
    updateDate(t) {
        console.log(t)
        this.setState({
            date: t
        })
    }

    render() {
        console.log(this.state)
        const { isLoaded, people } = this.state;
        return (
                <div className='rota-container'>
                    <this.props.DatePicker 
                        onChange={this.updateDate}
                        value={this.state.date}
                    />

                    <ul className='rota-header'>
                        <li className='name'>Name</li>
                        <li><WeekDays /></li>
                        <li className='week-total'>Week total</li>
                    </ul>

                    {isLoaded ?
                        <div className='rota'>
                            {this.state.people.map((person)=> {

                                return (
                                    <Person 
                                    key={person.id}
                                    person={person}
                                    updateWeeklyState={this.updateWeeklyState}
                                    />
                                )
                            })}
                        </div>
                        :
                        <div>Loading</div>
                    }
                        
                    <button>Save</button>
                </div>

        )
    }
}
