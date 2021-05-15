import React from 'react';


class Product extends React.Component {

    render() {
        return (
            <a href={"/product/" + this.props.product.pk} class="product">
                <div class="product_image">
                    <img src={'http://127.0.0.1:8000' + this.props.product.main_photo}/>
                </div>
                <div class="product_discription">
                    {this.props.product.name}
                </div>
                <div class="product_price_block">
                    <div class="product_price">{this.props.product.price}₽</div>
                </div>
            </a>
        )
    }
}

function Products(props) {
    const products = props.resource.products.read().data.results;
    console.log(products);
    return (
        products.map((product) =>
                <Product product={product} key={product.pk}/>

        )
    )
}

export default Products;