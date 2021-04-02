import React, {useState} from 'react';
import {fetchFilteredProductsData} from "../FetchProductApi.js"


function OrderTitle(props) {
    console.log(props.order);
    if (props.order === 'up'){
            return <span className="cur_select_sort">возрастанию цены</span>;
        }
        else if (props.order === 'down'){
            return <span className="cur_select_sort">убыванию цены</span>;
        }
        else if (props.order === 'popular'){
            return <span className="cur_select_sort">популярности</span>;
        }
    return null;
}

function Sorter(props){
    console.log("props:", props);
    const products = props.resource.products.read().data.results;

    console.log(products);
    const [isOpen, setIsOpen] = useState(false);


    const onChange = (e,value) => {
        props.setOrder(value);
    }

    const upCompare = (a,b) => {
        if (a.price < b.price) {return -1}
        if (a.price > b.price) {return 1}
        return 0
    }

    const downCompare = (a,b) => {
        if (a.price < b.price) {return 1}
        if (a.price > b.price) {return -1}
        return 0
    }

    const popularCompare = (a,b) => {
        if (a.sold < b.sold) {return 1}
        if (a.sold > b.sold) {return -1}
        return 0
    }

    return (
        <div class="sort">
            <span>Сортировать по:</span>
            <span>
                <div class="select_container sort_type">
                    <div class="sort_select" id="sort_select"
                    onClick={(e) => {setIsOpen(!isOpen)}}>
                        <OrderTitle order={props.order} />
                        <img src={props.arrow} className={isOpen ? 'rotate_arrow' : ''}/>
                    </div>
                    <div class={isOpen ? "select_list_sort sort_list-open" : "select_list_sort"}>
                        <div class="select_list_wrapper_sort">
                            <div class="select_list_item_sort" onClick={(e) => {
                            props.setOrder('up');
                            setIsOpen(false);
                            props.onProductsChange(fetchFilteredProductsData(props.brand, props.season,
                            props.size, props.from, props.to, props.order, props.page));
                            }}>
                                <input type="radio" id="price_up" value="" name="sort_type" checked={props.order === 'up' ? 'checked' : ''} />
                                <label for="price_up">возрастанию цены</label>
                            </div>
                            <div class="select_list_item_sort" onClick={(e) => {
                            props.setOrder('down');
                            setIsOpen(false);
                            props.onProductsChange(fetchFilteredProductsData(props.brand, props.season,
                            props.size, props.from, props.to, props.order, props.page));
                            }}>
                                <input type="radio" id="price_down" value="" name="sort_type" checked={props.order === 'down' ? 'checked' : ''} />
                                <label for="price_down">убыванию цены</label>
                            </div>
                            <div class="select_list_item_sort" onClick={(e) => {
                            props.setOrder('popular');
                            setIsOpen(false);
                            props.onProductsChange(fetchFilteredProductsData(props.brand, props.season,
                            props.size, props.from, props.to, props.order, props.page));
                            }}>
                                <input type="radio" id="name_sort" value="" name="sort_type"checked={props.order === 'popular' ? 'checked' : ''} />
                                <label for="name_sort">популярности</label>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        </div>
    )
}


export default Sorter;