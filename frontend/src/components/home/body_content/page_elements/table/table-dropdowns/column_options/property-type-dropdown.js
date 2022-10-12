import React from "react";
import { connect } from "react-redux";
import SubjectIcon from '@material-ui/icons/Subject';
import ListIcon from '@material-ui/icons/List';
import EventNoteIcon from '@material-ui/icons/EventNote';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import LinkIcon from '@material-ui/icons/Link';
import { change_property } from '../../../../../../../actions/table';

function PropertyType_dropdown(props) {
    return (
        <div className="dropdown-content">
            <a className="menu-option" onClick={() => {props.setDropdownShown(false);
                props.change_property('Text', props.col_index, props.table, props.table_index)}}>
                
                <span className="table-dropdown-icon">
                    <SubjectIcon fontSize="inherit" />
                </span>
                <p>Text</p>
            </a>
            <a className="menu-option" onClick={() => {props.setDropdownShown(false);
                props.change_property('Number', props.col_index, props.table)}}>

                <i className="fas fa-hashtag table-dropdown-icon"></i>
                <p>Number</p>
            </a>
            <a className="menu-option" onClick={() => {props.setDropdownShown(false);
                props.change_property('Multi_select', props.col_index, props.table)}}>
                
                <span className="table-dropdown-icon">
                    <ListIcon fontSize="inherit" />
                </span>
                <p>Multi-select</p>
            </a>
            <a className="menu-option" onClick={() => {props.setDropdownShown(false);
                props.change_property('Date', props.col_index, props.table)}}>
                
                <span className="table-dropdown-icon">
                    <EventNoteIcon fontSize="inherit" />
                </span>
                <p>Date</p>
            </a> 
            <a className="menu-option" onClick={() => {props.setDropdownShown(false);
                props.change_property('Checkbox', props.col_index, props.table)}}>
                
                <span className="table-dropdown-icon">
                    <CheckBoxOutlinedIcon fontSize="inherit" />
                </span>
                <p>Checkbox</p>
            </a>
            <a className="menu-option" onClick={() => {props.setDropdownShown(false);
                props.change_property('URL', props.col_index, props.table)}}>
                
                <span className="table-dropdown-icon">
                    <LinkIcon fontSize="inherit" />
                </span>
                <p>URL</p>
            </a>
        </div>
    )
}
export default connect(null, { change_property }) (PropertyType_dropdown)