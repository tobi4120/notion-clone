import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { change_color } from "../../../../actions/kanban";
import ColorDropdown from "../dropdowns/color_dropdown";
import DropdownContentPlaceholder from "../dropdowns/dropdown_placeholder";

function GroupDropdown_content(props) {
    const node = useRef();
    const [transform, set_transform] = useState("")
    const [opacity, set_opacity] = useState(0)

    // Change color
    const change_color = (color) => {
        props.change_color(props.group_id, color, props.kanban_id)
    }

    return (
        <DropdownContentPlaceholder ref={node} set_transform={set_transform} set_opacity={set_opacity}
            translate_Y="-96%" translate_X="-88%">
            <div className="dropdown-content" ref={node} style={{ transform: transform, opacity: opacity }}>
                <a onClick={() => props.open_deleteModal()}>
                    <i className="far fa-trash-alt"></i>
                    Delete
                </a>
                <hr className="colors-hr" />
                <ColorDropdown 
                    change_color={change_color}
                    selected_color={props.color} />
            </div>
        </DropdownContentPlaceholder>
    )
}
export default connect(null, { change_color })(GroupDropdown_content)