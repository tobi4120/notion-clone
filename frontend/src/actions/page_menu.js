import axios from 'axios';
const regeneratorRuntime = require("regenerator-runtime");
import { getCookie } from './index'

// Configure axios to accept the CSRF Token
const headers = {
    'X-CSRFToken': getCookie('csrftoken')
}

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

// Add a page
export const add_page = (parent, creator) => 
    async (dispatch) => {

        // Check if parent
        if (!parent) {
            parent = null
        }

        const response = await axios.post(`/api_add_pages/`, {
            name: "Untitled",
            parent: parent,
            creator: creator,
            children: [],
            page_elements: [],
            groups: 1,
        }, {headers: headers});

        // Add blank children array to new page
        response.data.children = []

        dispatch({ type: 'ADD_PAGE', payload: response.data });

        return response.data
    };

// Edit page name
export const edit_page_name = (page_id, page_name) => 
    async (dispatch) => {

        const response = await axios.patch(`/api_add_pages/${page_id}/`, {
            name: page_name,
        }, {headers: headers});

        dispatch({ type: 'EDIT_PAGE_NAME', payload: response.data });
    };

// On change handler for editing a page name (updates select page reducer)
export const changeNameOnBody = (page_name, page_id) => {
    if (!page_name) {
        page_name = "Untitled"
    }
    const details = {page_name: page_name, page_id: page_id}

    return { type: 'EDIT_NAME_ON_CHANGE', payload: details };
};

// Delete a page
export const delete_page = (page_id) => 
    async (dispatch) => {
        await axios.delete(`/api_add_pages/${page_id}/`, undefined, {headers: headers});
        
        dispatch({ type: 'DELETE_PAGE', payload: page_id });
    };