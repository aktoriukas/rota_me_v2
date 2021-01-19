import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import Axios from 'axios';
import { changePassword } from '../../API';


export default class UserDetails extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            cookies: new Cookies(),
            password: '',
            passwordRep: '',
            oldPassword: '',
        }
        this.updatePass = this.updatePass.bind(this)
        this.saveNewPass = this.saveNewPass.bind(this)
        this.cleanInputs = this.cleanInputs.bind(this)
    }
    updatePass(e) {
        const value = e.target.value
        switch(e.target.name) {
            case 'repeat':
                this.setState({ passwordRep: value})
                break
            case 'pass':
                this.setState({ password: value})
                break
            case 'old':
                this.setState({ oldPassword: value})
                break
            default:
                break
        }
    }
    cleanInputs() { this.setState({ password: '', passwordRep: '', oldPassword: ''})}
    saveNewPass = async (e) => {        
        e.preventDefault()
        if ( this.props.userAccess > 1) {
            this.props.showAlert('no access')
            return }
        const { usersID, API } = this.props
        const { password, passwordRep, oldPassword } = this.state
        const userName = this.state.cookies.get('usersName' , { path: '/'} )
        if( password !== passwordRep) { 
            this.props.showAlert('passwords not maching')
            this.cleanInputs()
            return
        }else {
            const response = await changePassword(Axios, API, usersID, oldPassword, password, userName)
            this.props.showAlert(response.data)
        }
    }
    
    render() {
        const userName = this.state.cookies.get('usersName' , { path: '/'} )
        const { password, passwordRep, oldPassword } = this.state
        return (
            <div className='user-details'>
                <h1>User details</h1>
                <div className='options'>
                    <h2>{userName}</h2>
                    <form className='form'>
                        <input 
                            value={oldPassword}
                            name='old'
                            type='password'
                            onChange={this.updatePass}
                            placeholder='old password' 
                            className='input old' />
                        <input 
                            value={password}
                            name='pass'
                            type='password'
                            onChange={this.updatePass}
                            placeholder='new password' 
                            className='input pass' />
                        <input 
                            value={passwordRep}
                            name='repeat'
                            type='password'
                            onChange={this.updatePass}
                            placeholder='repeat password' 
                            className='input repeat' />
                        <button onClick={this.saveNewPass} className='button'>save</button> 
                    </form>
                </div>
            </div>
        )
    }
}
