import React, { useState } from "react";
import { connect } from "react-redux";
import { edit_tag_name, delete_tag, change_tag_color } from "../../../../../../../../actions/table";
import ColorDropdown from "../../../../../dropdowns/color_dropdown";

function TagOptions_dropdownContent(props) {
    const [tagName, set_tagName] = useState(props.tag.name)

    // Change tag color
    const change_color = (color) => {
        props.change_tag_color(props.tag.id, color, props.table_index, props.col_index)
    }
    
    return (
        <div className="dropdown-content">
            {/* Change tag name */} 
            <input 
                autoFocus
                value={tagName} 
                onChange={(e) => set_tagName(e.target.value)}
                onBlur={() => {
                    props.edit_tag_name(tagName, props.tag.id, props.table_index, props.col_index)
                }}
                onKeyDown={(e) => { 
                    if (e.key === 'Enter') {
                        e.target.blur(); 
                        props.setDropdownShown(false);
                    }
                }} />

            {/* Delete tag */} 
            <a onClick={() => props.delete_tag(props.tag.id, props.table_index, 
                props.col_index)}>
                    
                <i className="far fa-trash-alt"></i>
                Delete
            </a>
            
            {/* Horizontal rule */} 
            <hr className="colors-hr" />
            
            {/* Colors */} 
            <ColorDropdown
                change_color={change_color}
                selected_color={props.tag.color} />
        </div>
    )
}
export default connect(null, { edit_tag_name, delete_tag, change_tag_color })(TagOptions_dropdownContent)