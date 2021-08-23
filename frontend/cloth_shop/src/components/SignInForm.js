import React from 'react';

import { connect } from 'react-redux';

import * as actions from '../store/actions/auth.js'

class SignInForm extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        if(!(this.state.isEmailError || this.state.isPasswordError)) {
            this.props.onLogin(
                this.state.email,
                this.state.password,
                this.state.rememberMe,
            );
        }
        this.props.setIsSignInToggled(false);
    }

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            rememberMe: false,
            emailStatus: null,
            passwordStatus: null,
            rememberMeStatus: null,
            emailErrorText: "",
            passwordErrorText: "",
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleRememberMeChange = this.handleRememberMeChange.bind(this);
    }

    handleEmailChange = (e) => {
        this.setState({email: e.target.value})
    }

    handlePasswordChange = (e) => {
        this.setState({password: e.target.value})
    }

    handleRememberMeChange = (e) => {
        this.setState({rememberMe: e.target.value})
    }

    render() {
        return (
            <form class="login_form overlay_form"
            style={this.props.isSignInToggled ? {display:  "flex"} : {display:  "none"}}
            onClick={(e) => e.stopPropagation()}
            onSubmit={this.handleSubmit}
            >
				<h2>Войти в аккаунт</h2>

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
                    <input type="password" name="password" placeholder="Пароль" class={this.state.passwordStatus === false ? "overlay_input overlay_input_err" : "overlay_input"} required
                    onChange={this.handlePasswordChange}
                    onBlur={this.handlePasswordBlur}
                      />
                    <div class={this.state.passwordStatus ||  this.state.passwordStatus === null ? "message show_message" : "message show_err"}>
                        {this.state.passwordErrorText}
                    </div>
                </label>

				<label class="rememberme">
				    <input type="checkbox" name="remember_me" class="rememberme_checkbox"
				    onChange={this.handleRememberMeChange}
				    />
				    <span>Запомнить</span>
				</label>

				<input type="submit" value="Войти" class="overlay_submit"/>
				<div class="login_link">
					<a class="signin_link" onClick={(e) => {e.preventDefault(); this.props.setIsSignUpToggled(true); this.props.setIsSignInToggled(false)}}>Регистрация</a>
					<a class="remember_link">Забыли пароль?</a>
				</div>
				<div class="close_overlay" onClick={(e) => {e.preventDefault(); this.props.setIsSignInToggled(false)}}></div>
			</form>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogin: (email, password, rememberMe) => dispatch(actions.authLogin(email, password, rememberMe))
    }
}

export default connect(null, mapDispatchToProps)(SignInForm);