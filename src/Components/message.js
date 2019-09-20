import React, { Component } from 'react'

import * as styles from './message.module.css'

class message extends Component {
    state = {
        reply: false,
        content: ""
    }
    Reply = () => {
        this.setState({ reply: true })
    }
    handleReply = (e) => {
        this.setState({ content: e.target.value })
    }
    render() {
        let body = (
            <div className={styles.bot}>
                <div className={styles.body}>
                    {this.props.body}
                    <p>Reply: </p>
                    {this.props.reply}
                </div>
                <div className={styles.controls}>
                    <button onClick={this.props.close}>back</button>
                    <button onClick={this.Reply}>reply</button>
                </div>
            </div>
        )
        if (this.state.reply)
            body = (
                <div className={styles.bot}>
                    <div className={styles.reply}>
                        <div className={styles.b}>{this.props.body}</div>
                        <div className={styles.b}>
                            <p>Reply: </p>
                            <textarea className={styles.text} value={this.state.content} onChange={this.handleReply} />
                        </div>
                    </div>
                    <div className={styles.controls}>
                        <button onClick={() => this.props.add(this.state.content)}>done</button>
                    </div>
                </div >
            )
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <p>Title : {this.props.title}</p>
                    <p>From : {this.props.sentby}</p>
                </div>
                {body}
            </div>
        )
    }
}

export default message