import './css/index.css';
import Axios from 'axios';
import DatePicker from 'react-date-picker';
import Rota from './elements/Rota/Rota';
import React, { Component } from 'react';
import Alert from './elements/PopUps/AlertBox';
import Cookies from 'universal-cookie';
import Footer from './elements/LandingPage/Footer';
import Welcome from './elements/LandingPage/WelcomeScreen';

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      pass: '',
      message: '',
      signIn: false,
      alert: false,
      API: `https://aktoriukas.com:3001`,
      cookies: new Cookies()
    }
    this.updateName = this.updateName.bind(this)
    this.updatePass = this.updatePass.bind(this)
    this.checkPassword = this.checkPassword.bind(this)
    this.closeWarning = this.closeWarning.bind(this)
    this.signOut = this.signOut.bind(this)
    this.loginWithDemo = this.loginWithDemo.bind(this)
  }
  closeWarning() { this.setState({ alert: false, message: '' }) }

  validDetails(name, pass) {
    if (/[^a-zA-Z0-9]/i.test(name) || /[^a-zA-Z0-9]/i.test(pass)) { return false }
    if (name === undefined || pass === undefined) { return false }
    if (name.length === 0 || pass.length === 0) { return false }
    return true
  }
  loginWithDemo() {
    Axios.post(`${this.state.API}/api/signIn`, { name: 'freeUser', pass: 'nothingToSee' })
      .then((response) => {
        if (response.data) {
          this.state.cookies.set('userID', `${response.data.usersID}`, { path: '/' })
          this.state.cookies.set('userAccess', `${response.data.userAccess}`, { path: '/' })
          this.setState({
            signIn: true,
            userAccess: response.data.userAccess
          })
        }
      })
  }
  checkPassword(e) {
    e.preventDefault()
    const { name, pass } = this.state
    if (!this.validDetails(name, pass)) {
      this.setState({ alert: true, message: 'invalid details' })
    } else {
      Axios.post(`${this.state.API}/api/signIn`, { name: name, pass: pass })
        .then((response) => {
          if (response.data) {
            this.state.cookies.set('logIn', 'true', { path: '/' })
            this.state.cookies.set('userID', `${response.data.usersID}`, { path: '/' })
            this.state.cookies.set('userAccess', `${response.data.userAccess}`, { path: '/' })
            this.state.cookies.set('usersName', `${response.data.usersName}`, { path: '/' })
            this.setState({
              signIn: true,
              userAccess: response.data.userAccess
            })
          } else {
            this.setState({
              alert: true,
              message: 'Incorrect details',
              name: '',
              pass: ''
            })
          }
        })
        .catch(error => console.log(error))
    }
  }
  updateName(e) { this.setState({ name: e.target.value }) }
  updatePass(e) { this.setState({ pass: e.target.value }) }

  signOut() {
    this.state.cookies.remove('userID', { path: '/' })
    this.state.cookies.remove('logIn', { path: '/' })
    this.state.cookies.remove('userAccess', { path: '/' })
    this.setState({ signIn: false })
  }

  render() {
    const { signIn, message, alert, name, pass, cookies } = this.state;
    return (
      <>
        {signIn === true || cookies.get('logIn') === 'true' ?
          <>
            <Rota
              Axios={Axios}
              DatePicker={DatePicker}
              API={this.state.API}
              userAccess={Number(cookies.get('userAccess'))}
              usersID={Number(cookies.get('userID'))}
            />
            <button className='button sign-out' onClick={this.signOut}>Sign Out</button>
          </>
          :
          <div className='welcome-screen'>
            <div className='container'>
              <div className='log-in'>
                <div className='sign-in'>
                  <h1>Sign in</h1>
                  <form className='form' onSubmit={this.checkPassword}>
                    <input value={name} className='input' placeholder='name' type='text' name='name' onChange={this.updateName} />
                    <input value={pass} className='input' placeholder='password' type='password' onChange={this.updatePass} name='password' />
                    <input className='button' type='submit' />
                  </form>
                  <button onClick={this.loginWithDemo} className='button demo'>Demo</button>
                </div>
              </div>
              <Welcome loginWithDemo={this.loginWithDemo} />
            </div>

            <Footer />
          </div>
        }
        {alert ? <Alert close={this.closeWarning} message={message} /> : ''}
      </>
    )
  }
}