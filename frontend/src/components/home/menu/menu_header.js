import React from "react";

export default function MenuHeader(props) {
    return (
        <div className="menu-header">
            <div className="user-icon">
                {props.current_user.first_name.charAt(0)}
            </div>
            <div className="user-first-name">
                <p>{props.current_user.first_name.charAt(0).toUpperCase()}
                    {props.current_user.first_name.substring(1)}'s Notion </p> 
            </div>
            <div className="arrows" onClick={()=> props.toggle_menu(false)}>
                <div className="arrow-left"></div>
                <div className="arrow-left"></div>
            </div>
        </div>
    )
}