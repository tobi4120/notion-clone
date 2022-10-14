import React, { useState, useRef } from 'react'
import DropdownContainer from "../../../dropdowns/dropdown_container";
import MultiSelect_PopUp from "../table-dropdowns/multi_select/multi-select-popup";

export default function TableData_multi_select(props) {
    const [multiSelectPopupShown, setMultiSelectPopupShown] = useState(false);
    const dropdownRef = useRef(null);

    return (
        <div className="multi-select">

            {/* Shows the tags in the table cell */}
            <div className="tags">
                {props.tables[props.table_index].rows[props.row_index + 1].data[props.index].tags.map(
                    tag => {
                        return (
                            <div className={`tag ${tag.color}`} key={tag.id}>
                                <span className={`${tag.color}-text`}>{tag.name}</span>
                            </div>
                        )
                    })}
            </div>

            {/* Popup for multi-select tags */}
            <div className="popup-container" 
                onClick={() => setMultiSelectPopupShown(true)} 
                ref={dropdownRef}>

                {multiSelectPopupShown && 
                    <DropdownContainer
                        setDropdownShown={setMultiSelectPopupShown} 
                        translate_Y="-98%" 
                        translate_X="-37%"
                        className="multi-select-popup"
                        ref={dropdownRef}
                        topSubtraction={22}
                        leftSubtraction={1}>

                        <MultiSelect_PopUp 
                            table={props.table}
                            table_index={props.table_index} 
                            col_index={props.index}
                            row_index={props.row_index} />

                </DropdownContainer>}
            </div>
        </div>
    )
}
