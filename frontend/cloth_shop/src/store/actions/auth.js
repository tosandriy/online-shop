import * as actionTypes from './actionTypes';
import {getCookie, setCookie, deleteCookie} from '../../js/cookie.js';
import {loginUser, registerUser} from '../../Api';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = token => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        is_authenticated: true
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error,
        is_authenticated: false
    }
}

export const logout = () => {
    deleteCookie('token');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}


export const authLogin = (email, password, rememberMe, cart_hash) => {
    return dispatch => {
        dispatch(authStart());
        loginUser(email, password, rememberMe)
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
        registerUser()
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