import React, { Component } from 'react';
import NewWorker from './Forms/NewWorker';

export default class Header extends Component {

    submitPerson = (name, role) => {
        console.log(name)
        this.props.Axios.post('http://localhost:3001/api/insert',
        {name: name, role: role})
    
        // setPeopleList([
        //   ...peopleList,
        //   { peopleName: name, peopleRole: role},
        // ]);
    };    

    render() {
        return (
            <header>
                <NewWorker 
                    submitPerson={this.submitPerson}
                />
            </header>
        )
    }
}
