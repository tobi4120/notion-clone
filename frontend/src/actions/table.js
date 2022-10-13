import axios from 'axios';
const regeneratorRuntime = require("regenerator-runtime");
import { getCookie } from './index'

// Configure axios to accept the CSRF Token
const headers = {
    'X-CSRFToken': getCookie('csrftoken')
}

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

// Create a table
export const create_Table = async (element_id) => {
    const response = await axios.post('/api_tables/', {
        page_element: element_id
    }, {headers: headers});

    response.data.rows = await createRows(3, response.data.id)

    return response.data
}

// Add rows to newly created table
const createRows = async (rows, table_id) => {
    let rowCount = 1
    let rows_array = []

    while (rowCount <= rows) {
        const response = await axios.post(`/api_table_rows/`, {
            table: table_id,
            order: rowCount
        }, {headers: headers});

        response.data.data = await createData(3, response.data.id, rowCount)
        
        rows_array.push(response.data)

        rowCount++
    }
    return rows_array
}

// Add data to newly created rows
const createData = async (cols, row_id, rowCount) => {
    let dataCount = 1
    let header = true
    let data_array = []

    while (dataCount <= cols) {
        if (rowCount > 1) header = false
        const response = await axios.post(`/api_table_data/`, {
            header: header,
            property_type: 'Text',
            width: 309,
            order: dataCount,
            table_row: row_id
        })
        data_array.push(response.data)
        dataCount++
    }
    return data_array
}

// Edit table name
export const edit_TableName = (name, table_id) =>
    async () => {
        await axios.patch(`api_tables/${table_id}/`, {
            name: name
        }, {headers: headers})
    }

// Edit table cell
export const edit_cell = (propertyType, cell_value, data_id) =>
    async () => {
        const propType_lower = propertyType.toLowerCase();

        /* React does not allow number inputs to be null so if blank the value = an empty string. 
        However, we cannot do a patch request of an empty string on an integer field so we must change 
        it back to null */
        if (propType_lower === 'number' && cell_value === "")
            cell_value = null

        const body = {}
        body[propType_lower] = cell_value

        await axios.patch(`api_table_data/${data_id}/`, body, {headers: headers})
    }

// Insert table column
export const insert_column = (order, table_rows, col_index, direction, table_index) =>
    async (dispatch) => {
        let header = true
        const new_data = []

        for (let i = 0; i < table_rows.length; i++) {
            if (i > 0) header = false

            const response = await axios.post(`api_table_data/`, {
                header: header,
                property_type: 'Text',
                width: 309,
                order: order,
                table_row: table_rows[i]
            })

            // Append to new_data
            new_data.push(response.data)
        }

        dispatch({ type: 'ADD_COLUMN', payload: { new_data, col_index, direction, table_index }});
    }

// Delete table column
export const delete_column = (data_ids, table_index) => 
    async (dispatch) => {
        for (const id of data_ids) {
            await axios.delete(`api_table_data/${id}`, null, {headers: headers})
        }
        dispatch({ type: 'DELETE_COLUMN', payload: { data_ids, table_index }});
    }

// Move table column
export const move_column = (order, table, sourceIndex, direction, table_index) => 
    async (dispatch) => {
        const new_data = []

        for (const row of table.rows) {
            const response = await axios.patch(`api_table_data/${row.data[sourceIndex].id}/`, {
                order: order
            })

            // Append to new_data
            new_data.push(response.data)
        }

        dispatch({ type: 'MOVE_COLUMN', payload: { new_data, sourceIndex, direction, table_index } })
    }

// Add table row 
export const add_row = (order, table_id, col_numbers, table_index, row_index, table, widths) => 
    async (dispatch) => {

        // Add row - post request
        const row_response = await axios.post(`api_table_rows/`, {
            order: order,
            table: table_id
        }, { headers: headers })

        // Add table data to the newly created row - multiple post requests
        const new_data = []

        for (let i = 0; i < col_numbers; i++) { 
            const data_response = await axios.post(`api_table_data/`, {
                header: false,
                property_type: table.rows[row_index].data[i].property_type,
                width: widths[i],
                order: i + 1,
                table_row: row_response.data.id
            }, { headers: headers })

            // Append response to data array
            new_data.push(data_response.data)
        }

        // Add the new data to the new row
        row_response.data.data = new_data
        
        dispatch({ type: 'ADD_ROW', payload: { table_index, row_response, row_index } })
    }

// Move row - update state
export const move_row = (new_order, source, destination, table_index) => {
    return ({ type: 'MOVE_ROW', payload: { new_order, source, destination, table_index } })
}

// Move row - patch request
export const move_row_patchReq = (row_id, new_order) =>
    async () => {
        await axios.patch(`api_table_rows/${row_id}/`, {
            order: new_order
        }, {headers: headers})
    }

// Delete row
export const delete_row = (row_id, table_index, row_index, table) =>
    async (dispatch) => {
        
        // If the table only has one row, don't allow the user to delete the row
        if (table.rows.length === 2) /* Length = 2 bc the header counts as one row */ {
            alert("A table must have at least one row.")
            return
        }

        await axios.delete(`api_table_rows/${row_id}/`, null, {headers: headers})

        dispatch({ type: 'DELETE_ROW', payload: { table_index, row_index } })
    }
    
