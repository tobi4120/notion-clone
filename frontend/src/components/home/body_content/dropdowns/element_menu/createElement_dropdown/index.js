import React, { useState, useRef } from "react";
import ToggleButton from "../../toggle_button";
import CreateElement_dropdownContent from "./dropdown_content";
import AddIcon from '@material-ui/icons/Add';
import DropdownContainer from "../../dropdown_container";

const CreateElement_dropdown = (props) => {
    const [dropdownShown, setDropdownShown] = useState(false)
    const dropdownRef = useRef(null);

    return (
        <div className="create_element_dropdown" ref={dropdownRef}>
            <ToggleButton 
                dropdownShown={dropdownShown} 
                setDropdownShown={setDropdownShown}>
                <span className="add_element"><AddIcon fontSize="inherit" /></span>
            </ToggleButton>
                
            {dropdownShown && 
                <DropdownContainer 
                    setDropdownShown={setDropdownShown} 
                    className={"add-element-drpdn-parent"}
                    ref={dropdownRef}>
                    <CreateElement_dropdownContent
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
}
export default CreateElement_dropdown