import React, { Component } from 'react'

export default class NewWorker extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
        this.setName = this.setName.bind(this);
        this.setRole = this.setRole.bind(this);
        this.register = this.register.bind(this);
    }
    setName(value) {
        this.setState({
            name: value
        })
    }
    setRole(value) {
        this.setState({
            role: value
        })
    }
    register() {
        this.props.submitPerson(this.state.name, this.state.role)
    }

    render() {
        return (
            <div className='new-worker form'>
                <h1>Add new employee</h1>
                <form>
                    <div>
                        <label>Name:</label>
                        <input className='input' type='text' name='name' onChange={(e) => {
                        this.setName(e.target.value)
                        }}/>
                    </div>
                    <div>
                        <label>Role:</label>
                        <input className='input' type='text' name='role' onChange={(e) => {
                        this.setRole(e.target.value)
                        }}/>
                    </div>
                    <div>
                      <button className='button' onClick={this.register}>Register</button>
                    </div>
                </form>
            </div>
        )
    }
}
