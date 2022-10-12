import React, { useState } from 'react'

export default function TableData_number(props) {
    const [num, setNum] = useState(props.data.number)
    return (
        <input 
            className="user_input" 
            value={num? num: ""} step="any"
            type="number" 
            onChange={(e) => setNum(e.target.value)}
            onBlur={() => props.edit_cell(props.data.property_type, num, props.data.id)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }} 
        />
    )
}
