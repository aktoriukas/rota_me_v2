import React, { Component } from 'react';
import Shifts from './Shifts';

export default class Person extends Component {

    render() {
        return (
            <div className='person-container'>
                <div className='about'>
                    <h3 className='name'>{this.props.person.name}</h3>
                    <h4 className='title'>{this.props.person.role}</h4>
                </div>
                <Shifts 
                    person={this.props.person}
                    updateWeeklyState={this.props.updateWeeklyState}
                />
            </div>
        )
    }
}