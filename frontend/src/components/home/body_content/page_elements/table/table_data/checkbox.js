import React, { useState } from 'react';
import CheckIcon from '@material-ui/icons/Check';

export default function TableData_checkbox() {
    const [checkbox, setCheckbox] = useState(props.data.checkbox);

    return (
        <div className="checkbox">
            {/* Checkbox empty */}
            <input 
                checked={checkbox? checkbox: false} 
                type="checkbox" 
                onChange={(e) => {
                    setCheckbox(e.target.checked);
                    props.edit_cell(props.data.property_type, e.target.checked, props.data.id);
                }} 
            />

            {/* Checkbox checked */}
            {checkbox === true &&
                <span className="to-do-check" onClick={() => {
                    setCheckbox(false);
                    props.edit_cell(props.data.property_type, false, props.data.id);
                }}>
                    <CheckIcon fontSize="inherit" />
                </span>}
        </div>
    )
}
