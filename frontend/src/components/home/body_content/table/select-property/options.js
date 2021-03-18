import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { edit_tag_name, delete_tag, change_tag_color } from "../../../../../actions/table";
import ColorDropdown from "../../dropdowns/color_dropdown";
import DropdownContentPlaceholder from "../../dropdowns/dropdown_placeholder";

function Option(props) {
    const node = useRef();
    const [transform, set_transform] = useState("")
    const [opacity, set_opacity] = useState(0)
    const [tagName, set_tagName] = useState(props.tag.name)

    // Change tag color
    const change_color = (color) => {
        props.change_tag_color(props.tag.id, color, props.table_index, props.col_index)
    }
    
    return (
        <DropdownContentPlaceholder ref={node} set_transform={set_transform} set_opacity={set_opacity}
            translate_Y={"-90%"}>
            <div className="tag-option-dropdown dropdown-content" ref={node} 
                style={{ transform: transform, opacity: opacity }}>
                
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
                            props.set_dropdownShown(false);
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
        </DropdownContentPlaceholder>
    )
}
export default connect(null, { edit_tag_name, delete_tag, change_tag_color })(Option)