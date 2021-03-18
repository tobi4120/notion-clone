import React, { useState } from "react";
import { connect } from "react-redux";
import TableColumn_dropdown from "./table-dropdowns/tableColumn_dropdown";
import { edit_cell, re_sizeCol, re_sizeCol_patch } from "../../../../actions/table";
import Text from '@material-ui/icons/Subject';
import Number from "./table-dropdowns/number-icon";
import Multi_select from '@material-ui/icons/List';
import Date from '@material-ui/icons/EventNote';
import Checkbox from '@material-ui/icons/CheckBoxOutlined';
import URL from '@material-ui/icons/Link';
import MultiSelect_PopUp from "./select-property/multi-select-popup";
import TextareaAutosize from 'react-textarea-autosize';
import CheckIcon from '@material-ui/icons/Check';

// Material UI
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

function TableData(props) {
    const data = props.tables[props.table_index].rows[props.row_index + 1].data[props.index]
    const [text, setText] = useState(props.data.text)
    const [num, setNum] = useState(data.number)
    const [multiSelect_popup, setMultiSelect_popup] = useState(false)
    const [date, setDate] = useState(data.date)
    const [checkbox, setCheckbox] = useState(data.checkbox)
    const [url, setURL] = useState(data.url)
    const [urlInput, set_urlInput] = useState(false)
    const [urlButton_opacity, set_urlButton_opacity] = useState(100)

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

                <input className="user_input flex_1" placeholder="Header" value={text? text:""}
                    onChange={(e) => setText(e.target.value)} 
                    onBlur={() => props.edit_cell('text', text, props.data.id)}
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
                    borderTop: props.isDragging? '1px solid #dfdfde': null,
                    width: props.data.width,
                    paddingTop: props.data.property_type === "Multi_select"? 0: null,
                }} 
                className="cell content"
                onClick={props.data.property_type === "Multi_select"? () => setMultiSelect_popup(true): null}>

                {/* If property type is text */}
                {props.data.property_type === "Text"?
                    <TextareaAutosize
                        autoComplete="off" 
                        className="user_input table-text-input" 
                        value={text? text:""}
                        onChange={(e) => setText(e.target.value)}
                        onBlur={() => props.edit_cell(props.data.property_type, text, data.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }} 
                        resize="none" rows={1} wrap="soft"
                    />: 
                
                // If property type is number
                props.data.property_type === "Number"? 
                    <input 
                        className="user_input" 
                        value={num? num: ""} step="any"
                        type="number" 
                        onChange={(e) => setNum(e.target.value)}
                        onBlur={() => props.edit_cell(props.data.property_type, num, data.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }} 
                    />: 

                // If property type is multi-select
                props.data.property_type === "Multi_select"?
                    <div className="multi-select" onClick={() => setMultiSelect_popup(true)}>
                        <div className="tags">
                            {props.tables[props.table_index].rows[props.row_index + 1].data[props.index].tags.
                                map(tag => {
                                    return (
                                        <div className={`tag ${tag.color}`} key={tag.id}>
                                            {tag.name}
                                        </div>
                                    )
                                })}
                        </div>
                        {multiSelect_popup === true? 
                            <MultiSelect_PopUp 
                                table={props.table}
                                table_index={props.table_index} 
                                col_index={props.index}
                                row_index={props.row_index}
                                setMultiSelect_popup={setMultiSelect_popup} />
                            : null}
                    </div>:
                
                // If property type is date
                props.data.property_type === "Date"? 
                    <div className="table-date">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker
                                variant="inline"
                                value={date}
                                onChange={(e) => {
                                    setDate(e); 
                                    props.edit_cell(props.data.property_type, e, data.id);
                                }}
                                fullWidth={true}
                                InputProps={{
                                    disableUnderline: true,
                                }}
                            />
                        </MuiPickersUtilsProvider> 
                    </div>:
                    
                // If property type is checkbox 
                props.data.property_type === "Checkbox"? 
                    <div className="checkbox">
                        {/* Checkbox empty */}
                        <input 
                            checked={checkbox? checkbox: false} 
                            type="checkbox" 
                            onChange={(e) => {
                                setCheckbox(e.target.checked);
                                props.edit_cell(props.data.property_type, e.target.checked, data.id);
                            }} 
                        />

                        {/* Checkbox checked */}
                        {checkbox === true? 
                            <span className="to-do-check" onClick={() => {
                                setCheckbox(false);
                                props.edit_cell(props.data.property_type, false, data.id);
                            }}>
                                <CheckIcon fontSize="inherit" />
                            </span>: null}
                    </div>:

                // If property type is URL
                props.data.property_type === "URL"? 
                    <div className="url-cell"
                        onMouseEnter={() => set_urlButton_opacity(100)}
                        onMouseLeave={() => set_urlButton_opacity(100)}>
                        <p onClick={() => set_urlInput(true)}>
                            {url? url: <span style={{ opacity: 0 }}>&nbsp;</span>}
                        </p>

                        {/* Input for changing the URL */}
                        {urlInput === true? 
                            <div className="url-input">
                                <input
                                    autoFocus
                                    className="user_input" 
                                    type="url"
                                    value={url? url: ""}
                                    onChange={(e) => setURL(e.target.value)}
                                    onBlur={() => {
                                        props.edit_cell(props.data.property_type, url, data.id);
                                        set_urlInput(false);
                                    }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }} 
                                />
                            </div>: null}

                        {/* Button for clicking on URL. Only shown if url exists and user input contains a '.' */}
                        {url?
                            url.includes(".")?
                            <a className="url-button"
                                href={url.substring(0,7) === "http://"? url: url.substring(0,8) === "https://"?
                                url: `http://${url}`} 
                                style={{ opacity: urlButton_opacity }}>
                                    
                                <URL />
                            </a>: null: null}
                    </div>: null}
            </div>
        )
}
const mapStateToProps = (state) => {
    return { 
        tables: state.tables, 
    }
}
export default connect(mapStateToProps, { edit_cell, re_sizeCol, re_sizeCol_patch })(TableData)