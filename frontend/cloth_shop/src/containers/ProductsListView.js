import React, {Suspense, useState} from 'react';
import axios from "axios";
import Filter from '../components/Filter.js';
import Sorter from '../components/Sorter.js';
import Products from "../components/Products.js";
import arrow from "../images/arrow_black.png";

import {fetchProductsData} from "../Api.js";


function ProductsList(props) {
    const [brand, setBrand] = useState([]);
    const [season, setSeason] = useState([]);
    const [size, setSize] = useState([]);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");


    const [order, setOrder] = useState("up");
    const [page, setPage] = useState("1");

    const initialResource = fetchProductsData(order, page, props.match.params.product_type);
    const [resource, setResource] = useState(initialResource);
    return (
        <main id="main" class="main_items">
            <div class="main_content">
                <div class="item_list">
                    <Filter
                    onProductsChange={setResource} arrow={arrow}

                    resource={resource}
                    season={season} setSeason={setSeason}
                    size={size} setSize={setSize}
                    from={from} setFrom={setFrom}
                    to={to} setTo={setTo}
                    brand={brand} setBrand={setBrand}
                    order={order} setOrder={setOrder}
                    page={page} setPage={setPage}
                    />
                    <div>
                        <Suspense fallback={"loading..."}>
                            <Sorter
                            onProductsChange={setResource} resource={resource} arrow={arrow}

                            season={season} setSeason={setSeason}
                            size={size} setSize={setSize}
                            from={from} setFrom={setFrom}
                            to={to} setTo={setTo}
                            brand={brand} setBrand={setBrand}
                            order={order} setOrder={setOrder}
                            page={page} setPage={setPage}
                            />
                        </Suspense>
                        <div class="item_list_container">
                            <Suspense fallback={"loading..."}>
                                <Products resource={resource}/>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ProductsList