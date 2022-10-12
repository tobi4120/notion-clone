import React, { useEffect, useState } from 'react';
import { login, logout } from '../actions/LogIn_out_register';
import { useNavigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import NotionLogo from './notion-logo';
import { Alert } from '@material-ui/lab';

function Login(props) {
    const [ state, setState ] = useState({
        email: 'guest@example.com',
        password: 'password',
        incorrect_credentials: false,
    });
    const navigate = useNavigate();

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
            // Navigate to home page
            navigate("/");
        }
    }

    return (
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
                <form onSubmit={handle_submit} onChange={handle_change} >
                    <h1>Log in</h1>

                    <label>Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Enter your email address..." 
                        value={state.email} 
                        required/>
                    <br />

                    <label>Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Enter your password..." 
                        value={state.password} 
                        required/>
                    <br />
                    
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