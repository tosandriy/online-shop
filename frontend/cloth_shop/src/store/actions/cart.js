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

export const getCartInfo = cartInfo => {
    return {
        type: actionTypes.CART_GET_CACHED,
        cartHash: cartInfo.token,
        itemsAmount: cartInfo.amount,
        totalPrice: cartInfo.totalPrice
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

export const createNewCart = () => {
    return dispatch => {
        dispatch(startCart());
        createCart()
        .then(
            result => {
                if (!result.data.error) {
                    setCookie("cart_hash", result.data.id, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
                    setCookie("cart_price", result.data.cart_price, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
                    setCookie("cart_count", result.data.count, {"max-age": 60 * 60 * 24 * 7, "path": "/"});
                    dispatch(cartSuccess())
                }

            }
        )
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

                    dispatch(cartSuccess())
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

                    dispatch(cartSuccess())
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

                    dispatch(cartSuccess())
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

                    dispatch(cartSuccess())
                }
            }
        )
    }
}

export const cartCheckState = () => {
    return dispatch => {
        dispatch(startCart());
        const token = getCookie("token");
        const cart_hash = getCookie("cart_hash");
        console.log(cart_hash);
        checkState(cart_hash, token).then(
            result => {
                console.log(result);
                if (result.status === 200) {
                    setCookie("cart_hash", result.data.id);
                    dispatch(
                        cartSuccess(
                            result.data.id,
                            result.data.count,
                            result.data.cart_price
                        )
                    )
                }
                else {
                    createCart(token)
                    .then(
                        result => {
                            setCookie("cart_hash", result.data.id);
                            dispatch(
                                cartSuccess(
                                    result.data.id,
                                    result.data.count,
                                    result.data.cart_price
                                )
                            )
                        }
                    )
                }
            }
        )
    }
}