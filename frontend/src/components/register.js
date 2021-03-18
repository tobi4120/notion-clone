import React from 'react';
import { register } from '../actions/LogIn_out_register';
import { add_page } from '../actions/page_menu';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import NotionLogo from './notion-logo';
import { Alert } from '@material-ui/lab';

class Register extends React.Component {
    state = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        register_submitted: false,
        alert: "",
    }

    handle_change = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (this.state.password !== this.state.confirm_password) {
            this.setState({ alert: "Passwords do not match!" })

            // Clear input fields
            this.setState({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                confirm_password: '',
            })
            return
        }

        // Register user through Redux action
        const response = await this.props.register(this.state.first_name, this.state.last_name, 
        this.state.email, this.state.password)

        // Check if email already exists
        if (response === "user with this email already exists.") {
            this.setState({ alert: "A user with this email already exists" })
            
            // Clear input fields
            this.setState({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                confirm_password: '',
            })
        } else {
            // Create a new page for the user
            await this.props.add_page(null, response.user.id)

            // Set register_submitted to true so that we redirect to home page
            this.setState({register_submitted: true})
        }
    }

    render() {
        if (this.state.register_submitted === true) {
            return <Redirect to="/" />
        }
        return(
            <div>

                {/* Incorrect Credentials Alert */}
                {this.state.alert !== "" && 
                    <Alert severity="error" onClose={() => this.setState({ alert: "" })}>
                        {this.state.alert}
                    </Alert>
                }

                {/* Notion logo */}
                <NotionLogo />

                {/* Sign up form */}
                <div className="form" style={{ height: "90vh"}}>
                    <form onSubmit={this.handleSubmit}>

                        <h1>Sign up</h1>

                        <label>First name</label>
                        <input type="text" onChange={this.handle_change} name="first_name" 
                        placeholder="Enter your first name..." value={this.state.first_name} required /><br />

                        <label>Last name</label>
                        <input type="text" onChange={this.handle_change} name="last_name" 
                        placeholder="Enter your last name..." value={this.state.last_name} required /><br />
                        
                        <label>Email</label>
                        <input type="email" onChange={this.handle_change} name="email" 
                        placeholder="Enter your email..." value={this.state.email} required  /><br />

                        <label>Password</label>
                        <input type="password" onChange={this.handle_change} name="password" 
                        placeholder="Create a password..." value={this.state.password} required /><br />

                        <label>Confirm password</label>
                        <input type="password" onChange={this.handle_change} name="confirm_password" 
                        placeholder="Confirm your password..." value={this.state.confirm_password} required /><br />
                        
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
}
export default connect(null, {
    register,
    add_page,
})(Register);