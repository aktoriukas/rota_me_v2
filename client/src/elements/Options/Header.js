import React, { Component } from 'react';
import NewWorker from '../Forms/NewWorker';
import EmployeesList from './EmployeesList';
import Locations from './Locations';
import AlertBox from '../PopUps/AlertBox';
import { SavePerson, SaveLocation } from '../../API';
import UserDetails from '../Forms/UserDetails';
import Cookies from 'universal-cookie';


export default class Header extends Component {

    constructor(props) {
        super(props)

        this.state = {
            options: false,
            alertBox: false,
            message: '',
            people: [],
            usersID: props.usersID,
            cookies: new Cookies()
        }
        this.toggleOptions = this.toggleOptions.bind(this)
        this.updateState = this.updateState.bind(this)
        this.sendDeleteRequest = this.sendDeleteRequest.bind(this)
        this.deleteEmployee = this.deleteEmployee.bind(this)
        this.addNewLocation = this.addNewLocation.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.showAlert = this.showAlert.bind(this)
        this.sendDeleteRequestLocation = this.sendDeleteRequestLocation.bind(this)
    }
    getPeople = () => {
        const { Axios, API } = this.props
        return new Promise(resolve => {
            const userID = {
                userID: this.state.usersID
            }
            Axios.get(`${API}/api/getPeople`, { params: { userID } })
                .then(response => {
                    resolve(response.data);
                })
        })
    }
    updateState(people) {
        this.setState({
            people: people,
            userAccess: Number(this.state.cookies.get('userAccess'))
        })
    }
    componentDidMount = async (state, props) => {
        let updateState = this.updateState
        await this.getPeople()
            .then(function (people) {
                updateState(people)
            })
    }
    sendDeleteRequest(id) {
        const { Axios, API } = this.props
        if (this.state.userAccess > 1) {
            this.setState({ alertBox: true, message: 'access denied' })
            return
        }
        return new Promise(resolve => {
            Axios.delete(`${API}/api/delete/employee/${id}`).then(response => {
                resolve(response)
            })
        })
    }
    sendDeleteRequestLocation(id) {
        const { Axios, API } = this.props
        Axios.delete(`${API}/api/delete/location/${id}`).then(response => {
            this.props.getLocations()
        })
    }
    deleteEmployee(id) {
        let updateState = this.updateState
        this.sendDeleteRequest(id)
            .then(response => {
                this.getPeople()
                    .then((people) => {
                        updateState(people)
                    })
                this.props.rerender()
            })
    }
    addNewLocation = async (name) => {
        const { Axios, API, usersID } = this.props
        let message = ''
        const result = await SaveLocation(Axios, API, usersID, name)

        switch (result) {
            case 0:
                this.props.getLocations()
                message = 'saved'
                break;
            case 1: message = 'field is empty'
                break
            case 2: message = 'wrong input'
                break
            default: message = 'error'
                break
        }
        this.setState({ alertBox: true, message: message })
    }

    submitPerson = async (name, role) => {
        if (this.state.userAccess > 1) {
            this.setState({ alertBox: true, message: 'access denied' })
            return
        }
        const { Axios, API, usersID } = this.props
        const result = await SavePerson(Axios, API, usersID, name, role)
        let message = ''

        switch (result) {
            case 0:
                this.props.rerender()
                this.componentDidMount()
                message = 'saved'
                break
            case 1: message = 'field is empty'
                break
            case 2: message = 'wrong input'
                break
            default: message = 'error'
                break
        }
        this.setState({ alertBox: true, message: message })
    };
    showAlert(message) { this.setState({ alertBox: true, message: message }) }
    toggleOptions() { this.setState({ options: !this.state.options }) }
    closeAlert() { this.setState({ alertBox: false }) }

    render() {
        const { people, alertBox, message, options, userAccess } = this.state;
        const { locations, usersID, API } = this.props;
        const root = document.getElementById('root');
        if (options) {
            root.classList.add('options')
            document.body.classList.add('options')
        } else {
            root.classList.remove('options')
            document.body.classList.remove('options')
        }
        return (
            <div>
                <button className='button' onClick={this.toggleOptions}>Options</button>

                {options ?
                    <div className='pop-up options'>
                        <div className='inner'>
                            <div className='top-options'>
                                <NewWorker
                                    submitPerson={this.submitPerson}
                                    showAlert={this.showAlert}
                                />
                                <UserDetails
                                    API={API}
                                    usersID={usersID}
                                    showAlert={this.showAlert}
                                    userAccess={userAccess}
                                />
                            </div>
                            <div className='settings'>
                                <EmployeesList
                                    people={people}
                                    delete={this.deleteEmployee}
                                    showAlert={this.showAlert}
                                    userAccess={userAccess}
                                    API={API}
                                    usersID={usersID}
                                    rerender={this.props.rerender}
                                />
                                <Locations
                                    locations={locations}
                                    addNewLocation={this.addNewLocation}
                                    sendDeleteRequestLocation={this.sendDeleteRequestLocation}
                                    showAlert={this.showAlert}
                                    userAccess={userAccess}
                                />
                            </div>
                            <button className='button' onClick={this.toggleOptions}>close</button>
                        </div>
                    </div>
                    :
                    ''
                }
                {alertBox ? <AlertBox message={message} close={this.closeAlert} /> : ''}
            </div>
        )
    }
}
