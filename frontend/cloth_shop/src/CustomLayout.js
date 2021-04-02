import React from 'react';
import './css/slick.css';
import './css/slick-theme.css';
import './css/style.css';

import cart from './images/cart_black.png';
import profile from './images/user_black.png';


class CustomLayout extends React.Component {

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (

        <div class="body_items">
            <header class="header_items">
                <div class="header_content">
                    <div class="header_top">
                        <nav>
                            <a href="/products/all">ВСЕ</a>
                            <a href="/products/t-shirts">ФУТБОЛКИ</a>
                            <a href="/products/hoodie">ХУДИ</a>
                            <a href="/products/polo">ПОЛО</a>
                            <a href="/products/shirts">РУБАШКИ</a>
                        </nav>
                        <div class="header_user">
                            <a href="#" class="cart"><img src={cart}/></a>
                            <a href="/profile" class="user"><img src={profile}/></a>
                        </div>
                    </div>
                </div>
            </header>

            {this.props.children}

        <footer class="footer_items">

            </footer>
        </div>
    )}
}

export default CustomLayout;