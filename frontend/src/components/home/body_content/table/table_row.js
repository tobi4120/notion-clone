import React, { useState } from "react";
import TableData from "./table_data";
import { Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import TableRow_dropdown from "./table-dropdowns/tableRow_dropdown";
import AddIcon from '@material-ui/icons/Add';

function TableRow(props) {
    // State
    const [optionOpacity, set_optionOpacity] = useState(0);
    const [open, setOpen] = useState(false);

    return (
        <Draggable draggableId={`${props.row.id}`} index={props.row_index}>
            {(provided, snapshot) => (
                <div {...provided.draggableProps} ref={provided.innerRef} className="table-row" 
                    onMouseEnter={() => set_optionOpacity(100)} onMouseLeave={() => set_optionOpacity(0)}>

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

                    <div className="element-options" style={{ opacity: open? 100: optionOpacity }}>
                        <span className="pointer add_element" onClick={() => props.addRow(props.row_index)}>
                            <AddIcon />
                        </span>
                        
                        <div {...provided.dragHandleProps} className="Dropdown">
                            <span className="element-option-icon">
                                <DragIndicatorIcon onClick={() => setOpen(!open)}/>
                            </span>
                            
                            {open && 
                            <TableRow_dropdown 
                                setOpen={setOpen} 
                                row_id={props.row.id}
                                row_index={props.row_index} 
                                table_index={props.table_index}
                                table={props.table} />}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )
}
export default TableRow