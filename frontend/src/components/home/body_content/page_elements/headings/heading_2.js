import React, { useState, useRef, useEffect } from "react";

function Heading_2(props) {
    const myRef = useRef();

    useEffect(() => {
        myRef.current.focus({ preventScroll: true });
    }, [])
    
    // In case there is an element whose type is Heading_2 but there is no heading 2...
    if ((props.page_element.heading_2).length === 0) return null

    const [heading_2, set_heading_2] = useState(props.page_element.heading_2[0].heading_text)

    return (
        <div className="side-by-side e_container">
            <input 
                ref={myRef}
                autoComplete="off" 
                onChange={(e) => set_heading_2(e.target.value)} 
                name="heading_2" 
                className={`user_input heading_2 ${props.page_element.color}`} 
                placeholder="Heading 2" 
                value={heading_2} 
                onBlur={()=> props.edit_H2(props.page_element.heading_2[0].id, heading_2)} 
                style={{
                    opacity: props.snapshot.isDragging? '0.5': '1'
                }}/>
        </div>
    )
}
export default Heading_2