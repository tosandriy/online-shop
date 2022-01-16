import React, {Suspense, useState, useEffect} from 'react';
import {fetchCartData, createCartObject} from '../Api';
import Cart from '../components/Cart';
import { useStore, useDispatch } from 'react-redux';


function CartLayout(props) {
    const [resource, setResource] = useState();
    const [loaded, setLoaded] = useState(false);

    const store = useStore();

    const state = store.getState();
    console.log(state.cart.cart_hash);
    console.log(state.auth.token);
    console.log(state);
    if (state.cart.cart_hash !== null && !loaded) {
        console.log(state);
        setLoaded(true);
        const resource = fetchCartData(state.cart.cart_hash, state.auth.token);
        setResource(resource);
    }

    function createNewCart() {
        let cartObject = createCartObject();
        setResource(cartObject);
        console.log("postavil resource")
        return cartObject;
    }

    return (
        <>
            <Suspense fallback={"loading..."}>
                <Cart resource={resource} createNewCart={createNewCart}/>
            </Suspense>
        </>
    )
}

export default CartLayout;
