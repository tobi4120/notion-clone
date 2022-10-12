import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

function TableData_text(props) {
    const [text, setText] = useState(props.data.text)

    return (
        <TextareaAutosize
            autoComplete="off" 
            className="user_input table-text-input" 
            value={text? text: ""}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => props.edit_cell(props.data.property_type, text, props.data.id)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }} 
            resize="none" rows={1} wrap="soft" />
    )
}
export default TableData_text;
