import axios from 'axios';


const fetchProduct = () => {
    return axios.get("http://127.0.0.1:8000/api/product/1")
}

const fetchProducts = (order, page) => {
    return axios.get("http://127.0.0.1:8000/api/products/" + order + "?page=" + page)
}

const fetchBrands = () => {
    return axios.get("http://127.0.0.1:8000/api/brands")
}

const fetchFilteredProducts = (brand,season,size,from,to, order, page) => {
    console.log("http://127.0.0.1:8000/api/filter?brand=" + brand + "&season=" + season +
        "&size=" + size + "&from=" + from + "&to=" + to + "&order=" + order + "&page=" + page);
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

export function fetchProductsData(order="up", page="1") {
    let productPromise = fetchProducts(order, page);

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

export function fetchProductData() {
    let productPromise = fetchProduct();

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