import React from 'react';
import { getOrders, HOST } from '../Api';
import { useStore, useDispatch, connect } from 'react-redux';


class Orders extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            ordersData: null
        }
    }

    componentDidMount() {
        getOrders(this.props.token).then(
            result => {
                this.setState({ordersData: result.data})
                console.log(this.state.ordersData)
            }
        )
    }

    render() {
        if (this.state.ordersData !== null) {
            return (
                <div class="orders">
                    <h2 class="orders_title">История заказов</h2>
                        <OrderList orders={this.state.ordersData}/>
                </div>
            )
        }
        else {
        return (
            <div class="orders">
                <h2 class="orders_title">История заказов</h2>
            </div>
        )

        }

    }
}

function OrderList(props) {
    console.log(props.orders)
    return (
        props.orders.map((order) => <Order order={order}/>)
    )
}

function Order(props) {
    return (
        <div class="order">
            <div class="order_title">
                <span class="order_number">Заказ №{props.order.id}</span>
                <span class="order_date">{props.order.created_at}</span>
            </div>
            <div class="order_list">
                <div class="order_list_items">
                    <ItemsList items={props.order.items}/>
                </div>
                <div class="order_info">
                    <div class="order_info_block">
                        <div class="order_info_status">
                            <span class="order_info_title">Статус: </span><span>{props.order.status}</span>
                        </div>
                        <div class="order_info_address">
                            <span class="order_info_title">Адрес доставки: </span><br/><span>{props.order.address}</span>
                        </div>
                        <div class="order_info_final_price">
                            <span class="order_info_title">Итог: </span><span>{props.order.price}₽</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ItemsList(props) {
    return (
        props.items.map(item => <Item item={item}/>)
    )
}

function Item(props) {
    return (
        <div class="order_list_item">
            <div class="order_list_item_img_block">
                <img src={HOST + props.item.product.main_photo}/>
            </div>
            <div class="order_list_item_info">
                <div class="order_list_item_info_block">
                    <div class="order_list_item_title">
                        <span>{props.item.product.name}</span>
                    </div>
                    <div class="order_list_item_price">
                        <span>{props.item.product.price}₽</span>
                    </div>
                    <div class="order_list_item_param">
                        <div>
                            <span>Количество: </span><span>{props.item.amount} шт</span>
                        </div>
                        <div>
                            <span>Код товра: </span><span>{props.item.product.id}</span>
                        </div>
                        <div>
                            <span>Размер: </span><span>{props.item.size}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.auth.token
    }
}

export default connect(mapStateToProps)(Orders);
