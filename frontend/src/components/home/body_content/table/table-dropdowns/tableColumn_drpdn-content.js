import React, { useState, useEffect, useRef } from "react";

import Text from '@material-ui/icons/Subject';
import Number from "./number-icon";
import Multi_select from '@material-ui/icons/List';
import Date from '@material-ui/icons/EventNote';
import Checkbox from '@material-ui/icons/CheckBoxOutlined';
import URL from '@material-ui/icons/Link';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import PropertyType_dropdown from "./property-type-dropdown";

const icons = {
    Text,
    Number,
    Multi_select, 
    Date,
    Checkbox,
    URL
}

function TableColumn_dropdownContent(props) {
    const node = useRef();
    const [property_dropdown_hidden, set_property_dropdown] = useState(true)
    const [transform, set_transform] = useState("")
    const [opacity, set_opacity] = useState(0)

    useEffect(() => {
        const rect = node.current.getBoundingClientRect()

        // If the dropdown is dropping below the window size (meaning we can't see part of it)
        // reverse the direction and have it point upwards
        if (rect.bottom > window.innerHeight || window.innerHeight - rect.bottom < 15) {
            set_transform('translateY(-70%)')

            // Check if dropdown is past the width of the window size
            if (rect.right > window.innerWidth) {
                set_transform('translateY(-70%) translateX(-100%)')
            }
        } else {
            // Check if dropdown is past the width of the window size
            if (rect.right > window.innerWidth) {
                set_transform('translateX(-88%)')
            }
        }
        set_opacity(100)
    })

    return (
        <div className="dropdown-content left-aligned table_dropdown" ref={node} 
            style={{ transform: transform, opacity: opacity }}>

            {/* Property Type */}
            <div className="column-dropdown-header">  
                <div className="property-type-title">PROPERTY TYPE</div>

                <div className="dropdown-option" style={{ display: 'block'}}
                    onMouseOver={() => set_property_dropdown(false)}
                    onMouseLeave={() => set_property_dropdown(true)}>
                        
                        <div className="property-type-container">
                            {/* Render the correct icon based on the property type of the column */}
                            <span className="table-dropdown-icon">
                                {React.createElement(icons[props.property_type], 
                                {style: { fontSize: 'inherit' }} )}
                            </span>

                            <p className="property-type">{props.property_type === "Multi_select"? 
                                "Multi-select": props.property_type}
                            </p>
                            <i className="fas fa-caret-right property-show-more"></i>
                        </div>

                    {/* Property Types Dropdown */}
                    {property_dropdown_hidden === false? 
                        <PropertyType_dropdown 
                            col_index={props.index} 
                            table={props.table}
                            table_index={props.table_index} 
                            close_menus={props.close_menus} />: null}
                </div>
            </div>

            <hr />

            {/* Insert column */}
            <a className="menu-option" 
                onClick={() => { 
                    props.insertColumn(props.index, 'left'); 
                    props.close_dropdown();
                }}>
                <span className="table-dropdown-icon">
                    <ArrowBackIcon fontSize='inherit' />
                </span>                
                <p>Insert column left</p>
            </a>

            <a className="menu-option" 
                onClick={() => {
                    props.insertColumn(props.index, 'right'); 
                    props.close_dropdown();
                }}>
                <span className="table-dropdown-icon">
                    <ArrowForwardIcon fontSize='inherit' />
                </span>  
                <p>Insert column right</p>
            </a>

            {/* Move column */}
            {props.index !==0? 
                <a className="menu-option"  
                    onClick={() => { 
                        props.moveColumn(props.index, 'left'); 
                        props.close_dropdown();
                    }}>
                    <span className="table-dropdown-icon">
                        <ArrowBackIcon fontSize='inherit' />
                    </span>  
                    <p>Move column left</p>
                </a>: null}

            {props.index !== props.last_index? 
                <a className="menu-option" 
                    onClick={() => {
                        props.moveColumn(props.index, 'right');
                        props.close_dropdown();
                    }}>
                    <span className="table-dropdown-icon">
                        <ArrowForwardIcon fontSize='inherit' />
                    </span>  
                    <p>Move column right</p>
                </a>: null}
            
            {/* Delete column */}
            {props.col_amount > 1? 
            <a className="menu-option" 
                onClick={() => {
                    props.close_dropdown();
                    props.show_modal();
                }}>
                <i className="far fa-trash-alt"></i>
                <p>Delete column</p>
            </a>: null}
        </div>
    )
}
export default TableColumn_dropdownContent