import React from "react";
import GroupDropdown_content from "./groupDropdown_content";
import { connect } from "react-redux";
import { delete_group } from "../../../../actions/kanban";

class GroupDropdown extends React.Component {
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

            if (!this.myRef.current.contains(event.target)) {

                if (event.target.className !== "fas fa-ellipsis-h option") {
                    this.setState({ dropdown_hidden: !this.state.dropdown_hidden })
                }
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }

    // Open delete confirmation modal
    open_deleteModal = () => {
        this.setState({ modal_hidden: false, dropdown_hidden: true })
    }

    render() {
        return (
            <div className="dropdown">
                <div className="dropdown_parent">
                    <i className="fas fa-ellipsis-h group-options" onClick={() => 
                        this.setState({ dropdown_hidden: !this.state.dropdown_hidden })
                    }></i>
                </div>

                {this.state.dropdown_hidden === false? 
                    <div ref={this.myRef}>
                        <GroupDropdown_content
                            kanban_id={this.props.kanban_id} 
                            group_id={this.props.group_id}
                            color={this.props.color}
                            open_deleteModal={this.open_deleteModal} />
                    </div>: null}
                
                {/* Delete confirmation modal */}
                {this.state.modal_hidden === false? <div className="semi-transparent-bg">
                    <div className="modal">
                        <p>Are you sure you want to delete this group?</p>

                        <button className="delete-btn" onClick={() => { 
                            this.props.delete_group(this.props.kanban_id, this.props.group_id); 
                            this.setState({ modal_hidden: true }); this.props.clear_input(); 
                        }}>
                            Delete
                        </button>

                        <button className="cancel-btn" onClick={() => this.setState({modal_hidden: true})}>
                            Cancel
                        </button>
                    </div>
                </div>: null}
            </div>
        )
    }
}
export default connect(null, { delete_group })(GroupDropdown)