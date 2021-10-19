import axios from 'axios';
import { store } from './store/store';

export const HOST = "http://127.0.0.1:8000";

const ROOT_API_PATH = "/api";


export const getEmail = (email) => {
    return axios.get("http://127.0.0.1:8000/api/email/" + "?email=" + email);
}

const fetchProduct = (product_id) => {
    return axios.get(HOST + ROOT_API_PATH + "/product/" + product_id)
}

const fetchProducts = (order, page, product_type) => {
    return axios.get(HOST + ROOT_API_PATH + "/products/" + order + "?page=" + page + "&product_type=" + product_type)
}

const fetchBrands = () => {
    return axios.get(HOST + ROOT_API_PATH + "/brands")
}

const fetchCart = (cart_hash) => {

    const request_body = {
        "cart_hash": cart_hash
    }

    return axios.get(HOST + ROOT_API_PATH + "/cart", request_body)
}

const fetchShippingInfo = (token) => {

    console.log("token: " + token);
    const axiosConfig = {
        headers: {
            'Authorization': `Token ${token}`
        },

    };

    return axios.get(HOST + ROOT_API_PATH + "/user-info", axiosConfig);
}

export const postShippingInfo = (first_name, surname, patronymic, phone_number, country, city, region, street, building, flat, index) => {
    let request_object = {
            "first_name": first_name,
            "surname": surname,
            "patronymic": patronymic,
            "phone_number": phone_number,
            "country": country,
            "city": city,
            "region": region,
            "street": street,
            "building": building,
            "flat": flat,
            "index": index
    };

    let token = "";


    return axios.post(HOST + ROOT_API_PATH + "/user-info/", request_object,  {headers: {
            'Authorization': `Token ${token}`
        }});
}


const fetchFilteredProducts = (brand,season,size,from,to, order, page) => {
    return axios.get(HOST + ROOT_API_PATH + "/filter?brand=" + brand + "&season=" + season +
        "&size=" + size + "&from=" + from + "&to=" + to + "&order=" + order + "&page=" + page)
}

function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    r => {
      status = "success";
      result = r;
    },
    e => {
      status = "error";
      result = e;
    }
  );

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      }
      return result;
    }
  };
};

export function fetchProductsData(order="up", page="1", product_type="all") {
    let productPromise = fetchProducts(order, page, product_type);

    return {
        products: wrapPromise(productPromise)
    };
};

export function fetchFilteredProductsData(brand, season, size, from, to, order, page) {
    let filteredProductsPromise = fetchFilteredProducts(brand,season,size,from,to, order, page)

    return {
        products: wrapPromise(filteredProductsPromise)
    }
}

export function fetchProductData(product_id) {
    let productPromise = fetchProduct(product_id);

    return {
        product: wrapPromise(productPromise)
    };

};

export function fetchBrandsData() {
    let brandsPromise = fetchBrands();

    return {
        brands: wrapPromise(brandsPromise)
    };
};

export function fetchShippingInfoData(token) {
    let shippingPromise = fetchShippingInfo(token);

    return {
        shippingInfo: wrapPromise(shippingPromise)
    };
};

export function fetchCartData(token) {
    let cartPromise = fetchCart(token);

    return {
        cartInfo: wrapPromise(cartPromise)
    };
};