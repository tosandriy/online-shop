import React, {useState} from 'react';
import { useStore } from 'react-redux';
import {HOST, updateCartItem} from '../Api';
import plus from '../images/plus.png';
import minus from '../images/minus.png';
import remove from '../images/remove.png';


export default function CartProductsList(props) {
    return (
        <div class="cart_items">
            {props.products.map(product => <CartProduct product={product}
                                                        cartHash={props.cartHash}
                                                        deleteProduct={props.deleteProduct}
                                                        handleCartInfoDataChange={props.handleCartInfoDataChange}
                                                        />)}
        </div>
    )
}

function CartProduct(props) {
    const store = useStore();
    const state = store.getState();
    console.log(props.cartHash);
    console.log(props.product.id);

    let itemCount = props.product.amount;


    function changeItemCount(difference) {
        updateCartItem(state.auth.token, props.cartHash, props.product.id, itemCount + difference).then(
            result => {
                console.log(result);
                props.handleCartInfoDataChange(result.data);
            }
        );
//        setItemCount(itemCount + difference);

    }

    return (
        <div class="cart_item">
            <img class="cart_item_image" src={HOST + props.product.product.main_photo}/>
            <div class="cart_item_descr">
                <div class="cart_item_descr_header">
                    <span class="cart_item_descr_header_title">{props.product.product.name}</span><button onClick={() => {props.deleteProduct(state.auth.token, props.cartHash, props.product.id)}} class="remove_from_cart"><img src={remove}/></button>
                </div>
                <div class="cart_item_descr_info">
                    <span>Код товара : {props.product.product.id}</span><br/><span>Размер : {props.product.size}</span>
                </div>

                <div  class="cart_item_descr_footer">
                    <div class="count_select_block cart_item_count_select_block">
                        <div class="count_select">
                            <button type="button" class="count_minus count_char" onClick={() => {changeItemCount(-1)}}><img src={minus}/></button><input type="number" class="cur_selected_count" name="count" id="count" value={itemCount} min="1" max="30"/><button type="button" class="count_plus count_char" onClick={() => {changeItemCount(1)}}><img src={plus}/></button>
                        </div>
                    </div>
                    <div class="cart_item_descr_header_price">{props.product.price} ₽</div>
                </div>
            </div>
        </div>
    )
}