import * as actionTypes from './actionTypes';
import {getCookie, setCookie, deleteCookie} from '../../js/cookie.js';
import {fetchCartData, createCart,
        addCartItemData, updateCartItemData,
        deleteCartItemData, checkState
        } from '../../Api';


export const startCart = () => {
    return {
        type: actionTypes.CART_START
    }
}

export const cartSuccess = (token, amount, totalPrice) => {
    return {
        type: actionTypes.CART_SUCCESS,
        cart_hash: token,
        items_count: amount,
        total_price: totalPrice
    }
}

export const cartFail = cartInfo => {
    return {
        type: actionTypes.CART_FAIL,
        error: cartInfo.message
    }
}

export const getCartInfo = token => {
    return {
        type: actionTypes.CART_GET_CACHED,
        cart_hash: token
    }
}

export const cartUpdateData = (cartHash=null, itemsAmount=null, totalPrice=null) => {
    let resultUpdateObject = {
        type: actionTypes.CART_UPDATE_DATA
    }
    if (cartHash) {
        resultUpdateObject.cartHash = cartHash
    }
    if (itemsAmount) {
        resultUpdateObject.itemsAmount = itemsAmount
    }
    if (totalPrice) {
        resultUpdateObject.totalPrice = totalPrice
    }
    return resultUpdateObject
}

export const updateCartData = (id, cart_price, count) => {
    return dispatch => {
        setCookie("cart_hash", id, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
        setCookie("cart_price", cart_price, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
        setCookie("cart_count", count, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
        dispatch(cartSuccess(id, count, cart_price))
    }
}

export const getCartData = (cart_hash) => {
    return dispatch => {
        dispatch(startCart());
        fetchCartData(cart_hash)
        .then(
            result => {
                if (!result.data.error) {
                    setCookie("cart_hash", result.data.id, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
                    setCookie("cart_price", result.data.cart_price, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
                    setCookie("cart_count", result.data.count, {"max-age": 60 * 60 * 24 * 7, "path": "/"});

                    dispatch(cartSuccess(result.data.id, result.data.count, result.data.cart_price))
                }
            }
        );
    }
}

export const addItemToCart = (cart_hash, product_id, size=null, amount=null) => {
    return dispatch => {
        dispatch(startCart());
        addCartItemData(cart_hash, product_id, size, amount)
        .then(
            result => {
                if (!result.data.error) {
                    setCookie("cart_hash", result.data.id, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
                    setCookie("cart_price", result.data.cart_price, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
                    setCookie("cart_count", result.data.count, {"max-age": 60 * 60 * 24 * 7, "path": "/"});

                    dispatch(cartSuccess(result.data.id, result.data.count, result.data.cart_price))
                }
            }
        )
    }
}

export const removeItemFromCart = (cart_hash, product_id, size=null, amount=null) => {
    return dispatch => {
        dispatch(startCart());
        addCartItemData(cart_hash, product_id, size, amount)
        .then(
            result => {
                if (!result.data.error) {
                    setCookie("cart_hash", result.data.id, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
                    setCookie("cart_price", result.data.cart_price, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
                    setCookie("cart_count", result.data.count, {"max-age": 60 * 60 * 24 * 7, "path": "/"});

                    dispatch(cartSuccess(result.data.id, result.data.count, result.data.cart_price))
                }
            }
        )
    }
}

export const updateItemCart = (cart_hash, product_id, size=null, amount=null) => {
    return dispatch => {
        dispatch(startCart());
        addCartItemData(cart_hash, product_id, size, amount)
        .then(
            result => {
                if (!result.data.error) {
                    setCookie("cart_hash", result.data.id, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
                    setCookie("cart_price", result.data.cart_price, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
                    setCookie("cart_count", result.data.count, {"max-age": 60 * 60 * 24 * 7, "path": "/"});

                    dispatch(cartSuccess(result.data.id, result.data.count, result.data.cart_price))
                }
            }
        )
    }
}

export const cartCheckState = () => {
    return dispatch => {

        const cart_hash = getCookie("cart_hash");
        if (cart_hash !== undefined) {
            dispatch(getCartInfo(cart_hash))
        }
        else {
            dispatch(cartFail())
        }
    }
}