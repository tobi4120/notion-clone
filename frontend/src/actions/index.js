import axios from 'axios';
import { element } from 'prop-types';
const regeneratorRuntime = require("regenerator-runtime");
import { create_kanban } from './kanban';
import { create_Table } from './table'
import { create_ToDo } from './to_do'

// Function to get the CSRF Token
export function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].toString().replace(/^([\s]*)|([\s]*)$/g, "");
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Configure axios to accept the CSRF Token
const headers = {
    'X-CSRFToken': getCookie('csrftoken')
}

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

// Get all pages
export const fetch_pages = (user_id) => 
    async (dispatch) => {
        const response = await axios.get("/api_pages/", { 
            params: { user_id: user_id, orphan: true } 
        })
        dispatch({ type: 'FETCH_PAGES', payload: response.data });
    };

// Select page
export const select_page = (page_id) => 
    async (dispatch) => {
        let payload = null
        try {
            const response = await axios.get(`api_pages/${page_id}`)
            payload = response
        } catch (err) {
            const response = "page not found"
            payload = response
        };
        dispatch({ type: 'SELECT_PAGE', payload: payload });
        return payload.data
    };

// Create page element
export const create_element = (current_index, page_id, element_type, order_on_page, element_above_order,
    link_pageId, optional_text) => 
    async (dispatch) => {

        // Get the order for the element on the page
        let order = 0

        if (element_above_order === null) {
            order = order_on_page + 1
        } else {
            order = (order_on_page + element_above_order)/2
        }

        const response = await axios.post('/api_page_elements/', {
            element_type: element_type,
            page: page_id,
            order_on_page: order
        }, {headers: headers});

        if (element_type === "Heading_1") {
            const heading_1_response = await create_H1(response.data.id)

            // Add the heading_1 to the newly created element
            response.data.heading_1[0] = heading_1_response

        } else if (element_type === "Heading_2") {
            const heading_2_response = await create_H2(response.data.id, optional_text)

            // Add the heading_2 to the newly created element
            response.data.heading_2[0] = heading_2_response

        } else if (element_type === "Text") {
            const text_response = await create_text(response.data.id, optional_text)

            // Add the text to the newly created element
            response.data.text[0] = text_response

        } else if (element_type === "Kanban") {
            const kanban_response = await create_kanban(response.data.id, optional_text)

            // Add the kanban to the newly created element
            response.data.kanban[0] = kanban_response

        } else if (element_type === "Page_link") {
            const pageLink_response = await create_pageLink(response.data.id, link_pageId)

            // Add the page link to the newly created element
            response.data.page_link[0] = pageLink_response

        } else if (element_type === "To_do") {
            const ToDo_response = await create_ToDo(response.data.id)

            // Add the to do to the newly created element
            response.data.to_do[0] = ToDo_response

        } else if (element_type === "Table") {
            const Table_response = await create_Table(response.data.id)

            // Add the table to the newly created element
            response.data.table[0] = Table_response
        }
        // Add current_index to response so we pass it to the reducer
        response.current_index = current_index

        dispatch({ type: 'CREATE_ELEMENT', payload: response });
        return response
    };

// Delete page element
export const delete_element = (element) => 
    async (dispatch) => {

        // Delete the element
        await axios.delete(`/api_page_elements/${element.id}`, undefined, {headers: headers});

        const source = {}
        source.droppableId = `${element.group}${element.column}`

        dispatch({ type: 'DELETE_ELEMENT', payload: element });
    };

// Change order of page element (Updates store)
export const change_order = (source, destination, new_order, element_id) => {
    axios.patch(`/api_page_elements/${element_id}/`, {
        order_on_page: new_order,
    }, {headers: headers});

    const payload = {source, destination, new_order, element_id}
    return { type: 'CHANGE_ORDER', payload: payload };
};

// Create a Heading 1
const create_H1 = async (element_id) => {
    const response = await axios.post('/api_Heading_1s/', {
        heading_text: "",
        page_element: element_id,
    }, {headers: headers});

    return response.data
} 

// Edit a Heading 1
export const edit_H1 = (heading_id, heading_text) => 
    async () => {
        await axios.patch(`/api_Heading_1s/${heading_id}/`, {
            heading_text: heading_text,
        }, {headers: headers});
    };

// Create a Heading 2
const create_H2 = async (element_id, optional_text) => {
    const response = await axios.post('/api_Heading_2s/', {
        heading_text: optional_text || "",
        page_element: element_id,
    }, {headers: headers});

    return response.data
} 

// Edit a Heading 2
export const edit_H2 = (heading_id, heading_text) => 
    async () => {
        await axios.patch(`/api_Heading_2s/${heading_id}/`, {
            heading_text: heading_text,
        }, {headers: headers});
    };

// Create a Text element
const create_text = async (element_id, optional_text) => {
    const response = await axios.post('/api_Texts/', {
        text: optional_text || "",
        page_element: element_id,
    }, {headers: headers});

    return response.data
} 

// Edit a Text element
export const edit_text = (text_id, text) => 
    async () => {
        await axios.patch(`/api_Texts/${text_id}/`, {
            text: text,
        }, {headers: headers});
    };

// Get page breadcrumb that shows the page location
export const get_breadcrumb = (selectedPage, pages) => {
    let breadcrumb = []
    get_breadcrumb_helper(selectedPage, pages, breadcrumb)
    return { type: 'GET_BREADCRUMB', payload: breadcrumb };
}

const get_breadcrumb_helper = (selectedPage, pages, breadcrumb) => {
    for (const page of pages) {
        breadcrumb.push({ id: page.id, name: page.name })
        
        if (page.id === selectedPage.id)
            return true
        
        const result = get_breadcrumb_helper(selectedPage, page.children, breadcrumb)
        if (result) return true
        breadcrumb.pop()
    }
    return false
}

// Create a page link
const create_pageLink = async (element_id, page_id) => {
    const response = await axios.post('/api_pageLinks/', {
        page: page_id,
        page_element: element_id
    }, {headers: headers});

    return response.data
}

// Change element background color
export const change_bgColor = (element_id, color) => 
    async (dispatch) => {
        await axios.patch(`/api_page_elements/${element_id}/`, {
            color: color,
        }, {headers: headers});

        dispatch({ type: 'CHANGE_BG_COLOR', payload: { element_id, color } });
    };
