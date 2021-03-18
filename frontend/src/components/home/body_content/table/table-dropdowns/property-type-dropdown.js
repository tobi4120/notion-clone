import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import SubjectIcon from '@material-ui/icons/Subject';
import ListIcon from '@material-ui/icons/List';
import EventNoteIcon from '@material-ui/icons/EventNote';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import LinkIcon from '@material-ui/icons/Link';
import { change_property } from '../../../../../actions/table';

function PropertyType_dropdown(props) {
    const node = useRef();
    const [transform, set_transform] = useState("")
    const [opacity, set_opacity] = useState(0)

    useEffect(() => {
        const rect = node.current.getBoundingClientRect()

        // If the dropdown is dropping past the width of the window size (meaning we can't see part of it)
        // shift it to the left
        if (rect.right > window.innerWidth) {
            set_transform('translateX(-232%)')
        }
        set_opacity(100)
    })

    return (
        <div className="dropdown-content sub-menu" onClick={() => props.close_menus()} ref={node}
            style={{ transform: transform, opacity: opacity }}>
            <a className="menu-option" onClick={() => 
                props.change_property('Text', props.col_index, props.table, props.table_index)}>
                
                <span className="table-dropdown-icon">
                    <SubjectIcon fontSize="inherit" />
                </span>
                <p>Text</p>
            </a>
            <a className="menu-option" onClick={() => 
                props.change_property('Number', props.col_index, props.table)}>

                <i className="fas fa-hashtag table-dropdown-icon"></i>
                <p>Number</p>
            </a>
            <a className="menu-option" onClick={() => 
                props.change_property('Multi_select', props.col_index, props.table)}>
                
                <span className="table-dropdown-icon">
                    <ListIcon fontSize="inherit" />
                </span>
                <p>Multi-select</p>
            </a>
            <a className="menu-option" onClick={() => 
                props.change_property('Date', props.col_index, props.table)}>
                
                <span className="table-dropdown-icon">
                    <EventNoteIcon fontSize="inherit" />
                </span>
                <p>Date</p>
            </a> 
            <a className="menu-option" onClick={() => 
                props.change_property('Checkbox', props.col_index, props.table)}>
                
                <span className="table-dropdown-icon">
                    <CheckBoxOutlinedIcon fontSize="inherit" />
                </span>
                <p>Checkbox</p>
            </a>
            <a className="menu-option" onClick={() => 
                props.change_property('URL', props.col_index, props.table)}>
                
                <span className="table-dropdown-icon">
                    <LinkIcon fontSize="inherit" />
                </span>
                <p>URL</p>
            </a>
        </div>
    )
}
export default connect(null, { change_property }) (PropertyType_dropdown)