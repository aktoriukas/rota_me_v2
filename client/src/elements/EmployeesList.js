import React, { Component } from 'react';
import Warning from './Warning';

export default class EmployeesList extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             warning: false
        }
        this.showWarning = this.showWarning.bind(this);
        this.hideWarning = this.hideWarning.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    };

    showWarning = (id) => {
        this.setState({
            id: id,
            warning: true
        })
    }
    hideWarning = () => {
        this.setState({ warning: false })
    }
    handleDelete() {
        this.hideWarning()
        this.props.delete(this.state.id)
    }
    
    render() {
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
                                        {/* <button className='button'>edit</button> */}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {this.state.warning ?
                <Warning
                    yes={this.handleDelete}
                    no={this.hideWarning}
                    message={'Are you sure you wanna delete this employee and all related shifts?'}
                />
                :
                ''
                }
            </div>
        )
    }
}
