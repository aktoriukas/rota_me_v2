import React, { Component } from 'react';
import NewWorker from './Forms/NewWorker';
import EmployeesList from './EmployeesList';

export default class Header extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             options: false
        }
        this.toggleOptions = this.toggleOptions.bind(this)
        this.updateState = this.updateState.bind(this)
        this.sendDeleteRequest = this.sendDeleteRequest.bind(this)
        this.deleteEmployee = this.deleteEmployee.bind(this)
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
            this.props.Axios.delete(`http://localhost:3001/api/delete/${id}`).then(response => {
                resolve(response)
            })
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

    submitPerson = (name, role) => {
        this.props.Axios.post('http://localhost:3001/api/insert',
        {name: name, role: role})
    };    
    toggleOptions() { this.setState({ options: !this.state.options })}

    render() {
        return (
            <div>
                <button className='button' onClick={this.toggleOptions}>Options</button>

                {this.state.options ?
                    <div className='pop-up options'>
                        <div className='inner'>
                            <NewWorker 
                                submitPerson={this.submitPerson}
                            />
                            <EmployeesList 
                                people={this.state.people}
                                delete={this.deleteEmployee}
                            />
                            <button className='button' onClick={this.toggleOptions}>close</button>
                        </div>
                    </div>
                    :
                    ''
                }
            </div>
        )
    }
}
