import React from "react";
import { Route } from "react-router-dom";
import ProductsList from "./Containers/ProductsListView";
import ProductDetail from "./Containers/ProductDetailView";

const BaseRouter = () => (
    <div>
        <Route exact path="/" component={ProductsList}/>{" "}
        <Route exact path="/product/:product_id/" component={ProductDetail}/>{" "}
    </div>
)

export default BaseRouter;