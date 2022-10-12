import React from 'react';
import { Link } from "react-router-dom";

function BodyHeader(props) {
    return (
        <div className="body-header">
            {!props.menu_shown && 
                <div className="show-menu-btn" 
                    onClick={() => props.toggle_menu(true)}>
                    <i className="fas fa-bars"></i>
                </div>}

            {props.breadcrumb.map((page, count) => {
                return (
                    <div className="page-link" key={page.id}>
                        {count === 0? null: <p className="slash"> / </p>}
                        <Link to={`/${page.id}`}>{page.name}</Link>
                    </div>)
            })}
        </div>
    )
}
export default BodyHeader