import React from 'react'

export default function Warning(props) {
    return (
        <div className='pop-up warning'>
            <div className='inner'>
                <p>{props.message}</p>
                <div>
                    <button onClick={props.yes} className='button'>yes</button>
                    <button onClick={props.no} className='button'>no</button>
                </div>
            </div>
        </div>
    )
}
