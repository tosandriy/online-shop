import React from 'react';
import {useState, useEffect} from 'react';
import CartCounter from './CartCounter';
import CartProductsList from './CartProductsList';
import { useStore, useDispatch, connect } from 'react-redux';
import {updateCartData} from '../store/actions/cart';
import {deleteCartItem, createCartObjectWithCallback, fetchCart, createOrder} from '../Api';


export class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {cartInfoData: null}

        this.deleteProduct = this.deleteProduct.bind(this);
        this.handleCartInfoDataChange = this.handleCartInfoDataChange.bind(this);
        this.createOrderAndGetNewCart = this.createOrderAndGetNewCart.bind(this);
    }

    async deleteProduct(token, cart_hash, item_hash) {
        deleteCartItem(token, cart_hash, item_hash).then(
            result => {
                this.handleCartInfoDataChange(result.data);
            }
        )
    }

    async createOrderAndGetNewCart(token) {
        createOrder(token).then(
        result => {
            console.log(123123213);
            fetchCart(null, token).then(
                result => {
                    this.setState({cartInfoData: result.data})
                }
            )
        })
    }

    handleCartInfoDataChange(cartInfoData) {
        this.props.onCartInfoDataChange(cartInfoData);
        this.setState({
            cartInfoData: cartInfoData
        });
        console.log(this.state);
    }

    componentDidMount() {
        console.log(this.props.cart_hash);
        console.log(this.props.token);
        fetchCart(this.props.cart_hash, this.props.token).then(
            result => {
                if (result.status != 204 && result.data != "") {
                    console.log(result.data);
                    this.handleCartInfoDataChange(result.data);
                }
                else {
                    createCartObjectWithCallback(this.handleCartInfoDataChange);
                }
            }
        )


    }

    render() {
        if (this.state.cartInfoData === null || this.state.cartInfoData == "") {
            return 'Загрузка...';
        }
        console.log(this.state.cartInfoData);
        return (
            <main id="main" class="main_item">
                <div class="main_content cart_content">
                    <CartCounter amount={this.state.cartInfoData.count}/>
                    <div class="cart_main">
                        <CartProductsList
                            products={this.state.cartInfoData.items}
                            cartHash={this.state.cartInfoData.id}
                            deleteProduct={this.deleteProduct}
                            handleCartInfoDataChange={this.handleCartInfoDataChange}
                        />
                        <div  class="final_price">
                            <span class="final_price_border"></span>
                            <div class="final_price_content">
                                <div class="sum_price"><span>ОБЩАЯ СТОИМОСТЬ: </span> <span>{this.state.cartInfoData.cart_price} ₽</span></div>
                                <div class="delivery_price"><span>СТОИМОСТЬ ДОСТАВКИ: </span> <span>{this.state.cartInfoData.delivery_price} ₽</span></div>
                                <div class="delivery_terms"><a href="#">Условия доставки</a></div>
                                <div class="total_price"><span>Итог: </span> <span>{this.state.cartInfoData.cart_price + this.state.cartInfoData.delivery_price} ₽</span></div>
                                <div class="final_price_buy"><button class="btn checkout" onClick={(e) => this.createOrderAndGetNewCart(this.props.token)}>Оформить заказ</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        cart_hash: state.cart.cart_hash
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onCartInfoDataChange: (cartInfoData) => dispatch(updateCartData(cartInfoData.id, cartInfoData.cart_price, cartInfoData.count))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
