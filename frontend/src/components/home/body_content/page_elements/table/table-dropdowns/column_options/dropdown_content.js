import React, { useState, useRef } from "react";

import Text from '@material-ui/icons/Subject';
import Number from "./number-icon";
import Multi_select from '@material-ui/icons/List';
import Date from '@material-ui/icons/EventNote';
import Checkbox from '@material-ui/icons/CheckBoxOutlined';
import URL from '@material-ui/icons/Link';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import PropertyType_dropdown from "./property-type-dropdown";
import DropdownContainer from "../../../../dropdowns/dropdown_container";

const icons = {
    Text,
    Number,
    Multi_select, 
    Date,
    Checkbox,
    URL
}

function TableColumn_dropdownContent(props) {
    const [propertyDropdownShown, setPropertyDropdownShown] = useState(false);
    const dropdownRef = useRef(null);

    return (
        <div className="dropdown-content left-aligned table_dropdown" ref={dropdownRef}>
            {/* Property Type */}
            <div className="column-dropdown-header">  
                <div className="property-type-title">PROPERTY TYPE</div>

                <div className="dropdown-option" style={{ display: 'block'}}
                    onMouseOver={() => setPropertyDropdownShown(true)}>
                        <div className="property-type-container">

                            {/* Render the correct icon based on the property type of the column */}
                            <span className="table-dropdown-icon">
                                {React.createElement(icons[props.property_type], 
                                {style: { fontSize: 'inherit' }} )}
                            </span>

                            <p className="property-type">
                                {props.property_type === "Multi_select"? "Multi-select": props.property_type}
                            </p>
                            <i className="fas fa-caret-right property-show-more"></i>
                        </div>

                    {/* Property Types Dropdown */}
                    {propertyDropdownShown &&
                        <DropdownContainer 
                            screen={false}
                            setDropdownShown={setPropertyDropdownShown} 
                            className="sub-menu"
                            translate_X={"-232%"}>
                            <PropertyType_dropdown 
                                col_index={props.index} 
                                table={props.table}
                                table_index={props.table_index}
                                setDropdownShown={props.setDropdownShown} />
                        </DropdownContainer>}
                </div>
            </div>
            <hr />

            {/* Insert column */}
            <a className="menu-option"
                onMouseOver={() => setPropertyDropdownShown(false)}
                onClick={() => { 
                    props.insertColumn(props.index, 'left'); 
                    props.setDropdownShown(false);
                }}>
                <span className="table-dropdown-icon">
                    <ArrowBackIcon fontSize='inherit' />
                </span>                
                <p>Insert column left</p>
            </a>

            <a className="menu-option" 
                onMouseOver={() => setPropertyDropdownShown(false)}
                onClick={() => {
                    props.insertColumn(props.index, 'right'); 
                    props.setDropdownShown(false);
                }}>
                <span className="table-dropdown-icon">
                    <ArrowForwardIcon fontSize='inherit' />
                </span>  
                <p>Insert column right</p>
            </a>

            {/* Move column */}
            {props.index !==0 &&
                <a className="menu-option" 
                    onMouseOver={() => setPropertyDropdownShown(false)}
                    onClick={() => { 
                        props.moveColumn(props.index, 'left'); 
                        props.setDropdownShown(false);
                    }}>
                    <span className="table-dropdown-icon">
                        <ArrowBackIcon fontSize='inherit' />
                    </span>  
                    <p>Move column left</p>
                </a>}

            {props.index !== props.last_index &&
                <a className="menu-option" 
                    onMouseOver={() => setPropertyDropdownShown(false)}
                    onClick={() => {
                        props.moveColumn(props.index, 'right');
                        props.setDropdownShown(false);
                    }}>
                    <span className="table-dropdown-icon">
                        <ArrowForwardIcon fontSize='inherit' />
                    </span>  
                    <p>Move column right</p>
                </a>}
            
            {/* Delete column */}
            {props.col_amount > 1 &&
                <a className="menu-option" 
                    onMouseOver={() => setPropertyDropdownShown(false)}
                    onClick={() => {
                        props.setDropdownShown(false);
                        props.setModalShown(true);
                    }}>
                    <i className="far fa-trash-alt"></i>
                    <p>Delete column</p>
                </a>}
        </div>
    )
}
export default TableColumn_dropdownContent