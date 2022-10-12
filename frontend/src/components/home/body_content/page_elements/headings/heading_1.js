import React, { useState, useRef, useEffect } from "react";

function Heading_1(props) {
    const myRef = useRef();

    useEffect(() => {
        myRef.current.focus({ preventScroll: true });
    }, [])

    // In case there is an element whose type is Heading_1 but there is no heading 1...
    if ((props.page_element.heading_1).length === 0) return null

    const [heading_1, set_heading_1] = useState(props.page_element.heading_1[0].heading_text)

    return (
        <div className="side-by-side e_container">
            <input 
                ref={myRef}
                autoComplete="off" 
                onChange={(e) => set_heading_1(e.target.value)} 
                name="heading_1" 
                className={`user_input heading_1 ${props.page_element.color}`}
                placeholder="Heading 1" 
                value={heading_1} 
                onBlur={()=> props.edit_H1(props.page_element.heading_1[0].id, heading_1)} 
                style={{ opacity: props.snapshot.isDragging? '0.5': '1' }}/>
        </div>
    )
}
export default Heading_1