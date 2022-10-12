import React, { useRef } from "react";
import { connect } from "react-redux";
import { change_color } from "../../../../../../actions/kanban";
import ColorDropdown from "../../../dropdowns/color_dropdown";

function GroupDropdown_content(props) {
    // Change color
    const change_color = (color) => {
        props.change_color(props.group_id, color, props.kanban_id)
    }

    return (
        <div className="dropdown-content">
            <a onClick={() => props.openModal()}>
                <i className="far fa-trash-alt"></i>
                Delete
            </a>
            <hr className="colors-hr" />
            <ColorDropdown 
                change_color={change_color}
                selected_color={props.color} />
        </div>
    )
}
export default connect(null, { change_color })(GroupDropdown_content)