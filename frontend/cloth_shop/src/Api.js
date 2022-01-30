import axios from 'axios';


export const HOST = "http://127.0.0.1:8000";

const ROOT_API_PATH = "/api";


export const getEmail = (email) => {
    return axios.get(HOST + ROOT_API_PATH + "/email/" + "?email=" + email);
}

export const loginUser = (email, password, rememberMe) => {
    return axios({
          method: 'post',
          url: HOST + '/rest-auth/login/',
          data: {
            email: email,
            password: password
          }
        })
}

export const checkState = (cart_hash, token) => {
    return axios({
        method: 'post',
        url: HOST + ROOT_API_PATH + '/cart/check-state/',
        data: {
            cart_hash: cart_hash,
            token: token
          }
    })
}


export const registerUser = (email, password1, password2) => {
    return axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/rest-auth/registration/',
        data: {
            email : email,
            password1 : password1,
            password2 : password2
        }
    })
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

export const fetchCart = (cart_hash, token) => {

    let request_body = {
        "cart_hash": cart_hash
    }

    let headers = {};

    if (token !== null) {
        headers["Authorization"] = "Token " + token;
    }

    return axios.get(
        HOST + ROOT_API_PATH + "/cart",
        {
            params: request_body,
            headers: headers
        }
    )

    return axios(
        {
            url: HOST + ROOT_API_PATH + "/cart",
            body: request_body,
            headers: headers
        }
    )
}

export const createOrder = (token) => {
    return axios({
        method: 'post',
        url: HOST + ROOT_API_PATH + "/order",
        headers: {"Authorization": "Token " + token}
    })
}

export const getOrders = (token) => {
    return axios({
        method: 'get',
        url: HOST + ROOT_API_PATH + "/order",
        headers: {"Authorization": "Token " + token}
    })
}

export const createCart = (cart_hash=null) => {

    const request_body = {

    }

    if (cart_hash !== null) {
        request_body["cart_hash"] = cart_hash;
    }

    return axios.post(HOST + ROOT_API_PATH + "/cart", request_body)
}

export const addCartItem = (token, cart_hash, product_id, size=null, amount=null) => {

    let data = {
        "cart_hash": cart_hash,
        "product_id": product_id,
        "size": size,
        "amount": amount
    }

    console.log(data);

    return axios.post(HOST + ROOT_API_PATH + "/cart/item", data,  {headers: {
            'Authorization': `Token ${token}`
        }});
}

export const updateCartItem = (token, cart_hash, item_hash, amount) => {

    const data = {
        "cart_hash": cart_hash,
        "item_hash": item_hash,
        "amount": amount,
    }

    return axios.put(HOST + ROOT_API_PATH + "/cart/item", data,  {headers: {
            'Authorization': `Token ${token}`
        }});
}

export const deleteCartItem = (token, cart_hash, item_hash) => {

    const request_body = {
        "cart_hash": cart_hash,
        "item_hash": item_hash,
    }

    const headers = {
        Authorization: "Token " + token
    }

    console.log(request_body);
    console.log(headers);
    return axios.delete(HOST + ROOT_API_PATH + "/cart/item", {
        data: request_body,
        headers: headers
        }
        )
}

const postCartInfo = (cart_hash, item_hash, size, amount, action) => {
    const request_body = {
        "cart_hash": cart_hash,
        "item_hash": item_hash,
        "size": size,
        "amount": amount,
        "action": action
    }

    return axios.post(HOST + ROOT_API_PATH + "/cart", request_body)
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

export const postShippingInfo = (auth_token, first_name, surname, patronymic, phone_number, country, city, region, street, building, flat, index) => {
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


    return axios.post(HOST + ROOT_API_PATH + "/user-info/", request_object,  {headers: {
            'Authorization': `Token ${auth_token}`
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

export function fetchCartData(cart_hash, token) {
    console.log("cart_hash: " + cart_hash);
    console.log("token: " + token);
    let cartPromise = fetchCart(cart_hash, token);

    return {
        cartInfo: wrapPromise(cartPromise)
    };
};

export function checkStateWrapped(cart_hash, token) {
    let cartPromise = checkState(cart_hash, token);

    return {
        cartInfo: wrapPromise(cartPromise)
    };
};

export function createCartObject(token=null) {
    let cartPromise = createCart(token);

    return {
        cartInfo: wrapPromise(cartPromise)
    };
};

export function createCartObjectWithCallback(callback) {
    createCart().then(
        result => {
            callback(result.data);
        }
    )


};

export function addCartItemData(cart_hash, product_id, size=null, amount=null) {
    let cartPromise = addCartItem(cart_hash, product_id, size, amount);

    return {
        cartInfo: wrapPromise(cartPromise)
    };
};

export function updateCartItemData(cart_hash, item_hash, product_size=null, product_amount=null) {
    let cartPromise = updateCartItem(cart_hash, item_hash, product_size, product_amount);

    return {
        cartInfo: wrapPromise(cartPromise)
    };
};

export function deleteCartItemData(token, cart_hash, item_hash) {
    let cartPromise = deleteCartItem(token, cart_hash, item_hash);

    return {
        cartInfo: wrapPromise(cartPromise)
    };
};
