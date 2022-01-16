import React, {useState} from 'react';
import { useStore } from 'react-redux';
import SizeSelectButton from './SizeSelectButton.js';
import AmountSelectButton from './AmountSelectButton.js';
import {addCartItem} from '../Api';

function ProductInfoForm(props) {
    const product = props.resource.product.read().data;
    console.log(product);
    const [amount, setAmount] = useState(1);
    const [size,setSize] = useState(product.sizes[0]);

    const store = useStore();
    const state = store.getState();

    const handleAmountChange = (amount) => {
        setAmount(amount)
    }

    const handleSizeChange = (event) => {
        setSize(event.target.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        console.log(123);
        addCartItem(state.auth.token, state.cart.cart_hash, product.pk, size, amount);
    }

    return (
        <form class="info_form">
            <SizeSelectButton handleSizeChange={handleSizeChange} size={size} sizes={product.sizes}/>
            <AmountSelectButton handleAmountChange={handleAmountChange} amount={amount}/>
            <div class="add_in_cart">
                <button type="submit" name="add_in_cart_btn" class="btn add_in_cart_btn" onClick={onSubmit}>Отправить</button>
            </div>
        </form>
    )
}

export default ProductInfoForm;