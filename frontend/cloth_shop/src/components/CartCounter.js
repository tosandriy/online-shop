import React from 'react';

export default class CartCounter extends React.Component {
    constructor(props) {
        super(props);


        this.humanizeAmount = this.humanizeAmount.bind(this);
    }

    humanizeAmount(amount) {

        let firstNumber = amount % 10;

        let amountWordForm;
        switch (firstNumber) {
            case 1:
                amountWordForm = "товар";
                break;
            case 2:
            case 3:
            case 4:
                amountWordForm = "товара";
                break;
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 0:
            default:
                amountWordForm = "товаров"
        }
        return `${amount} ${amountWordForm}`;
    }



    render() {
        console.log(this.props.amount);
        return (
            <div class="cart_title" key={this.props.amount}>
                <h2 class="cart_title_name">Корзина</h2><span  class="cart_number_items">{this.humanizeAmount(this.props.amount)}</span>
            </div>
        )
    }
}
