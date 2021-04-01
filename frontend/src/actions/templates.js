import axios from 'axios';
const regeneratorRuntime = require("regenerator-runtime");
import { getCookie } from './index'

// Configure axios to accept the CSRF Token
const headers = {
    'X-CSRFToken': getCookie('csrftoken')
}

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

// Create and configure table for travel planner template
export const create_travel_table = (current_index, page_id, element_type, order_on_page, element_above_order,
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

        const Table_response = await create_Table(response.data.id)

        // Add the table to the newly created element
        response.data.table[0] = Table_response

        // Add current_index to response so we pass it to the reducer
        response.current_index = current_index

        dispatch({ type: 'CREATE_ELEMENT', payload: response });
        return response
    }

// Create a table
const create_Table = async (element_id) => {
    const response = await axios.post('/api_tables/', {
        page_element: element_id,
        name: "Barcelona Schedule"
    }, {headers: headers});

    response.data.rows = await createRows(2, response.data.id)

    return response.data
}

// Add rows to newly created table
const createRows = async (rows, table_id) => {
    let rowCount = 1
    let rows_array = []
    let row_data = [

        // Header row
        [
            {"content": "Activity", "type": "Text"}, {"content": "Date", "type": "Date"}, {"content": "Location", "type": "Text"}, 
            {"content": "URL", "type": "URL"}, {"content": "Notes", "type": "Text"}
        ]

        // Row 2
        [
            {"content": "Activity", "type": "Text"}, {"content": "Date", "type": "Date"}, {"content": "Location", "type": "Text"}, 
            {"content": "URL", "type": "URL"}, {"content": "Notes", "type": "Text"}
        ]
    ]

    while (rowCount <= rows) {
        const response = await axios.post(`/api_table_rows/`, {
            table: table_id,
            order: rowCount
        }, {headers: headers});

        console.log(row_data)

        response.data.data = await createData(5, response.data.id, rowCount, row_data[rowCount - 1])
        
        rows_array.push(response.data)

        rowCount++
    }
    return rows_array
}

// Add data to newly created rows
const createData = async (cols, row_id, rowCount, row_data) => {
    let dataCount = 1
    let header = true
    let data_array = []

    while (dataCount <= cols) {
        if (rowCount > 1) header = false
        const response = await axios.post(`/api_table_data/`, {
            header: header,
            property_type: row_data[dataCount - 1].type,
            text: row_data[dataCount - 1].content, 
            width: 198,
            order: dataCount,
            table_row: row_id
        })
        data_array.push(response.data)
        dataCount++
    }
    return data_array
}