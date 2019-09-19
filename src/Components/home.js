import React, { Component } from 'react'

import Summary from './Msummary'
import Message from  './message'

import * as styles from './home.module.css'

class Home extends Component{
    render(){
        return(
            <div className={styles.page}>
                <div className={styles.top}>
                    <p className={styles.name}>Hello {this.props.name}</p>
                    <button className={styles.add} />
                </div>
                <div className={styles.bot}>
                    <Message title="sjdbckjs" sentby="akbsnjank" body="ajbsckjsnaclsjnjakncjsdjdncjkdnc \n
                    sdoknclkdcsmdcijsndsajsjnkcanckasmclk \n
                    ascnaksmclsakmclac;lsmdcsdnvkjsdnksbvabksjnkasncksjdbvajsvjnsjzkvnkjsndvjadbvjkmksdl;vmsdlkvnslkjvnkudajnlkvndjknv" />
                </div>
            </div>
        )
    }
}

export default Home