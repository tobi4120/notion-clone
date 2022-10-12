import React, { useState } from "react";
import ToggleButton from "../../toggle_button";
import ElementSettings_dropdownContent from "./dropdown_content";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import DropdownContainer from "../../dropdown_container";

const ElementSettings_dropdown = (props) => {
    const [dropdownShown, setDropdownShown] = useState(false)

    return (
        <div className="element_settings_dropdown">
            <ToggleButton 
                dropdownShown={dropdownShown} 
                setDropdownShown={setDropdownShown}>
                <span className="add_element"><DragIndicatorIcon fontSize="inherit" /></span>
            </ToggleButton>
                
            { dropdownShown && 
                <DropdownContainer setDropdownShown={setDropdownShown} className={"element-settings-drpdn-parent"}>
                    <ElementSettings_dropdownContent
                        page={props.page}
                        order_on_page={props.order_on_page}
                        index={props.index}
                        column_elements={props.column_elements}
                        element={props.element}
                        setDropdownShown={setDropdownShown} /> 
                </DropdownContainer>
            }
        </div>
    )
};
export default ElementSettings_dropdown;