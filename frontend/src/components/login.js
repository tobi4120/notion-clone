import React from 'react';
import { login, logout } from '../actions/LogIn_out_register';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import NotionLogo from './notion-logo';
import { Alert } from '@material-ui/lab';

class Login extends React.Component {
    state = {
        email: 'guest@example.com',
        password: 'password',
        login_submitted: false,
        incorrect_credentials: false,
    }

    // Check if user is logged in. If so then log them out.
    componentDidMount() {
        if (localStorage.getItem('token') !== null) {
            this.props.logout()
        }
    }

    handle_change = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handle_submit = async (e) => {
        e.preventDefault();

        // Log the user in through a redux action
        const response = await this.props.login(this.state.email, this.state.password)

        // Check if credentials are correct
        if (response === "Incorrect Credentials") {
            this.setState({ incorrect_credentials: true })
            
            // Clear input fields
            this.setState({email: '', password: ''})
        } else {
            // Set login_submitted to true so that we redirect to home page
            this.setState({login_submitted: true})
        }
    }

    render() {
        if (this.state.login_submitted === true) {
            return <Redirect to="/" />
        }

        return(
            <div className="login-page">

                {/* Incorrect Credentials Alert */}
                {this.state.incorrect_credentials === true && 
                    <Alert severity="error" onClose={() => this.setState({ incorrect_credentials: false })}>
                        Email or password is incorrect!
                    </Alert>
                }

                {/* Notion logo */}
                <NotionLogo />

                {/* Log in form */}
                <div className="form">
                    <form onSubmit={this.handle_submit}>

                        <h1>Log in</h1>

                        <label>Email</label>
                        <input type="email" onChange={this.handle_change} name="email" 
                        placeholder="Enter your email address..." 
                        value={this.state.email} required  /><br />

                        <label>Password</label>
                        <input type="password" onChange={this.handle_change} name="password" 
                        placeholder="Enter your password..." value={this.state.password} required  /><br />
                        
                        <input type="submit" value="Log in" />
                        <div className="bottom-text">
                            <p>Don't have an account?</p>
                            <Link className="link" to='/register'>Sign up</Link>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default connect(null, {
    login,
    logout
})(Login);