import axios from 'axios';
const regeneratorRuntime = require("regenerator-runtime");
import { getCookie } from './index'

// Configure axios to accept the CSRF Token
const headers = {
    'X-CSRFToken': getCookie('csrftoken')
}

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

// Add cover image to page
export const add_cover_image = (page_id, image) => 
    async (dispatch) => {
        await axios.patch(`api_pages/${page_id}/`, {
            photo: image
        }, {headers: headers})

        dispatch({ type: 'CHANGE_COVER_IMAGE', payload: image })
    }

// Remove cover image
export const remove_cover_image = (page_id) => 
    async (dispatch) => {
        await axios.patch(`api_pages/${page_id}/`, {
            photo: null
        }, {headers: headers})

        dispatch({ type: 'CHANGE_COVER_IMAGE', payload: null })
    }