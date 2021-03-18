import React, { useRef, useEffect, useState } from "react";
import TagOption_dropdown from "./tag-option-dropdown";
import { connect } from "react-redux";
import { remove_tag, add_tag_to_cell, add_tag } from "../../../../../actions/table";
import DropdownContentPlaceholder from "../../dropdowns/dropdown_placeholder";

function MultiSelect_PopUp(props) {
    const node = useRef();
    const [inputValue, change_inputValue] = useState("")
    const [head_cell] = useState(props.tables[props.table_index].rows[0].data[props.col_index])
    const [data] = useState(props.tables[props.table_index].rows[props.row_index + 1].data[props.col_index])
    const [transform, set_transform] = useState("")
    const [opacity, set_opacity] = useState(0)

    // Adding event listener to detect clicks outside the modal
    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
      }, []);

    const handleClick = e => {
        // If user clicked outside modal - hide it
        if (!node.current.contains(e.target)) {

            if (e.target.className !== "screen")
                props.setMultiSelect_popup(false);
        }
    }

    return (
        <DropdownContentPlaceholder ref={node} set_transform={set_transform} set_opacity={set_opacity}
            translate_Y="-98%" translate_X="-37%">
            <div className="multi-select-popup" ref={node} style={{ transform: transform, opacity: opacity }}>
                <div className="tag-input-box">
                    {data.tags.map((tag, tag_index) => {
                        return (
                            <div className={`tag ${tag.color}`} key={tag.id}>
                                <span className="span-input-tag">{tag.name}</span>
                                <span className="close" onClick={() =>
                                        props.remove_tag(data.id, tag, props.table_index, 
                                        props.row_index, props.col_index, tag_index, props.table)}>
                                    &times;
                                </span>
                            </div>
                        )
                    })}
                    <input 
                        placeholder={data.tags.length > 0? "": "Select or create an option..."}
                        value={inputValue}
                        onChange={(e) => change_inputValue(e.target.value)}
                        onBlur={() => {
                            change_inputValue("");
                            props.add_tag(inputValue, head_cell, data.id, props.table_index, props.row_index, 
                                props.col_index, props.table); 
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}>
                    </input>
                </div>

                <div className="tag-options">
                    <p className="tag-option-title">Select an option or create one</p>
                    <div className="column-tags">
                        {head_cell.tag_heads.map(tag => {
                            return (
                                <div className="tag-option" key={tag.id} onClick={(e) =>
                                    props.add_tag_to_cell(tag, data.id, props.table_index, 
                                    props.row_index, props.col_index, e.target, props.table)}>

                                    <div className={`tag ${tag.color}`} key={tag.id}>
                                        <span className="span-tag">{tag.name}</span>
                                    </div>
                                    <TagOption_dropdown 
                                        tag={tag}
                                        table_index={props.table_index} 
                                        col_index={props.col_index}
                                        row_index={props.row_index} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </DropdownContentPlaceholder>
    )
}
const mapStateToProps = (state) => {
    return { 
        tables: state.tables, 
    }
}
export default connect(mapStateToProps, { remove_tag, add_tag_to_cell, add_tag })(MultiSelect_PopUp)