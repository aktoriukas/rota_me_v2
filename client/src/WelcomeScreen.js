import React, { Component } from 'react'
import Footer from './elements/Footer';
import img from './img/shot.png'
import img1 from './img/shot1.png'
import img2 from './img/shot2.png'

export default class WelcomeScreen extends Component {
    render() {
        return (
        <div className='right'>
            <div className='about'>
              <h1>rota_me</h1>
              <p>Make your day easier</p>
              <p className='info'>For profesionals who look after their team.
                <br></br> Easy way to store, update and share scedules.
              </p>
              <ul>
                <li>Easy to use</li>
                <li>Rich with features</li>
                <li>Quick to share</li>
                <li>All you need in one</li>
              </ul>

              <p className='early-accesss'>For early access email: gediminas.strumila@gmail.com</p>
              <button onClick={this.props.loginWithDemo} className='button demo'>For demo press here</button>
            </div>
            <div className='images'>
                <div className='container'><img src={img}></img></div>
                <div className='container'><img src={img1}></img></div>
                <div className='container'><img src={img2}></img></div>
            </div>
          </div>
          )
    }
}