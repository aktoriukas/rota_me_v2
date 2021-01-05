import React, { Component } from 'react';
import NewWorker from './Forms/NewWorker';
import EmployeesList from './EmployeesList';
import Locations from './Locations';
import AlertBox from './AlertBox';

export default class Header extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             options: false,
             alertBox: false,
             message: ''
        }
        this.toggleOptions = this.toggleOptions.bind(this)
        this.updateState = this.updateState.bind(this)
        this.sendDeleteRequest = this.sendDeleteRequest.bind(this)
        this.deleteEmployee = this.deleteEmployee.bind(this)
        this.addNewLocation = this.addNewLocation.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.sendDeleteRequestLocation = this.sendDeleteRequestLocation.bind(this)
    }
    getPeople = () => {
        return new Promise(resolve => {
            this.props.Axios.get('http://localhost:3001/api/getPeople').then(response => {
                resolve(response.data)
            })    
        })
    }
    updateState(people) {
        this.setState({ people: people })
    }
    componentDidMount(state, props) {
        let updateState = this.updateState
        this.getPeople()
        .then(function(people) {
            updateState(people)
        })
    }
    sendDeleteRequest(id) {
        return new Promise(resolve => {
            this.props.Axios.delete(`http://localhost:3001/api/delete/employee/${id}`).then(response => {
                resolve(response)
            })
        })
    }
    sendDeleteRequestLocation(id) {
        this.props.Axios.delete(`http://localhost:3001/api/delete/location/${id}`).then(response => {
            this.props.getLocations()
        })
    }
    deleteEmployee(id) {
        let updateState = this.updateState
        this.sendDeleteRequest(id).then(response => {
            console.log(response)
            this.getPeople().then((people)=> {
                updateState(people)
            })
            this.props.rerender()
        })
    }
    addNewLocation = (name) => {
        if (name !== '' && name !== undefined) {
            this.props.Axios.post('http://localhost:3001/api/insert/location',
            {name: name}).then(() => {
                console.log(this)
                this.setState({ 
                    alertBox: true,
                    message: 'Location been saved'
                },() => this.props.getLocations())
            })    
        }else {
            this.setState({ 
                alertBox: true,
                message: 'locations is empty'
            })
        }
    }

    submitPerson = (name, role) => {
        this.props.Axios.post('http://localhost:3001/api/insert/people',
        {name: name, role: role})
    };    
    toggleOptions() { this.setState({ options: !this.state.options })}
    closeAlert() { this.setState({ alertBox: false })}

    render() {
        const { people, alertBox, message } = this.state;
        const { locations } = this.props;
        return (
            <div>
                <button className='button' onClick={this.toggleOptions}>Options</button>

                {this.state.options ?
                    <div className='pop-up options'>
                        <div className='inner'>
                            <NewWorker 
                                submitPerson={this.submitPerson}
                            />
                            <div className='settings'>
                                <EmployeesList 
                                    people={people}
                                    delete={this.deleteEmployee}
                                />
                                <Locations
                                    locations={locations}
                                    addNewLocation={this.addNewLocation}
                                    sendDeleteRequestLocation={this.sendDeleteRequestLocation}
                                />
                            </div>
                            <button className='button' onClick={this.toggleOptions}>close</button>
                        </div>
                    </div>
                    :
                    ''
                }
                {alertBox ? <AlertBox message={message} close={this.closeAlert} /> : ''}
            </div>
        )
    }
}
