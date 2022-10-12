import React, { useState, useRef } from "react";
import GroupDropdown_content from "./dropdown_content";
import { connect } from "react-redux";
import { delete_group } from "../../../../../../actions/kanban";
import DeleteConfirmationModal from "../../../other/deleteConfirmationModal";
import ToggleButton from "../../../dropdowns/toggle_button";
import DropdownContainer from "../../../dropdowns/dropdown_container";

const GroupDropdown = (props) => {
    const [dropdownShown, setDropdownShown] = useState(false);
    const [modalShown, setModalShown] = useState(false);
    const dropdownRef = useRef(null);

    // Open delete confirmation modal
    const openModal = () => {
        setDropdownShown(false);
        setModalShown(true);
    }

    // Delete kanban group
    const delete_group = () => {
        props.delete_group(props.kanban_id, props.group_id); // Redux function
        setModalShown(false);
        props.set_GroupName(''); 
    }

    return (
        <div className="kanban_group_dropdown" ref={dropdownRef}>
            <ToggleButton 
                dropdownShown={dropdownShown} 
                setDropdownShown={setDropdownShown}>
                <i className="fas fa-ellipsis-h group-options" />
            </ToggleButton>

            {dropdownShown && 
                <DropdownContainer 
                    setDropdownShown={setDropdownShown} 
                    translate_Y="-96%" 
                    translate_X="-88%"
                    ref={dropdownRef}>
                    <GroupDropdown_content
                        kanban_id={props.kanban_id} 
                        group_id={props.group_id}
                        color={props.color}
                        openModal={openModal} />
                </DropdownContainer>}
            
            {/* Delete confirmation modal */}
            {modalShown && 
                <DeleteConfirmationModal
                    message="Are you sure you want to delete this group?"
                    deleteFunction={delete_group}
                    setModalShown={setModalShown} />}
        </div>
    )
}
export default connect(null, { delete_group })(GroupDropdown);