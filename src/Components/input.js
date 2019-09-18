import React from 'react'

import * as styles from './input.module.css'

const Input = props =>{
    console.log(props.touched)
    let classes = [styles.ele]
    if(props.invalid && props.touched)
        classes.push(styles.invalid)
    return(
        <div className={styles.input}>
            <label className={styles.label}>{props.label}</label>
            <input className={classes.join(' ')}
            type={props.type}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange} />
        </div>
    )
}

export default Input