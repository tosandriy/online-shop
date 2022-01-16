import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import BaseRouter from './routes';
import CustomLayout from './CustomLayout';

import { connect } from 'react-redux';

import * as auth_actions from './store/actions/auth';
import * as cart_actions from './store/actions/cart';


class App extends Component {

    constructor(props) {
        super(props);
        this.props.onTryGetCart();
        this.props.onTryAutoSignup();
    }

    render() {
      return (
        <Router>
            <Fragment>
                <CustomLayout {...this.props}>
                    <Switch>
                        <BaseRouter store={this.props.store}/>
                    </Switch>
                </CustomLayout>
            </Fragment>
        </Router>
      )
    }
}
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token,
    loading: state.auth.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
        onTryAutoSignup: () => dispatch(auth_actions.authCheckState()),
        onTryGetCart: () => dispatch(cart_actions.cartCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
