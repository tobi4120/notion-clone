import axios from 'axios';
const regeneratorRuntime = require("regenerator-runtime");
import { getCookie } from './index'

// Configure axios to accept the CSRF Token
const headers = {
    'X-CSRFToken': getCookie('csrftoken')
}

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

// Get user data from token
export const get_user_data = () => 
    async (dispatch) => {
        const response = await axios.get("/userAPI", {headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }})

        dispatch({ type: 'GET_USER_DATA', payload: response });
    };

// Register
export const register = (first_name, last_name, email, password) => 
    async () => {
        let error = "";
        const response = await axios.post('/registerAPI', {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
        }, {headers: headers})
        .catch((err) => {
            error = err.response.data.email[0]
        });

        if (error) {
            return error
        }
        
        localStorage.setItem('token', response.data.token);
        return response.data
    };

// Login
export const login = (email, password) => 
    async () => {
        let error = "";
        const response = await axios.post('/loginAPI', {
            email: email,
            password: password,
        }, {headers: headers})
        .catch((err) => {
            error = err.response.data.non_field_errors[0]
        });

        if (error) {
            return error
        }

        localStorage.setItem('token', response.data.token);
    };

// Logout 
export const logout = () => 
    async (dispatch) => {

        // Delete token from server
        const new_headers = {
            'X-CSRFToken': getCookie('csrftoken'),
            'Authorization': `Token ${localStorage.getItem('token')}`
          };

        await axios.post('/logoutAPI', {
        }, {headers: new_headers});

        // Remove token from local storage
        localStorage.removeItem('token');

        dispatch({ type: 'LOGOUT', payload: "" });
    };