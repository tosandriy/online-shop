import axios from 'axios';


const fetchProduct = (product_id) => {
    return axios.get("http://127.0.0.1:8000/api/product/" + product_id)
}

const fetchProducts = (order, page, product_type) => {
    return axios.get("http://127.0.0.1:8000/api/products/" + order + "?page=" + page + "&product_type=" + product_type)
}

const fetchBrands = () => {
    return axios.get("http://127.0.0.1:8000/api/brands")
}

const fetchFilteredProducts = (brand,season,size,from,to, order, page) => {
    return axios.get("http://127.0.0.1:8000/api/filter?brand=" + brand + "&season=" + season +
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