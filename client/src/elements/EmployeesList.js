import React, { Component } from 'react';
import Warning from './Warning';
import Cookies from 'universal-cookie';
import EmployeesOptions from './EmployeesOptions';

export default class EmployeesList extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             warning: false,
             cookies: new Cookies(),
             access: 2 ,
             options: false,
             optionsPerson: {}
        }
        this.showWarning = this.showWarning.bind(this);
        this.hideWarning = this.hideWarning.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this)
        this.openOptions = this.openOptions.bind(this)
    };
    componentDidMount() { this.setState({ access: Number(this.state.cookies.get('userAccess'))})}

    showWarning = (id) => {
        if(this.state.access > 1) { this.props.showAlert('access denied')}
        else {
            this.setState({
                id: id,
                warning: true
            })    
        }
    }
    hideWarning = () => { this.setState({ warning: false }) }
    handleDelete() {
        this.hideWarning()
        this.props.delete(this.state.id)
    }
    openOptions = (person) => { this.setState({ options: !this.state.options, optionsPerson: person})}
    
    render() {
        const { warning, options, optionsPerson } = this.state
        return (
            <div className='employees-list'>
                <h1>Employees</h1>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>options</th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.props.people.map(person => {
                            return (
                                <tr key={person.peopleID}>
                                    <td><h2>{person.peopleName}</h2></td>
                                    <td><h3>{person.peopleRole}</h3></td>
                                    <td>
                                        <button 
                                            onClick={() => this.showWarning(person.peopleID)} 
                                            className='button'>delete
                                        </button>
                                        <button onClick={() => this.openOptions(person)} className='button'>options</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {warning ?
                    <Warning
                        yes={this.handleDelete}
                        no={this.hideWarning}
                        message={'Are you sure you wanna delete this employee and all related shifts?'}
                    />
                :
                    ''
                }
                {options ?
                    <EmployeesOptions 
                        person={optionsPerson}
                        API={this.props.API}
                        usersID={this.props.usersID}
                    />
                :
                    ''
                }
            </div>
        )
    }
}
