import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import * as actions from '../store/actions/auth.js';
import {getEmail} from '../Api';

class RegisterForm extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.email,
            this.state.password1,
            this.state.password2);
        if(this.state.emailStatus && this.state.password1Status && this.state.password2Status) {
        console.log(this.state.email,
            this.state.password1,
            this.state.password2);
        this.props.onRegister(
            this.state.email,
            this.state.password1,
            this.state.password2
        );
        }
        this.props.setIsSignUpToggled(false);
    }

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password1: null,
            password2: null,
            emailStatus: null,
            password1Status: null,
            password2Status: null,
            emailErrorText: "",
            password1ErrorText: "",
            password2ErrorText: "",
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePassword1Change = this.handlePassword1Change.bind(this);
        this.handlePassword2Change = this.handlePassword2Change.bind(this);

        this.handleEmailBlur = this.handleEmailBlur.bind(this);
        this.handlePassword1Blur = this.handlePassword1Blur.bind(this);
        this.handlePassword2Blur = this.handlePassword2Blur.bind(this);
    }

    handleEmailChange = (e) => {
        this.setState({email: e.target.value})
    }

    handlePassword1Change = (e) => {
        this.setState({password1: e.target.value})
    }

    handlePassword2Change = (e) => {
        this.setState({password2: e.target.value})

    }


    async handleEmailBlur(e) {
        let re = /.+@.+\..+/i;
        if(!re.test(e.target.value)) {
            this.setState({emailStatus: false, emailErrorText: "Введите верный Email."})
        }
        else {
            let response = await getEmail(e.target.value);
            let isEmailUnique = response.isEmailUnique;
            console.log(isEmailUnique);
            if(!isEmailUnique){
                this.setState({emailStatus: false, emailErrorText: "Этот Email занят."})
            }
            else {
                this.setState({emailStatus: true, emailErrorText: ""})
            }
        }
    }

    handlePassword1Blur = (e) => {
        let password = e.target.value;
        if (password.length == 0) {
            this.setState({password1Status: false, password1ErrorText: "Введите пароль."})
        }
        else if (password.length < 6) {
            this.setState({password1Status: false, password1ErrorText: "Пароль должен быть длиннее 6 символов."})
        }
        else if (password.length > 32) {
            this.setState({password1Status: false, password1ErrorText: "Пароль не может быть длиннее 32 символов."})
        }
        else if (!(/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password))) {
            this.setState({password1Status: false, password1ErrorText: "пароль должен содержать латинские буквы верхнего и нижнего регистра и цифры."})
        }
        else {
            this.setState({password1Status: true, password1ErrorText: ""})
            if (this.state.password2) {
                if (password == this.state.password2) {
                    this.setState({password2Status: true, password2ErrorText: ""})
                }
                else {
                    this.setState({password2Status: false, password2ErrorText: "Пароли не совпадают."})
                }
            }
        }
    }

    handlePassword2Blur = (e) => {
        if (this.state.password1) {
            let password = e.target.value;
            if (password.length == 0) {
                this.setState({password2Status: false, password2ErrorText: "Введите пароль повторно."})
            }
            else if (password !== this.state.password1) {
                this.setState({password2Status: false, password2ErrorText: "Пароли не совпадают."})
            }
            else {
                this.setState({password2Status: true, password2ErrorText: ""})
            }
        }
    }

    render() {
        return (
                    <form class="signin_form overlay_form"
                    style={this.props.isSignUpToggled ? {display:  "flex"} : {display:  "none"}}
                    onClick={(e) => e.stopPropagation()}
                    onSubmit={this.handleSubmit}
                    >
                            <h2>Регистрация</h2>
                            <label>
                                <input type="email" name="email" placeholder="Email" class={this.state.emailStatus === false ? "overlay_input overlay_input_err" : "overlay_input"} required
                                onChange={this.handleEmailChange}
                                onBlur={this.handleEmailBlur}
                                  />
                                <div class={this.state.emailStatus ||  this.state.emailStatus === null ? "message show_message" : "message show_err"}>
                                    {this.state.emailErrorText}
                                </div>
                            </label>

                            <label>
                                <input type="password" name="password" placeholder="Пароль" class={this.state.password1Status === false ? "overlay_input overlay_input_err" : "overlay_input"} required
                                onChange={this.handlePassword1Change}
                                onBlur={this.handlePassword1Blur}
                                  />
                                <div class={this.state.password1Status ||  this.state.password1Status === null ? "message show_message" : "message show_err"}>
                                    {this.state.password1ErrorText}
                                </div>
                            </label>

                            <label>
                                <input type="password" name="confirm_password" placeholder="Подтвердите пароль" class={this.state.password2Status === false ? "overlay_input overlay_input_err" : "overlay_input"} required
                                onChange={this.handlePassword2Change}
                                onBlur={this.handlePassword2Blur}
                                />
                                <div class={this.state.password2Status ||  this.state.password2Status === null ? "message show_message" : "message show_err"}>
                                    {this.state.password2ErrorText}
                                </div>
                            </label>
                            <input type="submit" value="Зарегистрироваться" class="overlay_submit"/>
                            <div class="close_overlay" onClick={(e) => {e.preventDefault(); this.props.setIsSignUpToggled(false)}}></div>
                    </form>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onRegister: (email, password1, password2) => dispatch(actions.authSignup(email, password1, password2))
    }
}

export default connect(null, mapDispatchToProps)(RegisterForm);