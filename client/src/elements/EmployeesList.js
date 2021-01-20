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
            access: 2,
            options: false,
            optionsPerson: {}
        }
        this.showWarning = this.showWarning.bind(this);
        this.hideWarning = this.hideWarning.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this)
        this.openOptions = this.openOptions.bind(this)
    };
    componentDidMount() { this.setState({ access: Number(this.state.cookies.get('userAccess')) }) }

    showWarning = (id) => {
        if (this.state.access > 1) { this.props.showAlert('access denied') }
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
    openOptions = (person) => {
        this.setState({ options: false }, () => {
            this.setState({ options: true, optionsPerson: person })
        })
    }

    render() {
        const { warning, options, optionsPerson } = this.state
        return (
            <>
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
                                let className = '';
                                if (optionsPerson.peopleID === person.peopleID) {
                                    className = 'active'
                                }
                                return (
                                    <tr className={className} key={person.peopleID}>
                                        <td><h2>{person.peopleName}</h2></td>
                                        <td><h3>{person.peopleRole}</h3></td>
                                        <td className='options'>
                                            <button
                                                onClick={() => this.showWarning(person.peopleID)}
                                                className='button employee-delete'>delete
                                            </button>
                                            <button onClick={() => this.openOptions(person)} className='button employee-options'>options</button>
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
                </div>
                <div className='employees-options'>
                    <h1>Options</h1>
                    {options ?
                        <EmployeesOptions
                            person={optionsPerson}
                            API={this.props.API}
                            usersID={this.props.usersID}
                            showAlert={this.props.showAlert}
                            userAccess={this.props.userAccess}
                            rerender={this.props.rerender}
                        />
                        :
                        ''
                    }
                </div>
            </>
        )
    }
}
