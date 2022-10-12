import React from "react";

const DropdownOption = (props) => {
    return (
        <a onClick={async () => props.create_element_func(props.elementType, props.element_above_order)}>
            <img className="drpdn-icon" src={props.photo} alt={props.header} />
            <div className="drpdn-text">
                <p className="drpdn-head">{props.header}</p>
                <p className="drpdn-sub-head">{props.subheader}</p>
            </div>
        </a>
    )
}
export default DropdownOption;