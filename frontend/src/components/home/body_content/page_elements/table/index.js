import React, { useState } from "react";
import { connect } from "react-redux";
import TableRow from "./table_row";
import TableHeader from "./table_header";
import { edit_TableName, insert_column, delete_column, move_column, add_row,
        move_row, move_row_patchReq } from "../../../../../actions/table";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function Table(props) {
    
    // In case there is an element whose type is table but there is no table
    if ((props.page_element.table).length === 0) return null

    // State
    const [table_index] = useState(props.tables.findIndex(x => x.id === props.page_element.table[0].id))
    const [table] = useState(props.tables[table_index]) 
    const [tableName, set_tableName] = useState(table.name)

    // Insert column function
    const insertColumn = (col_index, direction) => {

        // Calculate the new column's order
        const new_order = calculate_colOrder(col_index, direction)
        
        // Get the table's row ids
        const row_ids = [] 

        table.rows.forEach(row => {
            row_ids.push(row.id)
        });

        // Call redux function
        props.insert_column(new_order, row_ids, col_index, direction, table_index)
    }

    // Calculate column order (used when a new column is inserted in the table or an existing column is moved)
    const calculate_colOrder = (col_index, direction) => {
        let new_order = 0
        const header_row = table.rows[0].data

        // If column is being moved to start of table
        if (col_index === 0 && direction === 'left') {
            new_order = (header_row[0].order)/2

        // If column is being moved to the end of the table
        } else if (col_index === header_row.length - 1 && direction === 'right') {
            new_order = header_row[header_row.length - 1].order + 1

        // If column is being moved to the middle of the table
        } else {
            if (direction === 'left') new_order = (header_row[col_index].order + header_row[col_index - 1].order)/2
            else new_order = (header_row[col_index].order + header_row[col_index + 1].order)/2
        }
        return new_order
    }

    // Delete column function
    const deleteColumn = (col_index) => {
        
        // Put the data id's into an array
        const data_ids = [] 

        table.rows.forEach(row => {
            data_ids.push(row.data[col_index].id)
        });

        // Call redux function
        props.delete_column(data_ids, table_index)
    }

    // Move column function
    const moveColumn = (sourceIndex, direction) => {
        let new_order = 0

        // Get the column's new order
        if (direction === 'right') new_order = calculate_colOrder(sourceIndex + 1, direction)
        else new_order =  calculate_colOrder(sourceIndex - 1, direction)

        // Call redux function
        props.move_column(new_order, table, sourceIndex, direction, table_index)
    }

    // Insert row function 
    const addRow = (row_index) => {
        let new_order = 0

        if (row_index === table.rows.length - 2) new_order = table.rows[row_index + 1].order + 1
        else new_order = (table.rows[row_index + 1].order + table.rows[row_index + 2].order)/2

        // Get the widths of each column and put them in an array
        const widths = []

        for (const data of table.rows[0].data) {
            widths.push(data.width)
        }

        // Call redux function
        props.add_row(new_order, table.id, table.rows[0].data.length, table_index, row_index, table, widths)
    }

    // Move row function
    const onDragEnd = (result) => {
        let new_order = 0
        const { source, destination } = result

        // If no destination, then return
        if (!destination) return;

        // If the source = the destination, then return
        if (source.index === destination.index) return;

        // If we are moving a row to the start of the table (closer to index 0)
        if (source.index > destination.index) {
            new_order = (table.rows[destination.index + 1].order + table.rows[destination.index].order)/2
        } 
        // Else... we are moving a row to the end of the table (closer to table.rows.length - 1)
        else {

            // If destination index is at the end of the table
            if (destination.index === (table.rows.length) - 2) 
            new_order = table.rows[destination.index + 1].order + 1

            else new_order = (table.rows[destination.index + 2].order + table.rows[destination.index + 1].order)/2
        }
        // Get the row id of the row we are trying to move
        const row_id = table.rows[source.index + 1].id

        // Call redux functions
        props.move_row(new_order, source, destination, table_index)
        props.move_row_patchReq(row_id, new_order)
    }

    return (
        <div style={{ opacity: props.snapshot.isDragging? '0.5': '1' }} className="table-container">
            <input className="table-title user_input" placeholder="Untitled" value={tableName? tableName: ""}
                onChange={(e) => set_tableName(e.target.value)} 
                onBlur={() => props.edit_TableName(tableName, table.id)}
                onKeyDown={(e) => { if(e.key === 'Enter') e.target.blur(); }} />
            
            <div className="table-div">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {provided => (
                            <div className="table" {...provided.droppableProps} ref={provided.innerRef}>
                                <div className="table-body">
                                    <TableHeader 
                                        row={table.rows[0]} 
                                        insertColumn={insertColumn} 
                                        deleteColumn={deleteColumn} 
                                        row_index={0} moveColumn={moveColumn}
                                        col_amount={table.rows[0].data.length}
                                        table_index={table_index} 
                                        table={table} />
                                    
                                    {table.rows.slice(1).map((row, row_index) => {
                                        return (
                                            <TableRow 
                                                key={row.id} 
                                                row={row} 
                                                row_index={row_index} 
                                                addRow={addRow}
                                                table_index={table_index}
                                                table={table} />
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return { 
        tables: state.tables, 
    }
}
export default connect(mapStateToProps, { 
    edit_TableName, 
    insert_column,
    delete_column, 
    move_column,
    add_row,
    move_row,
    move_row_patchReq })(Table);