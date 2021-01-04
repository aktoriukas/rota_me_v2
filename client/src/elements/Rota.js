import React, { Component } from 'react';
import Person from './Person';
import { getMondayDate, convertToMinutes, calculateTotal } from '../Calculations';
import { getStandartDate, makeSqlDate } from '../Functions'
import WeekDays from './WeekDays';
import RotaFooter from './RotaFooter';
import AlertBox from './AlertBox';
import Header from './Header';

// import cloneDeep from 'lodash/cloneDeep';

export default class Rota extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             isLoaded: false,
             people: [],
             date: new Date(),
             monday: getMondayDate(new Date()),
             allWeekTotal: 0,
             alertBox: false

        }
        this.updateDate = this.updateDate.bind(this)
        this.addShiftsToPeople = this.addShiftsToPeople.bind(this)
        this.clearOldShifts = this.clearOldShifts.bind(this)
        this.updatePeopleShifts = this.updatePeopleShifts.bind(this)
        this.saveData = this.saveData.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.rerender = this.rerender.bind(this)

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
                    people[i]['weekDays'][weekDay].shiftID = shift.shiftsID;
                }
            }
        });
        this.setState({
            people: people,
            isLoaded: true
        }, () => {
            this.calculateAllTotal()
        })
    }
    clearOldShifts() {
        this.setState({people: undefined, isLoaded: false})
    }
    calculateAllTotal() {
        let peopleCopy = [...this.state.people]
        let total = 0;
        let startingTime, finishingTime, dayTotal
        peopleCopy.forEach(person => {
            person.weekDays.forEach(day => {
                startingTime = convertToMinutes(day.startingTime)
                finishingTime = convertToMinutes(day.finishingTime)
                dayTotal = calculateTotal(startingTime, finishingTime) 
                total += dayTotal
            })
        });
        this.setState({
            allWeekTotal: total
        })
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
            addShiftsToPeople(shifts, people)})})
    }
 
    updateDate(t) {
        let monday = getMondayDate(t)
        // Clear shifts
        this.setState({
            date: t,
            monday: monday
        }, this.componentDidMount())
    }
    updatePeopleShifts(shift) {
        const { people } = this.state
        let peopleCopy = [...people].map(person => {
            if ( person.peopleID === shift.peopleID) {
                person.weekDays[shift.weekDay] = {}
                person.weekDays[shift.weekDay].startingTime = shift.startingTime
                person.weekDays[shift.weekDay].finishingTime = shift.finishingTime
                person.weekDays[shift.weekDay].date = shift.date
            }
            return person
        })
        this.setState({
            people: peopleCopy
        }, this.calculateAllTotal)
    }
    saveData = () => {
        let update = [];
        let insert = [];

        this.state.people.forEach(person => {
            person.weekDays.forEach(day => {
                let shift = {}

                let sqlDate = makeSqlDate(day.date)

                shift.peopleID = person.peopleID;
                shift.startingTime = day.startingTime;
                shift.finishingTime = day.finishingTime;
                shift.date = sqlDate;

                if ( day.shiftID === undefined) {
                    insert.push(shift)
                } else {
                    shift.shiftID = day.shiftID
                    update.push(shift)
                }
            })
        })
        this.props.Axios.put(`http://localhost:3001/api/update`, {
            update: update,
            insert: insert
        }).then(() => {
            this.setState({ alertBox: true })
        })
    }
    closeAlert() {
        this.setState({ alertBox: false })
    }
    rerender() {
        this.componentDidMount()
    }

    render() {
        const { isLoaded, people, alertBox } = this.state;
        let peopleElements = []
        if(isLoaded) {
            peopleElements = people.map(person => {
                return <Person monday={this.state.monday} updatePeopleShifts={this.updatePeopleShifts} key={person.peopleID} person={person} />
            })    
        }
        return (

            <div className='rota-container'>

                <header id='top-rota-header'>
                    <this.props.DatePicker 
                        onChange={this.updateDate}
                        value={this.state.date}
                    />
                    <Header
                        Axios={this.props.Axios}
                        rerender={this.rerender}
                    />
                </header>

                <ul className='rota-header'>
                    <li className='name'>Name</li>
                    <li>
                        <WeekDays monday={this.state.monday}/>
                    </li>
                    <li className='week-total'>Week total</li>
                </ul>

                {isLoaded ?
                    peopleElements
                    :
                    <div>Loading</div>
                }
                <RotaFooter
                    allWeekTotal={this.state.allWeekTotal}
                    saveData={this.saveData}
                />
                {alertBox ?
                    <AlertBox 
                        message='Your data been saved'
                        close={this.closeAlert}
                    />
                    :
                    ''
                }
            </div>

        )
    }
}
