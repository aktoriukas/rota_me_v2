import React, { Component } from 'react'

export default class Warning extends Component {
    render() {
        return (
            <div className='pop-up warning'>
                <div className='inner'>
                    <p>{this.props.message}</p>
                    <div>
                        <button onClick={this.props.yes} className='button'>yes</button>
                        <button onClick={this.props.no} className='button'>no</button>
                    </div>
                </div>       
            </div>     
        )
    }
}