// Change column property type
export const change_property = (property_type, col_index, table, table_index) =>
    async (dispatch) => {

        // Loop through all the rows in table and change the property of the data in the column the user selected
        for (const row of table.rows) {

            const response = await axios.patch(`api_table_data/${row.data[col_index].id}/`, {
                property_type,
            }, {headers: headers})
            
            // Update the data for the row
            row.data[col_index] = response.data
        }
        dispatch({ type: 'CHANGE_PROPERTY', payload: { table, table_index } })
    }

// Multi-select______________________________

// Remove tag from cell
export const remove_tag = (data_id, tag, table_index, row_index, col_index, tag_index, table) =>
    async(dispatch) => {

        // Get tag from header
        const head = table.rows[0].data[col_index]

        // Find the tag index 
        const index = head.tag_heads.findIndex(x => x.id === tag.id)

        // Delete data id from tag.table_data
        const head_tag = head.tag_heads[index]
        const new_data = head_tag.table_data.filter(id => id !== data_id)

        await axios.patch(`api_tags/${tag.id}/`, {
            table_data: new_data
        }, {headers: headers})

        dispatch({ type: 'REMOVE_TAG', payload: { data_id, table_index, row_index, col_index, tag_index, tag } })
    }

// Add tag to cell 
export const add_tag_to_cell = (tag, data_id, table_index, row_index, col_index, e, table) => 
    async(dispatch) => {

        // If the user clicked on something other than a tag option or tag, return
        if (e.className !== "tag-option" && !e.className.includes("span-tag")) return

        // Get tag from header
        const head = table.rows[0].data[col_index]

        // Find the tag index 
        const index = head.tag_heads.findIndex(x => x.id === tag.id)

        // If data id is already in the table_data then return
        const head_tag = head.tag_heads[index]
        if (head_tag.table_data.includes(data_id)) return

        // If not, add the ID to the new_data
        const new_data = [...head_tag.table_data, data_id]

        const response = await axios.patch(`api_tags/${tag.id}/`, {
            table_data: new_data
        }, {headers: headers})

        dispatch({ type: 'ADD_TAG_TO_CELL', payload: { response, table_index, row_index, col_index }  })
    }

// Add tag (applies to all cells in column)
export const add_tag = (tag_name, table_head, cell_id, table_index, row_index, col_index, table, color) =>
    async(dispatch) => {

        // If tag already exists select it. Do not create another one
        const tag_heads = table_head.tag_heads.filter(x => x.name === tag_name)

        if (tag_heads.length > 0) {
            const e = {className: "tag-option"}
            dispatch(add_tag_to_cell(tag_heads[0], cell_id, table_index, row_index, col_index, e, table))
            return
        }

        // If tag name is blank, return
        if (!tag_name || tag_name === "") return 

        // Randomly assign a color to the tag
        const colors = {1: "default", 2: "grey", 3: "brown", 4: "orange", 5: "yellow", 6: "green", 7: "blue", 
        8: "purple", 9: "pink", 10: "red"}

        const num = Math.floor(Math.random() * Math.floor(10) + 1);

        const response = await axios.post('api_tags/', {
            name: tag_name,
            color: color || colors[num],
            table_head: table_head.id,
            table_data: [cell_id]
        }, {headers: headers})

        dispatch({ type: 'ADD_TAG', payload: { response, table_index, row_index, col_index } })

        return response
    }

// Edit tag name
export const edit_tag_name = (tag_name, tag_id, table_index, col_index) => 
    async(dispatch) => {

        // If tag_name is blank, then return
        if (tag_name === "") return

        const response = await axios.patch(`api_tags/${tag_id}/`, {
            name: tag_name
        }, {headers: headers}) 

        dispatch({ type: 'UPDATE_TAG', payload: { response, table_index, col_index} })
    }

// Delete tag 
export const delete_tag = (tag_id, table_index, col_index) => 
    async(dispatch) => {

        await axios.delete(`api_tags/${tag_id}`, null, {headers: headers})

        dispatch({ type: 'DELETE_TAG', payload: { tag_id, table_index, col_index } })
    }

// Change tag color
export const change_tag_color = (tag_id, color, table_index, col_index) => 
    async(dispatch) => {
        
        const response = await axios.patch(`api_tags/${tag_id}/`, {
            color
        }, {headers: headers})

        dispatch({ type: 'UPDATE_TAG', payload: { response, tag_id, table_index, col_index } })
    }

// Re-size table column
export const re_sizeCol =(new_width, table_index, col_index) => {

    return({ type: 'RE_SIZE_COL', payload: { new_width, table_index, col_index } })
}

// Re-size table column (patch request) 
export const re_sizeCol_patch = (new_width, table, col_index) => 
    async() => {
        // Loop through all the rows and update the column with the new_width
        for (const row of table.rows) { 
            let data_id = row.data[col_index].id

            // Patch request
            await axios.patch(`api_table_data/${data_id}/`, {
                width: new_width
            }, {headers: headers})
        }
    }