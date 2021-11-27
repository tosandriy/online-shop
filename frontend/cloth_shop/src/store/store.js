import thunk from 'redux-thunk';
import auth_reducer from './reducers/auth';
import cart_reducer from './reducers/cart';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(combineReducers({auth: auth_reducer, cart: cart_reducer}), composeEnhances(
    applyMiddleware(thunk)
));