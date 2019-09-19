import React, { Component } from 'react'
import axios from 'axios'

import Summary from './Msummary'
import Message from  './message';
import Spinner from './Spinner'

import * as styles from './home.module.css'

class Home extends Component{
    state ={
        user: {},
        messages:[],
        view: false,
        mounted: false
    }
    componentDidMount(){
        let user = localStorage.getItem('user')
        user = JSON.parse(user)
        axios.get('http://localhost:4000/messages',{headers: {x_auth : user.token}}).then(res =>{
            this.setState({user: user, messages: res.data, mounted: true})
        }).catch((e) =>{
            console.log(e)
        })
    }
    render(){
        let C = <Spinner />
        if(this.state.mounted)
            C = (
                <div className={styles.bot}>
                    <Summary title="skjdnkacm" sentby="skjncksd" date="sdjnvskjdn" />
                    {/*<Message title="sjdbckjs" sentby="akbsnjank" body={'kosom bokha 3la kosomen omo ebn l mtanaka l 8aby l mot5lf' + 
                'asdasda asdm kasn cj nsajdkb hwgqe o;bsja bsildqi n sajbsod qwioeho saoixcjb sudqbwdb jkaxchvakxc asdakdb as  kj'} />*/}
                </div>
            )
        return(
            <div className={styles.page}>
                <div className={styles.top}>
                    <p className={styles.name}>Hello {this.props.name}</p>
                    <button className={styles.add} />
                </div>
                {C}
            </div>
        )
    }
}

export default Home