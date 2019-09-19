import React, { Component } from 'react';
import { Route } from 'react-router-dom'

import Landing from './Components/landing'
import Login from './Components/login'
import Signup from './Components/signup'
import Home from './Components/home'
import Private from './Components/private'

import * as styles from './App.module.css';

class App extends Component {
  state = {
    token:"",
    authenticated: true
  }
  render(){
    return(
      <div className={styles.app}>
        <Route path="/" exact component={Landing} />
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={Signup} />
        <Private path='/home' exact component={Home} authenticated={this.state.authenticated} />
      </div>
    )
  }
}

export default App;
