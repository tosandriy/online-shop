import React from "react";
import { Route } from "react-router-dom";
import { connect } from 'react-redux';
import ProductsList from "./Containers/ProductsListView";
import ProductDetail from "./Containers/ProductDetailView";
import MainPage from "./Containers/MainPageView";
import Cart from "./Containers/Cart";

import PrivateRoute from "./PrivateRoute.js";

import * as actions from './store/actions/auth';

const BaseRouter = (props) => (
    <div>
        <Route exact path="/" component={MainPage}/>{" "}
        <Route exact path="/products/:product_type/" component={ProductsList}/>{" "}
        <Route exact path="/product/:product_id/" component={ProductDetail}/>{" "}
        <PrivateRoute exact path="/cart/" token={props.token} store={props.store} component={Cart}/>
    </div>
)
const mapStateToProps = state => ({ token: state.token });
export default connect(mapStateToProps, actions)(BaseRouter);