import React, {useState} from 'react';
import { connect } from 'react-redux';

import './css/slick.css';
import './css/slick-theme.css';
import './css/style.css';

import cart from './images/cart_black.png';
import profile from './images/user_black.png';

import SignupForm from './components/SignupForm.js'
import SignInForm from './components/SignInForm.js'

class NavBar extends React.Component {

    shouldComponentUpdate(a,b) {
        return false
    }

    render() {
        return (
            <nav>
                <a href="/products/all">ВСЕ</a>
                <a href="/products/t-shirts">ФУТБОЛКИ</a>
                <a href="/products/hoodie">ХУДИ</a>
                <a href="/products/polo">ПОЛО</a>
                <a href="/products/shirts">РУБАШКИ</a>
            </nav>
        )
    }
}

class CustomLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSignInToggled: false,
            isSignUpToggled: false
        }
        this.signInClickHandler = this.signInClickHandler.bind(this);
        this.signUpClickHandler = this.signUpClickHandler.bind(this);
        this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    }

    signInClickHandler(value) {
        this.setState({isSignInToggled: value})
    }

    signUpClickHandler(value) {
        this.setState({isSignUpToggled: value})
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.isSignInToggled != nextState.isSignInToggled ||
         this.state.isSignUpToggled != nextState.isSignUpToggled ||
         this.props.isAuthenticated != nextProps.isAuthenticated){
            return true
         }
         return false

    }

    render() {
        return (
            <div class="body_items">
                <header class="header_items">
                    <div class="header_content">
                        <div class="header_top">
                            <NavBar />
                            <div class="header_user">
                            { this.props.isAuthenticated ?
                              <a href="/cart" class="cart"><img src={cart}/></a>
                              :
                               ""
                            }

                                <a href="/profile" class="user" onClick={(e) =>  {e.preventDefault(); this.signInClickHandler(!this.state.isSignInToggled)}}><img src={profile}/></a>
                            </div>
                        </div>
                    </div>
                </header>

                {this.props.children}

                <footer class="footer_items">

                </footer>
                <div class="overlay" style={this.state.isSignInToggled || this.state.isSignUpToggled ? {display:  "block"} : {display:  "none"}} >
                    <div class="overlay_container" onClick={(e) => {e.preventDefault(); this.signInClickHandler(false); this.signUpClickHandler(false)}}>
                        <SignupForm isSignUpToggled={this.state.isSignUpToggled} setIsSignUpToggled={this.signUpClickHandler} />
                        <SignInForm isSignInToggled={this.state.isSignInToggled} setIsSignInToggled={this.signInClickHandler} setIsSignUpToggled={this.signUpClickHandler} />
                    </div>
                </div>
            </div>
        )
    }
}


export default CustomLayout;