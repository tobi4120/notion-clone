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
export const create_template_table = (current_index, page_id, element_type, order_on_page, element_above_order, table_type) => 
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

        let Table_response = null

        if (table_type === "travel") {
            Table_response = await create_Table(response.data.id)
        } else if (table_type === "job_apps") {
            Table_response = await create_jobs_Table(response.data.id)
        }

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

    response.data.rows = await createRows(5, response.data.id)

    return response.data
}

// Create jobs table
const create_jobs_Table = async (element_id) => {
    const response = await axios.post('/api_tables/', {
        page_element: element_id,
        name: "Job Applications"
    }, {headers: headers});

    response.data.rows = await create_jobs_Rows(5, response.data.id)

    return response.data
}

// Add rows to newly created table
const createRows = async (rows, table_id) => {
    let rowCount = 1
    let rows_array = []
    const row_data = [

        // Header row
        [
            {"content": "Activity", "type": "Text"}, {"content": "Date", "type": "Date"}, {"content": "Location", "type": "Text"}, 
            {"content": "URL", "type": "URL"}, {"content": "Notes", "type": "Text"}
        ],

        // Row 2
        [
            {"content": "Departing Flight", "type": "Text"}, {"content": "2021-06-29T11:00:00Z", "type": "Date"}, {"content": "SFO, Terminal 1", "type": "Text"}, 
            {"content": null, "type": "URL"}, {"content": null, "type": "Text"}
        ],

        // Row 3
        [
            {"content": "Gates Hotel Diagonal Barcelona", "type": "Text"}, {"content": "2021-06-30T18:00:00Z", "type": "Date"}, {"content": "Avinguda Diagonal, 205, 08018 Barcelona, Spain", "type": "Text"}, 
            {"content": "https://www.booking.com/hotel/es/the-gates-diagonal-barcelona.html", "type": "URL"}, {"content": "Find key in lockbox, code 567.", "type": "Text"}
        ],

        // Row 4
        [
            {"content": "Dali Museum", "type": "Text"}, {"content": "2021-07-2T16:00:00Z", "type": "Date"}, {"content": "Plaça Gala i Salvador Dalí, 5, 17600 Figueres, Girona, Spain", "type": "Text"}, 
            {"content": "https://www.salvador-dali.org/en/museums/dali-theatre-museum-in-figueres/", "type": "URL"}, {"content": null, "type": "Text"}
        ],

        // Row 5
        [
            {"content": "Tibidabo Park", "type": "Text"}, {"content": "2021-07-5T18:00:00Z", "type": "Date"}, {"content": "Plaça del Tibidabo, 3, 4, 08035 Barcelona, Spain", "type": "Text"}, 
            {"content": "https://www.tibidabo.cat/en/home", "type": "URL"}, {"content": "Go to the top of Tibidabo Cathedral - amazing 360 views!", "type": "Text"}
        ],
    ]

    while (rowCount <= rows) {
        const response = await axios.post(`/api_table_rows/`, {
            table: table_id,
            order: rowCount
        }, {headers: headers});

        response.data.data = await createData(5, response.data.id, rowCount, row_data[rowCount - 1])
        
        rows_array.push(response.data)

        rowCount++
    }
    return rows_array
}

// Add rows to newly created table
const create_jobs_Rows = async (rows, table_id) => {
    let rowCount = 1
    let rows_array = []
    const row_data = [

        // Header row
        [
            {"content": "Company", "type": "Text"}, {"content": "Position", "type": "Multi_select"}, {"content": "Status", "type": "Multi_select"}, 
            {"content": "Job Description", "type": "URL"}, {"content": "Comments", "type": "Text"}
        ],

        // Row 2
        [
            {"content": "Notion", "type": "Text"}, {"content": null, "type": "Multi_select"}, {"content": null, "type": "Multi_select"}, 
            {"content": "https://notion.so/jobs", "type": "URL"}, {"content": "Call Ada to thank her for the referral!", "type": "Text"}
        ],

        // Row 3
        [
            {"content": "Acme, Inc.", "type": "Text"}, {"content": null, "type": "Multi_select"}, {"content": null, "type": "Multi_select"}, 
            {"content": "https://acmecorp.com/careers", "type": "URL"}, {"content": null, "type": "Text"}
        ],

        // Row 4
        [
            {"content": "LexCorp", "type": "Text"}, {"content": null, "type": "Multi_select"}, {"content": null, "type": "Multi_select"}, 
            {"content": "https://lexcorp.com/about", "type": "URL"}, {"content": "Follow up with Lois' friend who works there.", "type": "Text"}
        ],

        // Row 5
        [
            {"content": "Vought International", "type": "Text"}, {"content": null, "type": "Multi_select"}, {"content": null, "type": "Multi_select"}, 
            {"content": "https://vought.com/jobs", "type": "URL"}, {"content": "Looking for more years of experience.", "type": "Text"}
        ],
        
    ]

    while (rowCount <= rows) {
        const response = await axios.post(`/api_table_rows/`, {
            table: table_id,
            order: rowCount
        }, {headers: headers});

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
            text: rowCount === 1? row_data[dataCount - 1].content: row_data[dataCount - 1].type === "Text"? row_data[dataCount - 1].content: null, 
            number: rowCount === 1? null: row_data[dataCount - 1].type === "Number"? row_data[dataCount - 1].content: null,
            date: rowCount === 1? null: row_data[dataCount - 1].type === "Date"? row_data[dataCount - 1].content: null, 
            checkbox: rowCount === 1? null: row_data[dataCount - 1].type === "Checkbox"? row_data[dataCount - 1].content: null,
            url: rowCount === 1? null: row_data[dataCount - 1].type === "URL"? row_data[dataCount - 1].content: null,
            width: 198,
            order: dataCount,
            table_row: row_id
        })
        data_array.push(response.data)
        dataCount++
    }
    return data_array
}