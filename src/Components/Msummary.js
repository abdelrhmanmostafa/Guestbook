import React from 'react'

import * as styles from './Msummary.module.css'

const summary = props => {
    return (
        <div className={styles.sum} onClick={props.open}>
            <div className={styles.data}>
                <p className={styles.title}>{props.title}</p>
                <p className={styles.sent}>{props.sentby}</p>
                <p className={styles.date}>{props.date}</p>
            </div>
            <div className={styles.controls}>
                <button className={styles.edite} onClick={props.edite}>edite</button>
                <button className={styles.del} onClick={props.delete}>delete</button>
            </div>
        </div>
    )
}

export default summary