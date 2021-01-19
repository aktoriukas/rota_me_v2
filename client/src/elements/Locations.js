import React, { Component } from 'react';
import Warning from './Warning';
import Cookies from 'universal-cookie';

export default class Locations extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             newLocation: '',
             warning: false,
             id: 0,
             message: 'Are you sure wanna delete it?',
             cookies: new Cookies(),
             access: 2 
        }
        this.updateNewLocation = this.updateNewLocation.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.closeWarning = this.closeWarning.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }
    componentDidMount() { this.setState({ access: Number(this.state.cookies.get('userAccess'))})}
    updateNewLocation(e){
        this.setState({ newLocation: e.target.value })
    }
    handleClick() {
        if ( this.props.userAccess > 1) {
            this.props.showAlert('no access')
            return }

        this.props.addNewLocation(this.state.newLocation)
        this.setState({ newLocation: '' })
    }
    showWarning(id) {
        if(this.state.access > 1) { this.props.showAlert('access denied')}
        else { this.setState({ warning: true, id: id }) }
    }
    closeWarning() {
        this.setState({ warning: false, id: 0 })
    }
    
    render() {
        const { newLocation, warning, id, message } = this.state
        const { sendDeleteRequestLocation } = this.props
        return (
            <div className='locations-list'>
                <h1>Locations</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.locations.map(location => {
                            return (
                                <tr key={location.locationsID}>
                                    <td><h2>{location.location}</h2></td>
                                    <td className='options'><button 
                                        onClick={() => this.showWarning(location.locationsID)} 
                                        className='button'
                                    >
                                    delete
                                    </button></td>
                                </tr>
                            )
                        })}
                        <tr className='form'>
                            <td>
                                <input 
                                placeholder='location' 
                                className='input' 
                                value={newLocation} 
                                name='location' type='text' 
                                onChange={this.updateNewLocation}/>
                            </td>
                            <td className='options'>
                                <button 
                                    onClick={this.handleClick} 
                                    className='button'>
                                    add
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {warning ? 
                <Warning 
                    message={message}
                    no={this.closeWarning}
                    yes={()=> {
                        sendDeleteRequestLocation(id)
                        this.closeWarning()
                    }}
                /> 
                : ''}
            </div>
        )
    }
}
