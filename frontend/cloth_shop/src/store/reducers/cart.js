import * as actionTypes from '../actions/actionTypes.js';
import { updateObject } from '../utility';

const initialState = {
    cart_hash: null,
    items_count: null,
    total_price: null,
    loading: null,
    error: null
}

const cartCreateStart = (state, action) => {
    return updateObject(state, {
        loading: true,
        error: null
    })
}

const cartCreateFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    })
}

const cartCreateSuccess = (state, action) => {
    return updateObject(state, {
        loading: false,
        cart_hash: action.cart_hash,
        items_count: action.items_count,
        total_price: action.total_price
    })
}

const cartGetCached = (state, action) => {
    return updateObject(state, {
        loading: false,
        cart_hash: action.cart_hash,
        items_count: action.items_count,
        total_price: action.total_price
    })
}

const cartUpdateData = (cartHash=null, itemsAmount=null, totalPrice=null) => {
    let resultObject = {};
    if (cartHash) {
        resultObject.cart_hash = cartHash
    }
    if (itemsAmount) {
        resultObject.items_count = itemsAmount
    }
    if (totalPrice) {
        resultObject.total_price = totalPrice
    }
    return resultObject
}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.CART_START: return cartCreateStart(state, action);
        case actionTypes.CART_FAIL: return cartCreateFail(state, action);
        case actionTypes.CART_SUCCESS: return cartCreateSuccess(state, action);
        case actionTypes.CART_GET_CACHED: return cartGetCached(state, action);
        default:
            return state;
    }
}

export default reducer;