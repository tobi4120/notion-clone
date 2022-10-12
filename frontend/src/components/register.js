import React, { useState } from 'react';
import { register } from '../actions/LogIn_out_register';
import { add_page } from '../actions/page_menu';
import { connect } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import NotionLogo from './notion-logo';
import { Alert } from '@material-ui/lab';

function Register(props) {
    const [state, setState] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        alert: ''
    });
    const navigate = useNavigate();     

    const handle_change = (event) => {
        setState({
            ...state, 
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (state.password !== state.confirm_password) {
            setState({ 
                ...state, 
                alert: "Passwords do not match!"
            })
            return
        }

        // Register user through Redux action
        const response = await props.register(state.first_name, state.last_name, 
                                                state.email, state.password)

        // Check if email already exists
        if (response === "user with this email already exists.") {
            setState({ ...state, alert: "A user with this email already exists" })
        } else {
            // Create a new page for the user
            await props.add_page(null, response.user.id)

            // Redirect to home page
            navigate("/");
        }
    }

    return(
        <div>
            {/* Incorrect Credentials Alert */}
            {state.alert !== "" && 
                <Alert severity="error" onClose={() => setState({ ...state, alert: "" })}>
                    {state.alert}
                </Alert>
            }

            {/* Notion logo */}
            <NotionLogo />

            {/* Sign up form */}
            <div className="form" style={{ height: "90vh"}}>
                <form onSubmit={handleSubmit} onChange={handle_change} >
                    <h1>Sign up</h1>

                    <label>First name</label>
                    <input type="text" name="first_name" 
                    placeholder="Enter your first name..." value={state.first_name} required /><br />

                    <label>Last name</label>
                    <input type="text" name="last_name" 
                    placeholder="Enter your last name..." value={state.last_name} required /><br />
                    
                    <label>Email</label>
                    <input type="email" name="email" 
                    placeholder="Enter your email..." value={state.email} required  /><br />

                    <label>Password</label>
                    <input type="password" name="password" 
                    placeholder="Create a password..." value={state.password} required /><br />

                    <label>Confirm password</label>
                    <input type="password" name="confirm_password" 
                    placeholder="Confirm your password..." value={state.confirm_password} required /><br />
                    
                    <input type="submit" value="Sign up" />

                    <div className="bottom-text">
                        <p>Already have an account?</p>
                        <Link className="link" to='/login'>Log In</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default connect(null, {
    register,
    add_page,
})(Register);