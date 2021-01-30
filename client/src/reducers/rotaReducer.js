const initialState = {
    alertBox: {
        visible: false,
        message: ''
    },
    warning: {
        visible: false,
        message: ''
    },
    hoursCalc: {
        allWeekTotal: 0,
    },
    date: {
        today: '',
        monday: '',
        sunday: ''
    },
    holidays: {
        options: {
            visible: false,
            person: {}
        }
    },
    notes: [],
    locations: {},
    rotaIsLoaded: false,
    people: {},
    userAccess: '',
    userAccessID: '',
    userID: '',
    API: 'https://aktoriukas.com:3001'
}


const rotaReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'GET_PEOPLE':
            state.people = [...action.payload]
            return state

        case 'GET_LOCATIONS':
            state.locations = [...action.payload]
            return state

        case 'SET_ROTA_IS_LOADED':
            state.rotaIsLoaded = true
            return state

        case 'UPDATE_ALL_WEEK_TOTAL':
            state.hoursCalc.allWeekTotal = action.payload
            return state
        case 'GET_NOTES':
            state.notes = [...action.payload]
            return state

        case 'SET_DATE':
            state.date.today = action.payload.today
            state.date.monday = action.payload.monday
            state.date.sunday = action.payload.sunday
            return state

        case 'CLEAR_OLD_SHIFTS':
            state.people = undefined;
            state.rotaIsLoaded = false;
            return state

        case 'OPEN_ALERT_BOX':
            state.alertBox.visible = true;
            state.alertBox.message = action.payload;
            return state

        case 'CLOSE_ALERT_BOX':
            state.alertBox.visible = false;
            state.alertBox.message = '';
            return state

        case 'OPEN_WARNING':
            state.warning.visible = true;
            return state

        case 'CLOSE_WARNING':
            state.warning.visible = false;
            state.warning.message = '';
            return state

        case 'DISPLAY_PERSON_HOLIDAYS':
            state.holidays.options.visible = true;
            state.holidays.options.person = action.payload;
            return state

        default:
            return state
    }
}

export default rotaReducer;