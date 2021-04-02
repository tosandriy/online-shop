import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import BaseRouter from './routes';
import CustomLayout from './CustomLayout';

class App extends Component {
    render() {
      return (
        <div>
            <Router>
              <CustomLayout {...this.props}>
                  <BaseRouter />
              </CustomLayout>
            </Router>
        </div>
      );
    }
}

export default App;
