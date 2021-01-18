import React, { Component } from 'react'
import GitHub from '../icons/github.png';
import Email from '../icons/email.png';
import World from '../icons/world-grid.png';

export default class Footer extends Component {
    render() {
        return (
            <footer className='log-in footer'>
                <p>G.S <strong>©2020-2021</strong></p>
                <ul>
                    <li>
                        <a target='_black' href="https://github.com/aktoriukas">
                            <img alt='github' src={GitHub}/>
                        </a>
                    </li>
                    <li>
                        <a target='_black' href="mailto: gediminas.strumila@gmail.com">
                            <img alt='email' src={Email}/>
                        </a>
                    </li>
                    <li>
                        <a target='_black' href="https://aktoriukas.com">
                            <img alt='portfolio' src={World}/>
                        </a>
                    </li>
                </ul>
            </footer>
        )
    }
}
