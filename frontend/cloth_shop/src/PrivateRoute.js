import {Redirect, Route} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import MainPage from "./containers/MainPageView";
import { useSelector, useDispatch } from 'react-redux';
import { authStart, authSuccess } from './store/actions/auth';
import {getCookie} from './js/cookie.js';


export default function PrivateRoute({ component: Component, token,store, ...rest }) {

    return (
        <Route
        {...rest}
        render={props => (

          store.getState().auth.is_authenticated !== false
            ? <Component {...props} />
            : <Redirect to="/" />
        )}
        />
    )

};