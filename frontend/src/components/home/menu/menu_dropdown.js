import React, { useState, useRef } from "react";
import { edit_page_name, changeNameOnBody } from "../../../actions/page_menu"
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import DropdownContainer from "../body_content/dropdowns/dropdown_container";
import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const MenuDropdown = (props) => {
    const [dropdownShown, setDropdownShown] = useState(false);
    const [dropdownRenameShown, setDropdownRenameShownState] = useState(false);
    const [modalShown, setModalShown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const setDropdownRenameShown = (status) => {
        update_name();
        setDropdownRenameShownState(status);
    }

    const shouldBlur = (e) => {
        if (e.keyCode === 13) {
            update_name();
            setDropdownRenameShownState(false);
        }
    }

    // Call redux action to rename the page title (patch request)
    const update_name = () => {
        let name = props.page.name

        if (!name) {
            name = "Untitled"
            props.changeNameOnMenu(props.page.id, "Untitled")
        }
        props.edit_page_name(props.page.id, name)
    }

    const delete_page = () => {
        // Get number of pages that have no parent
        let page_count = 0
        for (const page of props.pages) {
            if (!page.parent) page_count ++
        }
        if (page_count === 1 && !props.page.parent) {
            alert("Error: You must have at least one page.")
            setModalShown(false);
            return
        }
        props.deletePage(props.page.id, props.page.parent)
        setModalShown(false);

        // Redirect to first page
        navigate(`/${props.pages[0].id}`);
    }

    return (
        <div className="menu-dropdown" ref={dropdownRef}> 
            {dropdownShown && <div className="menu-overlay" />}

            {/* Icons */}
            <div className="page-nav-icons">
                <span className="morehoriz-icon">
                    <MoreHorizIcon 
                        onClick={() => setDropdownShown(true)}
                        fontSize="inherit" />
                </span>

                <span className="add-icon">
                    <AddIcon 
                    onClick={() => props.addPage(props.page.id, props.page.depth + 1)}
                    fontSize="inherit" />
                </span>
            </div>

            {/* Dropdown content */}
            {dropdownShown &&
                <DropdownContainer setDropdownShown={setDropdownShown} ref={dropdownRef}>
                    <div className="dropdown-content">
                        <a className="edit-drpdn" onClick={() => { setDropdownShown(false); setDropdownRenameShownState(true); }}>
                            <i className="far fa-edit"></i>
                            Rename
                        </a>
                        <a onClick={() => { setDropdownShown(false); setModalShown(true); }}>
                            <i className="far fa-trash-alt"></i>
                            Delete
                        </a>
                    </div>
                </DropdownContainer>}
            
            {/* Rename page dropdown */}
            {dropdownRenameShown &&
                <DropdownContainer setDropdownShown={setDropdownRenameShown} ref={dropdownRef}>
                    <div className="rename">
                        <a>
                            <input 
                                name="page_name" 
                                autoFocus 
                                onChange={(e) => {
                                    props.changeNameOnMenu(props.page.id, e.target.value); 
                                    props.changeNameOnBody(e.target.value, props.page.id);
                                }} 
                                placeholder="Untitled" 
                                value={props.page.name} 
                                onKeyDown={shouldBlur} />
                        </a>
                    </div>
                </DropdownContainer>}
            
            {/* Delete confirmation modal */}
            {modalShown && 
                <div className="semi-transparent-bg">
                    <div className="modal">
                        <p>Are you sure you want to delete this page?</p>
                        <button className="delete-btn" onClick={delete_page}>Delete</button>
                        <button className="cancel-btn" onClick={() => setModalShown(false)}>Cancel</button>
                    </div>
                </div>}
        </div>
    )
};

const mapStateToProps = (state) => {
    return { pages: state.pages }
}

export default connect(mapStateToProps, {edit_page_name, changeNameOnBody})(MenuDropdown)