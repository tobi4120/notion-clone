import React from "react";
import CreateElement_dropdown from './createElement_dropdown';
import ElementSettings_dropdown from "./elementSettings_dropdown";

const Element_menu = (props) => {
    return (
        <div className="element-options">
            <CreateElement_dropdown
                page={props.selected_page}
                order_on_page={props.order_on_page}
                index={props.index}
                column_elements={props.column_elements}
                element={props.element} />
            
            <ElementSettings_dropdown
                element={props.element} />
        </div>
    )
}
export default Element_menu