import React, { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';

function Text(props) {

    // In case there is an element whose type is text but there is no text...
    if ((props.page_element.text).length === 0) return null
    
    const [text, set_text] = useState(props.page_element.text[0].text)

    return (
        <div className={`text-element ${props.page_element.color}`}>
            <TextareaAutosize 
                autoComplete="off" 
                name="text" 
                onChange={(e) => set_text(e.target.value)} value={text} 
                placeholder="Type your text here..." 
                autoFocus 
                className="text"
                onBlur={()=> props.edit_text(props.page_element.text[0].id, text)} 
                style={{ opacity: props.snapshot.isDragging? '0.5': '1' }} />
        </div>
    )
}
export default Text