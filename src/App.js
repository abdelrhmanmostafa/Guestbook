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
    authenticated: false
  }
  HandleAuth = () =>{
    this.setState({authenticated: true})
    localStorage.setItem('auth',JSON.stringify(this.state))
  }
  componentWillMount = () => {
    const auth = localStorage.getItem('auth')
    if(auth) {
      const {authenticated,token} = JSON.parse(auth)
      this.setState({authenticated,token})
    }
  }
  render(){
    return(
      <div className={styles.app}>
        <Route path="/" exact component={Landing} />
        <Route path="/login" exact render={() => <Login auth={this.HandleAuth} />} />
        <Route path="/signup" exact render={() => <Signup auth={this.HandleAuth} />} />
        <Private path='/home' exact component={Home} authenticated={this.state.authenticated} />
      </div>
    )
  }
}

export default App;
