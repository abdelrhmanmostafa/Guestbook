import React from 'react'

import * as styles from './message.module.css'

const message = props => {
    return (
        <div>
            <div>
                <p>Title: {props.title}</p>
                <p>From : {props.sentby}</p>
            </div>
            <div>
                <div className={styles.body}>{props.body}</div>
                <div>
                    <button>back</button>
                    <button>reply</button>
                </div>
            </div>
        </div>
    )
}

export default message