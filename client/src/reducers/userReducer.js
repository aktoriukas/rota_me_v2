const initialState = {
    userOptions: {
        visible: false
    }
}
const userReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'SET_USER_ID':
            return state

        case 'TOGGLE_USER_OPTIONS':
            state.userOptions.visible = !state.userOptions.visible
            return state

        default:
            return state
    }
}
export default userReducer;