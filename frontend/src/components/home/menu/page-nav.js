import React from "react";
import { useNavigate } from 'react-router-dom';
import MenuDropdown from "./menu_dropdown";

function PageNav(props) {
    const navigate = useNavigate();

    return (
        <div className={props.selected_page && props.selected_page.id === props.page.id? "active page": "page"} 
            style={{paddingLeft: `${20 * props.depth + 12}px`}} 
            onClick={(e) => {
                if (e.target.className === "page_name" ||  e.target.className === "page-title" 
                ||  e.target.className === "page" ||  e.target.className === "far fa-file-alt") {
                    navigate(`/${props.page.id}`);
                    if (screen.width <= 725) props.toggle_menu(false);
                }
            }}>
            
            {/* Open/close arrow */}
            <div className="arrow-toggle-button" onClick={() => props.openClosePages(props.page.id)}>
                <div className="triangle" style={{ transform: !props.page.closed && "rotate(90deg)" }}/>
            </div>

            {/* File icon */}
            <i className="far fa-file-alt"></i>

            {/* Page name */}
            <div className="page_name">
                <p className="page-title">{props.page.name || "Untitled"}</p>
            </div>

            {/* Dropdown */}
            <MenuDropdown 
                page={props.page}
                changeNameOnMenu={props.changeNameOnMenu} 
                deletePage={props.deletePage}
                addPage={props.addPage} />
        </div>)
}
export default PageNav