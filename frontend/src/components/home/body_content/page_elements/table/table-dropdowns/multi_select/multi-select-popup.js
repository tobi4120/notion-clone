import React, { useState } from "react";
import TagOption_dropdown from "./tag_options";
import { connect } from "react-redux";
import { remove_tag, add_tag_to_cell, add_tag } from "../../../../../../../actions/table";

const MultiSelect_PopUp = (props) => {
    const [inputValue, changeInputValue] = useState("")
    const [headCell, setHeadCell] = useState(props.tables[props.table_index].rows[0].data[props.col_index])
    const [data, setData] = useState(props.tables[props.table_index].rows[props.row_index + 1].data[props.col_index])

    return (
        <div>
            {/* Tag input - where you can type in new tags + remove tags */}
            <div className="tag-input-box">
                {data.tags.map((tag, tag_index) => {
                    return (
                        <div className={`tag ${tag.color}`} key={tag.id}>
                            <span className={`${tag.color}-text span-input-tag`}>{tag.name}</span>
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
                    onChange={(e) => changeInputValue(e.target.value)}
                    onBlur={() => {
                        changeInputValue("");
                        props.add_tag(inputValue, headCell, data.id, props.table_index, props.row_index, 
                            props.col_index, props.table); 
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}>
                </input>
            </div>
            
            {/* List of all tags with option on each tag to change color/name  */}
            <div className="tag-options">
                <p className="tag-option-title">Select an option or create one</p>
                <div className="column-tags">
                    {headCell.tag_heads.map(tag => {
                        return (
                            <div className="tag-option" 
                                key={tag.id} 
                                onClick={(e) =>
                                    props.add_tag_to_cell(tag, data.id, props.table_index, 
                                    props.row_index, props.col_index, e.target, props.table
                                )}>

                                <div className={`tag ${tag.color}`} key={tag.id}>
                                    <span className={`${tag.color}-text span-tag`}>{tag.name}</span>
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
    )
}
const mapStateToProps = (state) => {
    return { 
        tables: state.tables, 
    }
}
export default connect(mapStateToProps, { remove_tag, add_tag_to_cell, add_tag })(MultiSelect_PopUp)