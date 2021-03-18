import React, { useState, useRef, useEffect } from "react";
import Option from "./options"

function TagOption_dropdown(props) {
    const [dropdownShown, set_dropdownShown] = useState(false)

    const node = useRef();

    // Adding event listener to detect clicks outside the modal
    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        // Clear listener
        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
      }, []);

    const handleClick = e => {
        if (node.current) 
            if (!node.current.contains(e.target)) 
                // If user clicked outside doprown - hide it
                set_dropdownShown(false);
    }

    return (
        <div>
            <div ref={node}>
                <i className="fas fa-ellipsis-h tag-elipse" onClick={() => set_dropdownShown(true)}></i>
                {dropdownShown && <Option 
                                    tag={props.tag}
                                    table_index={props.table_index} 
                                    col_index={props.col_index}
                                    row_index={props.row_index}
                                    set_dropdownShown={set_dropdownShown} />}
            </div>
            {dropdownShown && <div className="screen"></div>}
        </div>
    )
}
export default TagOption_dropdown;