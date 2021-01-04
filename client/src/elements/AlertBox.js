import React, { Component } from 'react'

export default class AlertBox extends Component {
    render() {
        return (
            <div id='alert-message-container' className='pop-up'>
                <div className='inner'>
                    <h1 className='title'>Message</h1>
                    <p className='message'>{this.props.message}</p>
                    <button className='button' onClick={this.props.close}>close</button>
                </div>
            </div>
        )
    }
}
