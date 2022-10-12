import React, { useState } from "react";
import ToggleButton from "../../toggle_button";
import CreateElement_dropdownContent from "./dropdown_content";
import AddIcon from '@material-ui/icons/Add';

const CreateElement_dropdown = (props) => {
    const [dropdownShown, setDropdownShown] = useState(false)

    return (
        <div className="create_element_dropdown">
            <ToggleButton 
                dropdownShown={dropdownShown} 
                setDropdownShown={setDropdownShown}>
                <span className="add_element"><AddIcon fontSize="inherit" /></span>
            </ToggleButton>
                
            {dropdownShown && 
                <CreateElement_dropdownContent
                    page={props.page}
                    order_on_page={props.order_on_page}
                    index={props.index}
                    column_elements={props.column_elements}
                    element={props.element}
                    setDropdownShown={setDropdownShown} /> 
            }
        </div>
    )
}
export default CreateElement_dropdown