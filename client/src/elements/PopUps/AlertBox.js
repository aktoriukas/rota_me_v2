import React from 'react'

export default function AlertBox(props) {
    return (
        <div id='alert-message-container' className='pop-up'>
            <div className='inner'>
                <p className='message'>{props.message}</p>
                <button className='button' onClick={props.close}>close</button>
            </div>
        </div>
    )
}