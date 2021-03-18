import React, { Component } from "react";
import TableColumn_dropdownContent from "./tableColumn_drpdn-content";

class TableColumn_dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdown_hidden: true,
            modal_hidden: true,
        }
        this.myRef = React.createRef();
    }

    componentDidMount() {
        // Add event listener to detect when someone clicks away from menu
        let handler = (event) => {
            if (!this.myRef.current) return
            
            if (!this.myRef.current.contains(event.target)) 
                
                if (event.target.className !== "fas fa-ellipsis-h dropdown_parent pointer")
                    this.setState({dropdown_hidden: true})
        }
        document.addEventListener("mousedown", handler)

        return () => document.removeEventListener("mousedown", handler)
    }

    handleClick = () => {
        if (this.state.dropdown_hidden === true) this.setState({ dropdown_hidden: false })
        else this.setState({ dropdown_hidden: true })
    }

    // Close dropdown menu
    close_dropdown = () => 
        this.setState({ dropdown_hidden: true })

    // Close dropdown and property dropdown menu (runs when user clicks on a property type)
    close_menus = () =>
        this.setState({ dropdown_hidden: true, property_dropdown_hidden: true })

    // Show delete menu modal
    show_modal = () => 
        this.setState({ modal_hidden: false })

    render() {
        return (
            <div className="dropdown">
                <i className="fas fa-ellipsis-h dropdown_parent pointer" onClick={this.handleClick}></i>
                
                {this.state.dropdown_hidden === false? 
                    <div ref={this.myRef}>
                        <TableColumn_dropdownContent
                            property_type={this.props.property_type}
                            index={this.props.index} 
                            table={this.props.table}
                            table_index={this.props.table_index} 
                            close_dropdown={this.close_dropdown}
                            close_menus={this.close_menus}
                            insertColumn={this.props.insertColumn}
                            moveColumn={this.props.moveColumn}
                            last_index={this.props.last_index}
                            col_amount={this.props.col_amount}
                            show_modal={this.show_modal} />
                    </div>: null}

                {/* Delete column confirmation modal */}
                {this.state.modal_hidden === false? 
                    <div className="semi-transparent-bg">
                        <div className="modal">
                            <p style={{ 'fontWeight': 'normal' }}>Are you sure you want to delete this column?</p>

                            <button className="delete-btn" onClick={() => { 
                                this.setState({ modal_hidden: true }); 
                                this.props.deleteColumn(this.props.index);
                            }}>
                                Delete
                            </button>

                            <button className="cancel-btn" onClick={() => this.setState({ modal_hidden: true })}>
                                Cancel
                            </button>
                        </div>
                    </div>: null}
            </div>
        )
    };
};

export default TableColumn_dropdown;