import React from 'react'
import * as styles from './landing.module.css'

const login = (history) =>{
    history.push('/login')
}

const signup = (history) =>{
    history.push('/signup')
}

const landing = (props) =>{
    return(
        <div className={styles.page}>
            <p>Welcom To The Best ToDo App</p>
            <button onClick={() => signup(props.history)}> Sign Up </button>
            <button onClick={() => login(props.history)}> Log In </button>
        </div>
    )
}

export default landing