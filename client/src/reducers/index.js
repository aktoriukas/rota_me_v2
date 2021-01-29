import { combineReducers } from 'redux';
import rotaReducer from './rotaReducer';
import userReducer from './userReducer'

const rootReducer = combineReducers({
    rotaReducer,
    userReducer
})
export default rootReducer;