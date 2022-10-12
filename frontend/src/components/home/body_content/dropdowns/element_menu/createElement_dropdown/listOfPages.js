import React, { useState } from "react";
import { connect } from 'react-redux';
import DropdownContainer from "../../dropdown_container";

const ListOfPages = (props) => {
    return (
        <DropdownContainer setDropdownShown={props.setDropdownShown}>
            <div className="dropdown-content list-of-pages">
                <p>Select a page</p>
                {props.pages.map(page => {
                    return (    
                        <a key={page.id} onClick={() => { 
                            props.setDropdownShown(false);
                            props.create_element(props.index, props.page.id, "Page_link", props.order_on_page, 
                                props.element_above_order, page.id);
                        }}>
                            <i className="far fa-file-alt"></i>
                            {page.name}
                        </a>
                    )
                })}
            </div>
        </DropdownContainer>
    )
};

const mapStateToProps = (state) => {
    return { pages: state.pages}
}
export default connect(mapStateToProps)(ListOfPages)