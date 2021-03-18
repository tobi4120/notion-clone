import axios from 'axios';
const regeneratorRuntime = require("regenerator-runtime");
import { getCookie } from './index'

// Configure axios to accept the CSRF Token
const headers = {
    'X-CSRFToken': getCookie('csrftoken')
}

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

// Create a To-do
export const create_ToDo = async (element_id) => {
    const response = await axios.post('/api_to_dos/', {
        completed: false,
        page_element: element_id
    }, {headers: headers});

    return response.data
}

// Change tick box
export const change_tickBox = async (status, id) => {
    await axios.patch(`api_to_dos/${id}/`, {
        completed: status
    }, {headers: headers});
}

// Change description
export const change_description = async (description, id) => {
    await axios.patch(`api_to_dos/${id}/`, {
        description: description
    }, {headers: headers});
}