import React, {useState} from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import './css/slick.css';
import './css/slick-theme.css';
import './css/style.css';

import cart from './images/cart_black.png';
import profile from './images/user_black.png';

import SignupForm from './components/SignupForm.js'
import SignInForm from './components/SignInForm.js'


class NavBar extends React.Component {

    render() {
        return (
            <nav>
                <NavLink
                    to="/products/all"
                    exact
                >
                    ВСЕ
                </NavLink>
                <NavLink
                    to="/products/t-shirts"
                    exact
                >
                    ФУТБОЛКИ
                </NavLink>
                <NavLink
                    to="/products/hoodie"
                    exact
                >
                    ХУДИ
                </NavLink>
                <NavLink
                    to="/products/polo"
                    exact
                >
                    ПОЛО
                </NavLink>
                <NavLink
                    to="/products/shirts"
                    exact
                >
                    РУБАШКИ
                </NavLink>
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
        this.toggleSignIn = this.toggleSignIn.bind(this);
        this.toggleSignUp = this.toggleSignUp.bind(this);
        this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
        this.profileClickHandler = this.profileClickHandler.bind(this);
    }

    toggleSignIn(value) {
        this.setState({isSignInToggled: value})
    }

    toggleSignUp(value) {
        this.setState({isSignUpToggled: value})
    }

    profileClickHandler(event) {
        if (! this.props.isAuthenticated) {
            event.preventDefault();
            this.toggleSignIn(!this.state.isSignInToggled);
        }
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

                                <NavLink to="/cart" className="cart" exact>
                                    <img src={cart}/>
                                </NavLink>

                                <NavLink to="/profile" className="user" exact onClick={this.profileClickHandler}>
                                    <img src={profile}/>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </header>

                {this.props.children}

                <footer class="footer_items">

                </footer>
                <div class="overlay" style={this.state.isSignInToggled || this.state.isSignUpToggled ? {display:  "block"} : {display:  "none"}} >
                    <div class="overlay_container" onClick={(e) => {e.preventDefault(); this.toggleSignIn(false); this.toggleSignUp(false)}}>
                        <SignupForm isSignUpToggled={this.state.isSignUpToggled} setIsSignUpToggled={this.toggleSignUp} />
                        <SignInForm isSignInToggled={this.state.isSignInToggled} setIsSignInToggled={this.toggleSignIn} setIsSignUpToggled={this.toggleSignUp} />
                    </div>
                </div>
            </div>
        )
    }
}


export default CustomLayout;