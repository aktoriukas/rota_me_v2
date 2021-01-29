import { convertToString } from '../../Calculations';
import React from 'react'

export default function RotaFooter(props) {

    const { allWeekTotal, saveData } = props
    const budget = 27000 // 450H

    return (
        <ul className='rota-footer'>
            <li></li>
            <li></li>
            <li className={`all-week-total ${allWeekTotal < budget ? '' : ' overtime'}`}>
                <span>{convertToString(allWeekTotal)}</span>
                <button className='button save' onClick={saveData}>Save</button>
            </li>
        </ul>
    )
}