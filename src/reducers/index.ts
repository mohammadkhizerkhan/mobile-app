import { combineReducers } from 'redux';
import user from './user.reducer';
import reduxGlobalState from './common.reducer';

const reducers = combineReducers({ user, reduxGlobalState });

export default reducers;
