import React from "react";

const ToggleButton = (props) => {
    return (
        <div className="toggle_button" onClick={()=> props.setDropdownShown(!props.dropdownShown)}>
            { props.children }
        </div>
    )
} 
export default ToggleButton