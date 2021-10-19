import React, {useState} from 'react';
import SizeSelectButton from './SizeSelectButton.js';
import AmountSelectButton from './AmountSelectButton.js';


function ProductInfoForm(props) {
    const product = props.resource.product.read().data;
    console.log(product);
    const [amount, setAmount] = useState(1);
    const [size,setSize] = useState(null);

    const handleAmountChange = (amount) => {
        setAmount(amount)
    }

    const handleSizeChange = (event) => {
        setSize(event.target.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

    }

    return (
        <form class="info_form" onSubmit={(event) => {event.preventDefault(); console.log(product.pk,amount,size || product.sizes[0])}}>
            <SizeSelectButton handleSizeChange={handleSizeChange} size={size} sizes={product.sizes}/>
            <AmountSelectButton handleAmountChange={handleAmountChange} amount={amount}/>
            <div class="add_in_cart">
                <button type="submit" name="add_in_cart_btn" class="btn add_in_cart_btn">Отправить</button>
            </div>
        </form>
    )
}

export default ProductInfoForm;