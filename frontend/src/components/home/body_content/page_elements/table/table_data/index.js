import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import TableColumn_dropdown from "../table-dropdowns/column_options";
import { edit_cell, re_sizeCol, re_sizeCol_patch } from "../../../../../../actions/table";
import Text from '@material-ui/icons/Subject';
import Number from "../table-dropdowns/column_options/number-icon";
import Multi_select from '@material-ui/icons/List';
import Date from '@material-ui/icons/EventNote';
import Checkbox from '@material-ui/icons/CheckBoxOutlined';
import URL from '@material-ui/icons/Link';

import TableData_text from "./text";
import TableData_number from "./number";
import TableData_multi_select from "./multi_select";
import TableData_date from "./date";
import TableData_url from "./url";

function TableData(props) {
    // const data = props.tables[props.table_index].rows[props.row_index + 1].data[props.index]
    const [headerText, setHeaderText] = useState(props.data.text)

    // Material UI Icons
    const icons = {
        Text,
        Number,
        Multi_select, 
        Date,
        Checkbox,
        URL
    }

    // Handle column resizing
    const handler = () => {

        // On mouse move
        function onMouseMove(e) {
            props.re_sizeCol(props.data.width + e.movementX, props.table_index, props.index)
        }

        // on mouse up
        function onMouseUp() {
            document.body.removeEventListener("mousemove", onMouseMove);
            document.body.removeEventListener("mouseup", onMouseUp);
            props.re_sizeCol_patch(props.data.width, props.table, props.index);
          }

        // Adding event listeners
        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp);
    }
    
    if (props.data.header === true) 
        return (
            <div className="table-head cell" style={{ width: props.data.width }}>

                {/* Render the correct icon based on the property type of the column */}
                <span className="table-head-icon">
                    {React.createElement(icons[props.data.property_type], {style: { fontSize: 21  }} )}
                </span>

                <input className="user_input flex_1" placeholder="Header" value={headerText? headerText:""}
                    onChange={(e) => setHeaderText(e.target.value)} 
                    onBlur={() => props.edit_cell('text', headerText, props.data.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }} />
                
                <TableColumn_dropdown 
                    insertColumn={props.insertColumn} 
                    index={props.index}
                    deleteColumn={props.deleteColumn} 
                    last_index={props.last_index} 
                    moveColumn={props.moveColumn} 
                    col_amount={props.col_amount}
                    property_type={props.data.property_type} 
                    table={props.table}
                    table_index={props.table_index} />
                
                <div className="col-reSize"
                    onMouseDown={handler}>
                </div>
            </div>
        )
    else return (
            <div 
                style= {{ 
                    borderTop: props.isDragging && '1px solid #dfdfde',
                    width: props.data.width,
                    paddingTop: props.data.property_type === "Multi_select" && 0,
                }} 
                className="cell content">

                {/* Text */}
                {props.data.property_type === "Text"?
                    <TableData_text
                        data={props.data}
                        edit_cell={props.edit_cell} />: 
                
                // Number
                props.data.property_type === "Number"? 
                    <TableData_number
                        data={props.data}
                        edit_cell={props.edit_cell} />: 

                // Multi-select
                props.data.property_type === "Multi_select"?
                    <TableData_multi_select
                        table={props.table}
                        tables={props.tables}
                        table_index={props.table_index}
                        row_index={props.row_index}
                        index={props.index} />:
                
                // Date
                props.data.property_type === "Date"? 
                    <TableData_date
                        data={props.data}
                        edit_cell={props.edit_cell} />:
                    
                // Checkbox 
                props.data.property_type === "Checkbox"? 
                    <TableData_date 
                        data={props.data}
                        edit_cell={props.edit_cell} />:

                // If property type is URL
                props.data.property_type === "URL"? 
                    <TableData_url
                        data={props.data}
                        edit_cell={props.edit_cell}
                        width={props.data.width} />: null}
            </div>
        )
}
const mapStateToProps = (state) => {
    return { 
        tables: state.tables, 
    }
}
export default connect(mapStateToProps, { edit_cell, re_sizeCol, re_sizeCol_patch })(TableData)