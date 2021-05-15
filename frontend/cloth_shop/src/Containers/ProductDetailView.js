import React, {Suspense, useState} from 'react';
import axios from 'axios';

import ProductInfoForm from '../components/ProductInfoForm.js';
import {fetchProductData} from '../FetchProductApi.js';



function ProductDetail(props) {
    const initialResource = fetchProductData(props.match.params.product_id);
    const [resource, setResource] = useState(initialResource);
    const [size, setSize] = useState(null);
    return (
    <>
        <main id="main" class="main_item">
            <div class="main_content">
                <div class="item_descr">
                    <Suspense fallback={<NameCallback/>}>
                        <ProductName resource={resource}/>
                    </Suspense>
                    <div class="item_descr_main">
                            <Suspense fallback={<ImageFallback/>}>
                                <ProductImage resource={resource}/>
                            </Suspense>
                            <Suspense fallback={<InfoCallback/>}>
                                <div class="item_info">
                                    <ProductData resource={resource} />
                                    <ProductInfoForm resource={resource}/>
                                </div>
                            </Suspense>
                    </div>
                </div>
            </div>
        </main>
    </>
    )
}

function NameCallback() {
    return (
        <div class="item_title item_title_loading"></div>
    )
}

function ImageFallback() {
    return (
        <div class=" item_pics_loading">
            <div class="item_pic item_pic_loading">
            </div>
        </div>
    )
}

function InfoCallback() {
    return (
        <div class="item_info item_info_loading">
            <div class="item_price item_info_text item_price_loading item_info_text_loading">
            </div>
            <div class="item_brand item_info_text item_info_text_loading">
            </div>
            <div class="item_season item_info_text item_info_text_loading item_info_text_loading">
            </div>
            <div class="item_collection item_info_text item_info_text_loading">
            </div>
            <div class="item_color item_info_text item_info_text_loading">
            </div>
            <div class="item_materials item_info_text item_info_text_loading">
            </div>
            <div class="item_size item_info_list item_info_choose_loading">
            </div>
            <div class="count_select_block item_info_choose_loading">
            </div>
            <div class="add_in_cart add_in_cart_loading">
            </div>
        </div>
    )
}

function ProductName(props) {

    const product = props.resource.product.read().data;

    return (
        <div class="item_title ">
            {product.name}
        </div>
    )
}

function ProductImage(props) {

    const product = props.resource.product.read().data;

    return (
        <div class="item_pic">
            <img src={"http://127.0.0.1:8000" + product.main_photo}/>
        </div>
    )
}

function ProductData(props) {

    const product = props.resource.product.read().data;

    return (
        <>
            <div class="item_price item_info_text">
                <span>{product.price}₽</span>
            </div>
            <div class="item_brand item_info_text">
                <span>Бренд: </span><span>{product.brand}</span>
            </div>
            <div class="item_season item_info_text">
                <span>Сезон: </span><span>{product.season}</span>
            </div>
        </>
    )
}

export default ProductDetail;