import React, { Component } from 'react'

import * as styles from './login.module.css'

class login extends Component {
    state= {
        email:"",
        password:""
    }
    onChangeLogin = (t, e) =>{
        if(t === 'email')
          this.setState({email: e.target.value})
        else
          this.setState({password: e.target.value})
      }
    render(){
        return(
            <div className={styles.page}>
                <div className={styles.sub}>
                    <p> Email </p>
                    <input placeholder="Enter Your Email" type='text' value={this.state.email}
                    onChange={(e) => this.onChangeLogin('email', e)}/>
                </div>
                <div className={styles.sub}>
                    <p> Password</p>
                    <input placeholder="Enter Your Password" type='text' value={this.state.password}
                    onChange={(e) => this.onChangeLogin('password', e)}/>
                </div>
                <div className={styles.links}>
                    <p>New to the app sign up </p>
                    <a href="/signup">here</a>
                </div>
                <button 
                onClick={() => this.props.Login({email: this.props.email, pass: this.props.password})}>
                    Log In
                </button>
            </div>
        )
    }
}

export default login