import React, { Component } from 'react'

import * as styles from './signup.module.css'
import Input from './input'
import Spinner from './Spinner'

class signup extends Component {
    state = {
        Form: {
            name: {
                elementConfig: {
                    type: 'text',
                    placeholder: 'Full Name'
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            email: {
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementConfig: {
                    type: 'text',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 8
                },
                valid: false,
                touched: false
            }
        },
        formIsValid: false,
        loading: false
    }
    handleSubmit = e =>{
        e.preventDefault();
        this.setState( { loading: true } );
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
    }
    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }
        return isValid;
    }
    inputChangedHandler = (event, inputIdentifier) => {
        const updatedForm = {
            ...this.state.Form
        }
        const updatedFormElement = {
            ...updatedForm[inputIdentifier]
        }
        updatedFormElement.value = event.target.value
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedForm[inputIdentifier] = updatedFormElement;
        
        let formIsValid = true;
        for (let inputIdentifier in updatedForm) {
            formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({Form: updatedForm, formIsValid: formIsValid});
    }
    render() {
        let buttonstyle = [styles.button]
        if(!this.state.formIsValid)
            buttonstyle.push(styles.disabled)
        const formElementsArray = []
        for (let key in this.state.Form) {
            formElementsArray.push({
                id: key,
                config: this.state.Form[key]
            })
        }
        let form = (
            <div className={styles.sub}>
                <h1 className={styles.p}>Creat your account.</h1>
                <form onSubmit={this.handleSubmit} className={styles.form} >
                    {formElementsArray.map(formElement => (
                        <Input
                            key={formElement.id}
                            type={formElement.config.elementConfig.type}
                            placeholder={formElement.config.elementConfig.placeholder}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid}
                            touched={formElement.config.touched}
                            onChange={(event) => this.inputChangedHandler(event, formElement.id)} />
                    ))}
                    <button className={buttonstyle.join(' ')} disabled={!this.state.formIsValid}>Creat</button>
                    <div className={styles.links}>
                        <p>already have an account</p>
                        <a href="/login">login</a>
                    </div>
                </form>
            </div>
        );
        if (this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className={styles.page}>
                {form}
            </div>
        )
    }
}

export default signup