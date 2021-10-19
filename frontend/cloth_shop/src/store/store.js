import thunk from 'redux-thunk';
import reducer from './reducers/auth';
import { createStore, compose, applyMiddleware } from 'redux';

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(reducer, composeEnhances(
    applyMiddleware(thunk)
));