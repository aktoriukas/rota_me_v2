import React, { Component } from 'react'
import img from './img/shot.png'
import img1 from './img/shot1.png'
import img2 from './img/shot2.png'

export default function WelcomeScreen(props) {

  return (
    <div className='main'>
      <div className='about'>
        <h1>rota_me</h1>
        <p>Make your day easier</p>
        <p className='info'>For profesionals who look after their team.
              <br></br> Easy way to store, update and share scedules.
        </p>
      </div>
      <div className='features'>
        <ul>
          <li>Manage holidays</li>
          <li>Leave notes</li>
          <li>Share with your team</li>
        </ul>
        <p className='early-accesss'>For early access email:</p>
        <a className='button email' target='_black' href='mailto: gediminas.strumila@gmail.com'>Email</a>
        <span className='or'>or</span>
        <button onClick={props.loginWithDemo} className='button demo'>Demo</button>
      </div>
      <div className='screenshots'>
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  )
}