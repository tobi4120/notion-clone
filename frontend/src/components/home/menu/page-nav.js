import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import MenuDropdown from "./menu_dropdown";

function PageNav(props) {
    const [optionOpacity, set_optionOpacity] = useState(0)
    const [dropdownOpen, set_dropdownOpen] = useState(false)
    const history = useHistory();

    return (
        <div className={props.selected_page && props.selected_page.id === props.page_id? "active page": "page"} 
            key={props.page_id} style={{paddingLeft: `${20 * props.depth + 15}px`}} 
            onMouseEnter={() => set_optionOpacity(100)} 
            onMouseLeave={() =>
                dropdownOpen === false? 
                set_optionOpacity(0):
                null
            }
            onClick={(e) => {
                if (e.target.className === "page_name" ||  e.target.className === "page-title" 
                ||  e.target.className === "active page" ||  e.target.className === "far fa-file-alt") {
                    history.push(`/${props.page_id}`);
                }
            }}>

            <i className={props.closed === true?"fas fa-caret-right": "fas fa-caret-down"}
                onClick={() => props.open_close_page_folder(props.page_id)}>
            </i>
            <i className="far fa-file-alt"></i>
            <div className="page_name">
                <p className="page-title">{props.name}</p>
            </div>
            <div className="page-options" style={{ opacity: optionOpacity }}>
                <MenuDropdown 
                    page_id={props.page_id} 
                    page_name={props.name}
                    depth={props.depth}
                    handle_change={props.handle_change} 
                    delete_page_menu={props.delete_page_menu}
                    add_page={props.add_page}
                    parent={props.parent}
                    set_optionOpacity={set_optionOpacity}
                    set_dropdownOpen={set_dropdownOpen} />
            </div>
        </div>)
}
export default PageNav