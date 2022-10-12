import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { delete_row } from "../../../../../../../actions/table";
import DropdownContainer from "../../../../dropdowns/dropdown_container";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

const TableRow_dropdown = (props) => {
    const [dropdownShown, setDropdownShown] = useState(false);
    const dropdownRef = useRef(null);
    return (
        <div ref={dropdownRef}>
            <span className="element-option-icon">
                <DragIndicatorIcon onClick={() => setDropdownShown(!dropdownShown)}/>
            </span>

            {dropdownShown &&
                <DropdownContainer 
                    setDropdownShown={setDropdownShown}
                    translate_X="-90%"
                    className="table_dropdown row-dropdown"
                    ref={dropdownRef}>
                    <a className="pointer" onClick={() => {props.delete_row(props.row_id, props.table_index,
                            props.row_index, props.table); props.setOpen(false); }}>
                        <i className="far fa-trash-alt"></i>
                        <p>Delete row</p>
                    </a>
                </DropdownContainer>}
        </div>
    )
}
export default connect(null, { delete_row })(TableRow_dropdown)