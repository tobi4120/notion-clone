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
        const response = await axios.get("/api_pages/")

        const pages = []

        // Only get the pages for the current user
        response.data.forEach(page => {
            if (page.creator === user_id) {
                pages.push(page)
            }
        });

        dispatch({ type: 'FETCH_PAGES', payload: pages });
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
    };

// Create page element
export const create_element = (current_index, page_id, element_type, order_on_page, element_above_order,
    element, link_pageId, optional_text) => 
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
            order_on_page: order,
            group: element.group,
            column: element.column,
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
        dispatch({ type: 'CHANGE_ORDER', payload: { source } });
    };

// Change order of page element (Updates store)
export const change_order = (source, destination, new_order, element_id) => {

    const payload = {source, destination, new_order, element_id}
    return { type: 'CHANGE_ORDER', payload: payload };
};

// Change order of page element (Patch Request)
export const change_order_patchReq = (page_elements, selected_page) => 
    async () => {
        for (const group of page_elements) {
            for (const column of group) {
                if (column.length > 0) {
                    for (const element of column) {
                        await axios.patch(`/api_page_elements/${element.id}/`, {
                            order_on_page: element.order_on_page,
                            group: element.group,
                            column: element.column,
                        }, {headers: headers});
                    }
                }
            }
        };

        // Update the number of groups property
        await axios.patch(`/api_pages/${selected_page.id}/`, {
            groups: selected_page.groups
        })
    }

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
let breadcrumb = []

export const get_breadcrumb = (selected_page, page_list) => {
    if (selected_page.parent === null) {

        breadcrumb.unshift({id: selected_page.id, name: selected_page.name})

        // Copy breadcrumb
        let breadcrumb_copy = breadcrumb

        // Clear breadcrumb
        breadcrumb = []
        return { type: 'GET_BREADCRUMB', payload: breadcrumb_copy };
    }
    breadcrumb.unshift({id: selected_page.id, name: selected_page.name})

    let index = page_list.findIndex(x => x.id === selected_page.parent)
        return get_breadcrumb(page_list[index], page_list)
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
export const change_bgColor = (element_id, color, group, column) => 
    async (dispatch) => {
        await axios.patch(`/api_page_elements/${element_id}/`, {
            color: color,
        }, {headers: headers});

        dispatch({ type: 'CHANGE_BG_COLOR', payload: { element_id, color, group, column } });
    };
