import axios from 'axios';
import * as actionTypes from './actionTypes';
import {getCookie, setCookie, deleteCookie} from '../../js/cookie.js';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
        loading: true
    }
}

export const authSuccess = token => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        loading: false
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error,
        loading: false
    }
}

export const logout = () => {
    deleteCookie('token');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}


export const authLogin = (email, password, rememberMe) => {
    return dispatch => {
        dispatch(authStart());
        axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/rest-auth/login/',
          data: {
            email: email,
            password: password
          }
        })
        .then(res => {
            console.log(res);
            const token = res.data.key;
            if(rememberMe){
                setCookie("token", token, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
            }
            else {
                setCookie("token", token);
            }
            dispatch(authSuccess(token));
        })
        .catch(err => {
            console.log(err);
            dispatch(authFail(err))
        })
    }
}

export const authSignup = (email, password1, password2) => {
    return dispatch => {
        dispatch(authStart());
        axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/rest-auth/registration/',
          data: {
            email : email,
            password1 : password1,
            password2 : password2
          }
        })
        .then(result => {
            console.log(result);
            if(!result.data.error) {
                const token = result.data.key;
                setCookie("token", token, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
                dispatch(authSuccess(token));
            }
        }
        ).catch(err => {
            console.log(err);
            dispatch(authFail(err))
        })
    }
}

export const authCheckState = () => {
    return dispatch => {

        const token = getCookie("token");
        if(token !== undefined) {
            dispatch(authSuccess(token))
        }
        else{
            dispatch(authFail(token))
        }
    }
}