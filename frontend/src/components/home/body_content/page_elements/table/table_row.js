import React from "react";
import TableData from "./table_data";
import { Draggable } from "react-beautiful-dnd";
import TableRow_dropdown from "./table-dropdowns/row_options";
import AddIcon from '@material-ui/icons/Add';

function TableRow(props) {
    return (
        <Draggable draggableId={`${props.row.id}`} index={props.row_index}>
            {(provided, snapshot) => (
                <div {...provided.draggableProps} ref={provided.innerRef} className="table-row">
                    {props.row.data.map((data, index) => {
                        return <TableData 
                                    key={data.id} 
                                    data={data} 
                                    insertColumn={props.insertColumn}
                                    index={index} 
                                    deleteColumn={props.deleteColumn} 
                                    isDragging={snapshot.isDragging}
                                    table={props.table}
                                    table_index={props.table_index}
                                    row_index={props.row_index} />
                    })}

                    {/* Row buttons */}
                    <div className="element-options-row">
                        <span className="pointer add_element" onClick={() => props.addRow(props.row_index)}>
                            <AddIcon />
                        </span>

                        <div {...provided.dragHandleProps}>
                            <TableRow_dropdown 
                                row_id={props.row.id}
                                row_index={props.row_index} 
                                table_index={props.table_index}
                                table={props.table} />
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )
}
export default TableRow