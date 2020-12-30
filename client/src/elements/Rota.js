import React, { Component } from 'react';
import Person from './Person';
import { getMondayDate } from '../Calculations';
import { getStandartDate } from '../Functions'
import WeekDays from './WeekDays';
// import cloneDeep from 'lodash/cloneDeep';

export default class Rota extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             isLoaded: false,
             people: [],
             date: new Date(),
             monday: getMondayDate(new Date())

        }
        this.updateDate = this.updateDate.bind(this)
        this.addShiftsToPeople = this.addShiftsToPeople.bind(this)
        this.clearOldShifts = this.clearOldShifts.bind(this)

        // Prototype to add days
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }    
    }
    getPeople =  () => {
        return new Promise(resolve => {
            let newPeople;
            this.props.Axios.get('http://localhost:3001/api/getPeople')
            .then(response => {
                newPeople = [...response.data];
                newPeople.map((item) => item.weekDays = []);
              resolve(newPeople)
        
            })
        })
    }



    getShifts = () => {
        return new Promise(resolve => {
      
            let interval = {
                weekBegining: getStandartDate(this.state.monday),
                weekEnd : getStandartDate(this.state.monday.addDays(6))    
            }
            this.props.Axios.get(`http://localhost:3001/api/getShifts`, { params: {interval} })
            .then((response)=> {
                let shift = [...response.data]
                resolve(shift)
            })
        });
    };
    addShiftsToPeople(shifts, people) {
        console.log(people)
        shifts.forEach(shift => {

            let jsDate = new Date(Date.parse(shift.shiftsDate));
            let weekDay = jsDate.getDay();
            if(weekDay === 0) { weekDay = 7}

            for(let i=0; i < people.length; i++) {

                if ( shift.peopleID === people[i]['peopleID']){

                    people[i]['weekDays'][weekDay] = {}
                    people[i]['weekDays'][weekDay].startingTime = shift.startingTime;
                    people[i]['weekDays'][weekDay].finishingTime = shift.finishingTime;
                    people[i]['weekDays'][weekDay].date = jsDate;
                }
            }
        });
        this.setState({
            people: people,
            isLoaded: true
        })
    }
    clearOldShifts() {
        this.setState({people: undefined, isLoaded: false})
    }

    componentDidMount(state) {

        const getShifts = this.getShifts
        const getPeople = this.getPeople
        const addShiftsToPeople = this.addShiftsToPeople
        const clearOldShifts = this.clearOldShifts

        getPeople()
        .then(function(people) { 

        getShifts()
        .then(function(shifts){
            clearOldShifts()
            addShiftsToPeople(shifts, people)
        })
        })
    }
 
    updateDate(t) {
        let monday = getMondayDate(t)
        // Clear shifts
        this.setState({
            date: t,
            monday: monday
        }, this.componentDidMount())
    }

    render() {
        const { isLoaded, people } = this.state;
        let peopleElements = []
        if(isLoaded) {
            peopleElements = people.map(person => {
                return <Person key={person.peopleID} person={person} />
            })    
        }
        return (

            <div className='rota-container'>

                <this.props.DatePicker 
                    onChange={this.updateDate}
                    value={this.state.date}
                />

                <ul className='rota-header'>
                    <li className='name'>Name</li>
                    <li><WeekDays monday={this.state.monday}/></li>
                    <li className='week-total'>Week total</li>
                </ul>

                {isLoaded ?
                    peopleElements
                    :
                    <div>Loading</div>
                }
                    
                <button>Save</button>
            </div>

        )
    }
}
