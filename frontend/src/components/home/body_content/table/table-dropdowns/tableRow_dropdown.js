import React from "react";
import { connect } from "react-redux";
import { delete_row } from "../../../../../actions/table";
import DropdownContentPlaceholder from "../../dropdowns/dropdown_placeholder";

class TableRow_dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();

        this.state = {
            transform: "",
            opacity: 0,
        }
    }

    componentDidMount() {
        // Add event listener to detect when someone clicks away from menu
        let handler = (event) => {
            if (!this.myRef.current) return
            
            if (!this.myRef.current.contains(event.target)) 
                if (event.target.className.baseVal !== "" && event.target.className.baseVal !== "MuiSvgIcon-root") 
                    this.props.setOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }

    set_transform = (value) => {
        this.setState({transform: value})
    }

    set_opacity = (value) => {
        this.setState({opacity: value})
    }

    render() {
        return (
            <DropdownContentPlaceholder ref={this.myRef} set_transform={this.set_transform} set_opacity={this.set_opacity}
                translate_X="-90%">
            <div className="dropdown-content table_dropdown row-dropdown" ref={this.myRef}
                style={{ transform: this.state.transform, opacity: this.state.opacity }}>
                <a className="pointer" onClick={() => {this.props.delete_row(this.props.row_id, this.props.table_index,
                        this.props.row_index, this.props.table); this.props.setOpen(false); }}>
                    <i className="far fa-trash-alt"></i>
                    <p>Delete row</p>
                </a>
            </div>
            </DropdownContentPlaceholder>
        )
    }
}
export default connect(null, { delete_row })(TableRow_dropdown)