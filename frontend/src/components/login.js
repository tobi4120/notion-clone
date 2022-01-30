import React, { useEffect, useState } from 'react';
import { login, logout } from '../actions/LogIn_out_register';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import NotionLogo from './notion-logo';
import { Alert } from '@material-ui/lab';

function Login(props) {
    const [ state, setState ] = useState({
        email: 'guest@example.com',
        password: 'password',
        login_submitted: false,
        incorrect_credentials: false,
    });

    // Check if user is logged in. If so then log them out.
    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.logout()
        }
    }, [])

    const handle_change = (event) => {
        setState({ 
            ...state,
            [event.target.name]: event.target.value
        });
    }

    const handle_submit = async (e) => {
        e.preventDefault();

        // Log the user in through a redux action
        const response = await props.login(state.email, state.password)

        // Check if credentials are correct
        if (response === "Incorrect Credentials") {
            setState({ ...state, incorrect_credentials: true, email: '', password: '' })
        } else {
            // Set login_submitted to true so that we redirect to home page
            setState({ ...state, login_submitted: true })
        }
    }

    if (state.login_submitted) {
        return <Redirect to="/" />
    }

    return(
        <div className="login-page">

            {/* Incorrect Credentials Alert */}
            {state.incorrect_credentials && 
                <Alert severity="error" onClose={() => setState({ ...state, incorrect_credentials: false })}>
                    Email or password is incorrect!
                </Alert>
            }

            {/* Notion logo */}
            <NotionLogo />

            {/* Log in form */}
            <div className="form">
                <form onSubmit={handle_submit}>

                    <h1>Log in</h1>

                    <label>Email</label>
                    <input type="email" onChange={handle_change} name="email" 
                    placeholder="Enter your email address..." 
                    value={state.email} required  /><br />

                    <label>Password</label>
                    <input type="password" onChange={handle_change} name="password" 
                    placeholder="Enter your password..." value={state.password} required  /><br />
                    
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
export default connect(null, {
    login,
    logout
})(Login);