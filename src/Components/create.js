import React, { Component } from 'react'
import axios from 'axios'

import * as styles from './create.module.css'

class create extends Component {
    state = {
        message: {
            title: "",
            to: "",
            body: "",
            reply: ""
        },
        new: true
    }
    componentWillMount() {
        let data = {
            title: this.props.title,
            to: this.props.sendto,
            body: this.props.body,
            reply: this.props.reply
        }
        this.setState({ message: data, new: false })
    }
    onChangeCreate = (t, e) => {
        let message = { ...this.state.message }
        if (t === 'title') {
            message.title = e.target.value
            this.setState({ message: message })
        } else if (t === 'to') {
            message.to = e.target.value
            this.setState({ message: message })
        } else {
            message.body = e.target.value
            this.setState({ message: message })
        }
    }
    Submit = () => {
        let date = new Date()
        date = date.toLocaleTimeString('en-US')
        let user = localStorage.getItem('user')
        user = JSON.parse(user)
        axios.post('http://localhost:4000/messages', {
            title: this.state.message.title,
            body: this.state.message.body,
            sendto: this.state.message.to,
            sentat: date.toString()
        }, { headers: { x_auth: user.token } }).then(res => {
            this.props.Created()
        }).catch(e => {
            console.log(e)
        })
    }
    Save = () => {
        let user = localStorage.getItem('user')
        user = JSON.parse(user)
        axios.patch('http://localhost:4000/messages/' + this.props.id, {
            title: this.state.message.title,
            body: this.state.message.body,
            sendTo: this.state.message.to,
            reply: this.state.message.reply
        }, { headers: { x_auth: user.token } }).then(res => {
            axios.get('http://localhost:4000/messages', { headers: { x_auth: user.token } }).then(res => {
                this.props.Edited()
            }).catch((e) => {
                console.log(e)
            })
        })
    }
    render() {
        let body = <textarea className={styles.text} value={this.state.message.body} onChange={(e) => this.onChangeCreate('body', e)} />
        if (this.state.message.reply !== "") {
            body = (
                <div className={styles.reply}>
                    <textarea className={styles.b} value={this.state.message.body} onChange={(e) => this.onChangeCreate('body', e)} />
                    <div className={styles.b}>
                        <p>Reply: </p>
                        <textarea className={styles.text} value={this.state.message.reply} onChange={this.handleReply} />
                    </div>
                </div>
            )
        }
        let callback = this.Submit
        if (!this.state.new)
            callback = this.Save
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.field}>
                        <p>Title: </p>
                        <input value={this.state.message.title} onChange={(e) => this.onChangeCreate('title', e)} />
                    </div>
                    <div className={styles.field}>
                        <p>To: </p>
                        <input value={this.state.message.to} onChange={(e) => this.onChangeCreate('to', e)} />
                    </div>
                </div>
                <div className={styles.bot}>
                    {body}
                    <div className={styles.controls}>
                        <button onClick={this.props.close}>back</button>
                        <button onClick={callback}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default create