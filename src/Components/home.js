import React, { Component } from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'

import Summary from './Msummary'
import Message from './message'
import Spinner from './Spinner'
import Create from './create'

import * as styles from './home.module.css'

class Home extends Component {
    state = {
        messages: [],
        message: {
            title: "",
            body: "",
            sendTo: "",
            sentAt: "",
            reply: ""
        },
        view: false,
        mounted: false,
        create: false
    }
    componentDidMount() {
        let user = localStorage.getItem('user')
        user = JSON.parse(user)
        axios.get('http://localhost:4000/messages', { headers: { x_auth: user.token } }).then(res => {
            this.setState({ messages: res.data, mounted: true })
        }).catch((e) => {
            console.log(e)
        })
    }
    Logout = () =>{
        let user = localStorage.getItem('user')
        user = JSON.parse(user)
        axios.delete('http://localhost:4000/users/logout', { headers: { x_auth: user.token } }).then(res =>{
            localStorage.setItem('auth',JSON.stringify({authenticated: false}))
            localStorage.setItem('user',JSON.stringify({}))
            this.props.history.push('/')
        })
    }
    EditeM = (id) => {
        let message
        for (let m in this.state.messages) {
            if (this.state.messages[m]._id === id)
                message = this.state.messages[m]
        }
        this.setState({ create: true, message: message })
    }
    DeleteM = (id) => {
        let user = localStorage.getItem('user')
        user = JSON.parse(user)
        axios.delete('http://localhost:4000/messages/' + id, { headers: { x_auth: user.token } }).then(res => {
            axios.get('http://localhost:4000/messages', { headers: { x_auth: user.token } }).then(res => {
                this.setState({ messages: res.data, view: false, create: false, mounted: true })
            }).catch((e) => {
                console.log(e)
            })
        })
    }
    Open = (id) => {
        let message
        for (let m in this.state.messages) {
            if (this.state.messages[m]._id === id)
                message = this.state.messages[m]
        }
        this.setState({ view: true, message: message })
    }
    Edited = () => {
        let user = localStorage.getItem('user')
        user = JSON.parse(user)
        axios.get('http://localhost:4000/messages', { headers: { x_auth: user.token } }).then(res => {
            this.setState({ messages: res.data, view: false, create: false })
        }).catch((e) => {
            console.log(e)
        })
    }
    addReply = (reply) => {
        let user = localStorage.getItem('user')
        user = JSON.parse(user)
        axios.patch('http://localhost:4000/messages/' + this.state.message._id, {
            title: this.state.message.title,
            body: this.state.message.body,
            sendTo: this.state.message.sendTo,
            reply: reply
        }, { headers: { x_auth: user.token } }).then(res => {
            this.Edited()
        })
    }
    Close = () => {
        this.setState({ view: false, create: false })
    }
    cMessage = () => {
        this.setState({ create: true })
    }
    Created = () => {
        let user = localStorage.getItem('user')
        user = JSON.parse(user)
        axios.get('http://localhost:4000/messages', { headers: { x_auth: user.token } }).then(res => {
            this.setState({ messages: res.data, create: false })
        }).catch((e) => {
            console.log(e)
        })
    }
    render() {
        console.log(this.state.messages)
        let C = <Spinner />
        if (this.state.mounted && this.state.messages.length !== 0) {
            C = (
                <div className={styles.bot}>
                    {this.state.messages.map(message => (
                        <Summary
                            key={message._id}
                            title={message.title}
                            sentby={message.sendTo}
                            date={message.sentAt}
                            edite={() => this.EditeM(message._id)}
                            delete={() => this.DeleteM(message._id)}
                            open={() => this.Open(message._id)} />
                    ))}
                </div>
            )
        }else{
            C = <p>No Messages</p>
        }
        if (this.state.view) {
            C = (
                <div className={styles.bot}>
                    <Message
                        title={this.state.message.title}
                        sentby={this.state.message.sendTo}
                        body={this.state.message.body}
                        reply={this.state.message.reply}
                        close={this.Close}
                        add={this.addReply} />
                </div>

            )
        }
        if (this.state.create)
            C = (
                <div className={styles.bot}>
                    <Create Created={this.Created}
                        Edited={this.Edited}
                        id={this.state.message._id}
                        title={this.state.message.title}
                        sendto={this.state.message.sendTo}
                        body={this.state.message.body}
                        reply={this.state.message.reply}
                        close={this.Close} />
                </div>
            )
        return (
            <div className={styles.page}>
                <div className={styles.top}>
                    <p className={styles.name}>Hello {this.props.name}</p>
                    <div className={styles.controls}>
                        <button className={styles.add} onClick={this.cMessage} />
                        <button className={styles.out} onClick={this.Logout}>Logout</button>
                    </div>
                </div>
                {C}
            </div>
        )
    }
}

export default withRouter(Home)