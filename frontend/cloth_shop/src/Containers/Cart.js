import React from 'react';


class Cart extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <main id="main" class="main_item">
                <div class="main_content cart_content">
                    <div class="cart_title">
                        <h2 class="cart_title_name">Корзина</h2><span class="cart_number_items">2 товара</span>
                    </div>
                    <div class="cart_main">
                        <div class="cart_items">
                            <div class="cart_item">
                                <img class="cart_item_image" src="images/ruins1.png"/>
                                <div class="cart_item_descr">
                                    <div class="cart_item_descr_header">
                                        <span class="cart_item_descr_header_title">Футблока Ruina White</span><button class="remove_from_cart"><img src="images/remove.png"/></button>
                                    </div>
                                    <div class="cart_item_descr_info">
                                        <span>Код товара : 1287874</span><br/><span>Размер : XL</span>
                                    </div>

                                    <div  class="cart_item_descr_footer">
                                        <div class="count_select_block cart_item_count_select_block">
                                            <div class="count_select">
                                                <button type="button" class="count_minus count_char" onclick="countChange(this)"><img src="images/minus.png"/></button><input type="number" class="cur_selected_count" name="count" id="count" value="1" min="1" max="30"/><button type="button" class="count_plus count_char" onclick="countChange(this)"><img src="images/plus.png"/></button>
                                            </div>
                                        </div>
                                        <div class="cart_item_descr_header_price">1000 ₽</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div  class="final_price">
                            <span class="final_price_border"></span>
                            <div class="final_price_content">
                                <div class="sum_price"><span>ОБЩАЯ СТОИМОСТЬ: </span> <span>2000 ₽</span></div>
                                <div class="delivery_price"><span>СТОИМОСТЬ ДОСТАВКИ: </span> <span>500 ₽</span></div>
                                <div class="delivery_terms"><a href="#">Условия доставки</a></div>
                                <div class="total_price"><span>Итог: </span> <span>2500 ₽</span></div>
                                <div class="final_price_buy"><button class="btn checkout">Оформить заказ</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

}

export default Cart;
