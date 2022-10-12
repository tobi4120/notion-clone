import React, { useState } from "react";
import { connect } from 'react-redux';
import { delete_element, change_bgColor } from "../../../../../../actions";
import ColorDropdown from "../../color_dropdown";
import DropdownContainer from "../../dropdown_container";

const ElementSettings_dropdownContent = (props) => {
    const [colorDropdownShown, setColorDropdownShown] = useState(false);

    // Change element background color
    const change_bgColor_forRedux = (color) => {
        props.change_bgColor(props.element.id, color)
        props.setDropdownShown(false)
    }

    return (
        <div className="dropdown-content">
            {/* Delete Element */}
            <a onClick={()=>props.delete_element(props.element)} onMouseEnter={()=>setColorDropdownShown(false)}>
                <i className="far fa-trash-alt"></i>
                <p>Delete</p>
            </a>

            {/* Change background color */}
            {props.element.element_type !== "Table" && props.element.element_type !== "Kanban" &&
                <div className="element-color dropdown-option" onMouseEnter={()=>setColorDropdownShown(true)}>
                    <i className="fas fa-paint-roller"></i>
                    <p>Background</p>
                    <i className="fas fa-caret-right"></i>
                    {colorDropdownShown && 
                        <DropdownContainer 
                            setDropdownShown={props.setDropdownShown} 
                            translate_Y="-77%"
                            screen={false}
                            className={"color-drpdn"}>

                            <div className="dropdown-content sub-menu">
                                <ColorDropdown 
                                    change_color={change_bgColor_forRedux} 
                                    selected_color={props.element.color}
                                    forElementBackground={true} />
                            </div> 
                        </DropdownContainer>
                    }
                </div>
            }
        </div>
    )
};

const mapStateToProps = (state) => {
    return { selected_page: state.selected_page, pages: state.pages.data }
}

export default connect(mapStateToProps, {
    delete_element,
    change_bgColor
})(ElementSettings_dropdownContent);