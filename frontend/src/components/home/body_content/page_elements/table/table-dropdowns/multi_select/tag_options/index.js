import React, { useState } from "react";
import TagOptions_dropdownContent from "./dropdown_content"
import DropdownContainer from "../../../../../dropdowns/dropdown_container";

function TagOption_dropdown(props) {
    const [dropdownShown, setDropdownShown] = useState(false)

    return (
        <div>
            <i className="fas fa-ellipsis-h tag-elipse" onClick={() => setDropdownShown(!dropdownShown)} />
            {dropdownShown && 
                <DropdownContainer 
                    setDropdownShown={setDropdownShown} 
                    translate_Y="-70%" 
                    className="tag-option-dropdown"> 
                    <TagOptions_dropdownContent
                        tag={props.tag}
                        table_index={props.table_index} 
                        col_index={props.col_index}
                        row_index={props.row_index}
                        setDropdownShown={setDropdownShown} />
                </DropdownContainer>}
        </div>
    )
}
export default TagOption_dropdown;