import {Redirect, Route} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import MainPage from "./containers/MainPageView";
import { useSelector, useDispatch } from 'react-redux';
import { authStart, authSuccess } from './store/actions/auth';
import {getCookie} from './js/cookie.js';


export default function PrivateRoute({ component: Component, token,store, ...rest }) {
    const dispatch = useDispatch();
    dispatch({"type": "AUTH_SUCCESS", token: getCookie("token")});
    return (
        <Route
        {...rest}
        render={props => (

          store.getState().token
            ? <Component {...props} />
            : <Redirect to="/" />
        )}
        />
    )

};