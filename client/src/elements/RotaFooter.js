import React, { Component } from 'react'
import { convertToString } from '../Calculations';

export default class RotaFooter extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             allWeekTotalMin: this.props.allWeekTotal
        }
    }
    
    render() {
        let budget = 27000 // 450H
        const { allWeekTotalMin } = this.state;
        const { allWeekTotal } = this.props
        return (
            <ul className='rota-footer'> 
                <li></li>
                <li></li>
                <li className={`all-week-total ${allWeekTotalMin < budget ? '' : ' overtime'}`}>
                    <span>{convertToString(allWeekTotal)}</span>
                </li>
            </ul>
        )
    }
}
