import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import BaseRouter from './routes';
import CustomLayout from './CustomLayout';

import { connect } from 'react-redux';

import * as actions from './store/actions/auth';


class App extends Component {

    componentDidMount() {
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
    isAuthenticated: state.token,
    loading: state.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
