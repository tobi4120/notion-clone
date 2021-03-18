export const tablesReducer = (tables=[], action) => {
    switch(action.type) {
        case "SELECT_PAGE":
            let tables_array = []

            if (action.payload === "page not found") {
                return tables
            }
            action.payload.data.page_elements.forEach(element => {
                if (element.element_type === "Table") tables_array.push(element.table[0])
            });
            return tables_array

        case "CREATE_ELEMENT":
            // If the element is a table, append it to the table reducer
            if (action.payload.data.element_type === "Table") {
                tables_array = [...tables, action.payload.data.table[0]]
                return tables_array
            }
            return tables

        case "DELETE_ELEMENT":
            const element = action.payload

            // If the element is a table, delete it from the table reducer
            if (element.element_type === "Table") {
                const table_id = element.table[0].id

                tables_array = tables.filter(table => table.id !== table_id)   
                return tables_array
            }
            return tables

        case "ADD_COLUMN":
            let { new_data, col_index, direction, table_index } = action.payload

            // Copy tables
            tables_array = [...tables]

            // If direction is right, add 1 to col_index
            if (direction === 'right') col_index++

            // Loop through each row in table and insert the new_data
            for (let i = 0; i < tables_array[table_index].rows.length; i++) {
                tables_array[table_index].rows[i].data.splice(col_index, 0, new_data[i])
            }
            return tables_array
        
        case "DELETE_COLUMN":
            // Copy tables
            tables_array = [...tables]
            const new_table = tables_array[action.payload.table_index]

            for (let i = 0; i < new_table.rows.length; i++) {
                const new_row = new_table.rows[i].data.filter(x => x.id !== action.payload.data_ids[i])

                // Update row
                new_table.rows[i].data = new_row
            }

            // Put new_table in table_array
            tables_array[action.payload.table_index] = new_table

            return tables_array

        case "MOVE_COLUMN":
            // Copy tables
            tables_array = [...tables]

            // Get destination index
            let destinationIndex = action.payload.sourceIndex

            if (action.payload.direction === 'right') destinationIndex++
            else destinationIndex--

            // Loop through each row in the table and take out the old data and insert the new data
            let count = 0

            for (const row of tables_array[action.payload.table_index].rows) {
                // Take out old data from row
                row.data.splice(action.payload.sourceIndex, 1)

                // Insert new data in row
                row.data.splice(destinationIndex, 0, action.payload.new_data[count])

                // Increment count
                count++
            }
            return tables_array
        
        case "ADD_ROW":
            let { row_response, row_index } = action.payload

            // Copy tables 
            tables_array = [...tables]

            // Insert new row into the table
            tables_array[action.payload.table_index].rows.splice(row_index + 2, 0, row_response.data)

            return tables_array
        
        case "MOVE_ROW":
            const { source, destination } = action.payload

            // Copy tables 
            tables_array = [...tables]
            let table = tables_array[action.payload.table_index]

            // Move row from source to destination and update order propertyy
            let rows = table.rows.splice(source.index + 1, 1)
            rows[0].order = action.payload.new_order
            table.rows.splice(destination.index + 1, 0, rows[0])

            return tables_array

        case "DELETE_ROW":
            row_index = action.payload.row_index
            table_index = action.payload.table_index

            // Copy tables
            tables_array = [...tables]
            table = tables_array[table_index]

            // Delete row from tables
            table.rows.splice(row_index + 1, 1)

            return tables_array

        case "CHANGE_PROPERTY":
            // Copy tables
            tables_array = [...tables]
            
            // Update table with the new data
            tables_array[action.payload.table_index] = action.payload.table

            return tables_array

        case "REMOVE_TAG": 
            let data_id = action.payload.data_id
            table_index = action.payload.table_index
            row_index = action.payload.row_index
            col_index = action.payload.col_index
            let tag_index = action.payload.tag_index
            let tag_id = action.payload.tag.id

            // Copy tables and get table_data
            tables_array = [...tables]
            let table_data = tables_array[table_index].rows[row_index + 1].data[col_index]

            // Remove tag from table_data
            table_data.tags.splice(tag_index, 1)

            // Remove tag from table head
            const tag_head = tables_array[table_index].rows[0].data[col_index]

            // Get index of tag
            let index = tag_head.tag_heads.findIndex(x => x.id === tag_id)

            // Remove data id from tag head
            const new_ids = tag_head.tag_heads[index].table_data.filter(id => id !== data_id)

            // Put new ids and new head back in arrays
            tag_head.tag_heads[index].table_data = new_ids
            tables_array[table_index].rows[0].data[col_index] = tag_head

            return tables_array

        case "ADD_TAG_TO_CELL":
            table_index = action.payload.table_index
            row_index = action.payload.row_index
            col_index = action.payload.col_index
            let new_tag = action.payload.response.data

            // Copy tables and get table_data
            tables_array = [...tables]
            table_data = tables_array[table_index].rows[row_index + 1].data[col_index]

            // Append tag to table_data
            table_data.tags.push(new_tag)

            // Get table head
            let tableHead_cell = tables_array[table_index].rows[0].data[col_index]

            // Find tag in tag_heads
            index = tableHead_cell.tag_heads.findIndex(x => x.id === new_tag.id)

            // Append the id of the cell/data the tag will be on to table_data property in the tag head
            tableHead_cell.tag_heads[index].table_data.push(table_data.id)

            return tables_array

        case "ADD_TAG":
            table_index = action.payload.table_index
            row_index = action.payload.row_index
            col_index = action.payload.col_index
            new_tag = action.payload.response.data

            // Copy tables 
            tables_array = [...tables]

            // Append tag to table head cell
                
                // Get table head
                tableHead_cell = tables_array[table_index].rows[0].data[col_index]

                // Append tag to tag_heads property
                tableHead_cell.tag_heads.push(new_tag)

            // Append tag to table cell

                // Get table cell
                const table_cell = tables_array[table_index].rows[row_index + 1].data[col_index]

                // Append tag to cell
                table_cell.tags.push(new_tag)

            return tables_array

        case "UPDATE_TAG":
            new_tag = action.payload.response.data
            table_index = action.payload.table_index
            col_index = action.payload.col_index

            // Copy tables 
            tables_array = [...tables]

            // Update tag in table head

                // Get table head
                tableHead_cell = tables_array[table_index].rows[0].data[col_index]

                // Get the correct tag index
                index = tableHead_cell.tag_heads.findIndex(x => x.id === new_tag.id)

                // Replace the old tag with the new one
                tableHead_cell.tag_heads[index] = new_tag

            // Update tag in all the cells that the tag is in
            for (const row of tables_array[table_index].rows) {
                const cell = row.data[col_index]

                // Skip the table heads row
                if (cell.header !== true) {

                    // Find tag index in cell tags
                    index = cell.tags.findIndex(x => x.id === new_tag.id)

                    // If the tag exists inside the cell, update it to the new tag
                    if (index !== -1) 
                        cell.tags[index] = new_tag
                }
            }
            return tables_array

            case "DELETE_TAG":
                tag_id = action.payload.tag_id
                table_index = action.payload.table_index
                col_index = action.payload.col_index

                // Copy tables 
                tables_array = [...tables]

                // Delete tag from table head

                    // Get table head
                    tableHead_cell = tables_array[table_index].rows[0].data[col_index]

                    // Delete tag from table head
                    const new_tagHeads = tableHead_cell.tag_heads.filter(x => x.id !== tag_id)

                    // Replace old tag heads with new one's
                    tables_array[table_index].rows[0].data[col_index].tag_heads = new_tagHeads

                // Delete tag from all the cells that the tag was in
                for (const row of tables_array[table_index].rows) {
                    const cell = row.data[col_index]
    
                    // Skip the table heads row
                    if (cell.header !== true) {
    
                        // Delete tag from cell
                        let cell_tags = row.data[col_index].tags.filter(x => x.id !== tag_id)
    
                        // Replace old tags with the new one's
                        row.data[col_index].tags = cell_tags
                    }
                }
                return tables_array

            case "RE_SIZE_COL":
                const new_width = action.payload.new_width
                table_index = action.payload.table_index
                col_index = action.payload.col_index

                // Copy tables
                tables_array = [...tables]

                // Update width for all rows in the column
                for (const row of tables_array[table_index].rows) {
                    row.data[col_index].width = new_width
                }
                //tables_array[table_index].rows[0].data[col_index].width = new_width

                return tables_array

        default: 
            return tables
    }
}