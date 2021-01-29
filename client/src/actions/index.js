export const loadRota = () => {
    return {
        type: 'SET_ROTA_IS_LOADED'
    }
}
export const updateAllWeekTotal = (total) => {
    return {
        type: 'UPDATE_ALL_WEEK_TOTAL',
        payload: total
    }
}
export const getPeople = (date) => {
    return {
        type: 'GET_PEOPLE',
        payload: date
    }
}
export const getLocations = (date) => {
    return {
        type: 'GET_LOCATIONS',
        payload: date
    }
}
export const setDate = (date) => {
    return {
        type: 'SET_DATE',
        payload: date
    }
}
export const getNotes = (date) => {
    return {
        type: 'GET_NOTES',
        payload: date
    }
}
export const clearOldShifts = () => {
    return {
        type: 'CLEAR_OLD_SHIFTS'
    }
}

// ALERT BOX =========================================
export const openAlertBox = (message) => {
    return {
        type: 'OPEN_ALERT_BOX',
        payload: message
    }
}
export const closeAlertBox = () => {
    return {
        type: 'CLOSE_ALERT_BOX'
    }
}
// Warning == =========================================
export const closeWarning = () => {
    return {
        type: 'CLOSE_WARNING'
    }
}
export const openWarning = () => {
    return {
        type: 'OPEN_WARNING'
    }
}
// HOLIDAYS ============================================

export const displayPersonHolidays = (person) => {
    return {
        type: 'DISPLAY_PERSON_HOLIDAYS',
        payload: person
    }
}

// USER ==============================================================================

export const toggleUserOptions = () => {
    return {
        type: 'TOGGLE_USER_OPTIONS'
    }
}