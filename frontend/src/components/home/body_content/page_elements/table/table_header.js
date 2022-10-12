import React from "react";
import TableData from "./table_data";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

function TableHeader(props) {
    return (
        <div className="side-by-side table-header">
            {props.row.data.map((data, index) => {
                return <TableData 
                            key={data.id} 
                            data={data} 
                            insertColumn={props.insertColumn}
                            index={index} 
                            deleteColumn={props.deleteColumn} 
                            last_index={props.row.data.length - 1} 
                            moveColumn={props.moveColumn} 
                            col_amount={props.col_amount}
                            table_index={props.table_index} 
                            table={props.table}
                            row_index={0} />
            })}
            <div className="element-options" style={{ opacity: 0 }}>
                <span style={{ cursor: 'default' }} className="option">&#43;</span>
                <div><DragIndicatorIcon/></div>
            </div>
        </div>
    )
}
export default TableHeader