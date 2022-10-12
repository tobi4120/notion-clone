import React, { useState, useRef } from "react";
import TableColumn_dropdownContent from "./dropdown_content";
import ToggleButton from "../../../../dropdowns/toggle_button";
import DeleteConfirmationModal from "../../../../other/deleteConfirmationModal";
import DropdownContainer from "../../../../dropdowns/dropdown_container";

const TableColumn_dropdown = (props) => {
    const [dropdownShown, setDropdownShown] = useState(false);
    const [modalShown, setModalShown] = useState(false);
    const dropdownRef = useRef(null);

    const deleteColumn = () => {
        setModalShown(false);
        props.deleteColumn(props.index);
    }

    return (
        <div className="tableColumn_dropdown" ref={dropdownRef}>
            <ToggleButton 
                dropdownShown={dropdownShown} 
                setDropdownShown={setDropdownShown}>
                <i className="fas fa-ellipsis-h dropdown_parent pointer" />
            </ToggleButton>
            
            {dropdownShown &&
                <DropdownContainer 
                    setDropdownShown={setDropdownShown} 
                    translate_Y="-70%" 
                    translate_X="-100%"
                    translate_X2="-88%"
                    ref={dropdownRef}>

                    <TableColumn_dropdownContent
                        property_type={props.property_type}
                        index={props.index} 
                        table={props.table}
                        table_index={props.table_index} 
                        insertColumn={props.insertColumn}
                        moveColumn={props.moveColumn}
                        last_index={props.last_index}
                        col_amount={props.col_amount}
                        setDropdownShown={setDropdownShown}
                        setModalShown={setModalShown} />
                </DropdownContainer>}

            {/* Delete column confirmation modal */}
            {modalShown &&
                <DeleteConfirmationModal
                    message="Are you sure you want to delete this column?"
                    deleteFunction={deleteColumn}
                    setModalShown={setModalShown} />}
        </div>
    )
};

export default TableColumn_dropdown;