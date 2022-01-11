
import React from "react";
import { edit_page_name, edit_name_onChange, delete_page } from "../../../actions/page_menu"
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class MenuDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdown_hidden: true,
            dropdown_rename: true, 
            modal_hidden: true,
            redirect_page: null,
        }
        this.myRef = React.createRef();
        this.renameRef = React.createRef();
    }
    
    componentDidMount() {
        // Add event listener to detect when someone clicks away from menu
        let handler = (event) => {
            if (!this.myRef.current) {
                return
            }

            if (!this.myRef.current.contains(event.target)) {
                this.setState({dropdown_hidden: true})

                // Hide menu icons
                this.props.set_dropdownOpen(false)
                this.props.set_optionOpacity(0)
            }
        }

        let rename_handler = (event) => {
            if(!this.renameRef.current) {
                return
            }

            if (!this.renameRef.current.contains(event.target)) {
                this.setState({dropdown_rename: true})
                this.update_name()

                // Hide menu icons
                this.props.set_dropdownOpen(false)
                this.props.set_optionOpacity(0)
            }
        }

        document.addEventListener("mousedown", handler)
        document.addEventListener("mousedown", rename_handler)

        return () => {
            document.removeEventListener("mousedown", handler)
            document.removeEventListener("mousedown", rename_handler)
        }
    }

    handle_change = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    shouldBlur = (e) => {
        if (e.keyCode === 13) {
            this.setState({dropdown_rename: true})
            this.update_name()

            // Hide menu icons
            this.props.set_dropdownOpen(false)
            this.props.set_optionOpacity(0)
        }
    }

    // Call redux action to rename the page title (patch request)
    update_name = () => {
        let name = this.props.page_name

        if (!name) {
            name = "Untitled"
            this.props.handle_change(this.props.page_id, "Untitled")
        }

        this.props.edit_page_name(this.props.page_id, name)
    }

    delete_page = () => {

        // Hide menu elipse icon
        this.props.set_dropdownOpen(false)
        this.props.set_optionOpacity(0)
        
        // Get number of pages that have no parent
        let page_count = 0

        for (const page of this.props.pages) {
            if (!page.parent) page_count ++
        }

        if (page_count === 1 && !this.props.parent) {
            alert("You have to have at least one page")
            this.setState({modal_hidden: true})

            return
        }

        this.props.delete_page(this.props.page_id)
        this.setState({modal_hidden: true})
        this.props.delete_page_menu(this.props.page_id)

        this.setState({redirect_page: this.props.pages[0].id})
    }

    render() {
        if (this.state.redirect_page) {
            const address = `/${this.state.redirect_page}`
            return <Redirect to={address} />
        }
        return (
            <div className="dropdown"> {/* Needed to overwrite position: relative */}
                <div className="dropdown_parent">
                    <i className="fas fa-ellipsis-h page-option" 
                        onClick={() => {
                            this.setState({dropdown_hidden: false});
                            this.props.set_dropdownOpen(true);
                        }}>
                    </i>
                    <i className="fas fa-plus" onClick={() => 
                        this.props.add_page(this.props.page_id, this.props.depth + 1)}>
                    </i>
                </div>

                {/* Dropdown content */}
                {this.state.dropdown_hidden === false?
                    <div className="dropdown-content" ref={this.myRef}>
                        <a className="edit-drpdn" onClick={() => 
                            this.setState({dropdown_hidden: true, dropdown_rename: false})}>
                            <i className="far fa-edit"></i>
                            Rename
                        </a>
                        <a onClick={() => this.setState({dropdown_hidden: true, modal_hidden: false})}>
                            <i className="far fa-trash-alt"></i>
                            Delete
                        </a>
                    </div>: null}
                
                {/* Rename page dropdown */}
                {this.state.dropdown_rename === false?
                    <div className="rename" ref={this.renameRef}>
                        <a>
                            <input name="page_name" autoFocus onChange={() => { 
                                this.props.handle_change(this.props.page_id, event.target.value); 
                                this.props.edit_name_onChange(event.target.value, this.props.page_id);
                            }} 
                            placeholder="Untitled" value={this.props.page_name} onKeyDown={this.shouldBlur} />
                        </a>
                    </div>: null}
                
                {/* Delete confirmation modal */}
                {this.state.modal_hidden === false? <div className="semi-transparent-bg">
                    <div className="modal">
                        <p>Are you sure you want to delete this page?</p>
                        <button className="delete-btn" onClick={this.delete_page}>Delete</button>
                        <button className="cancel-btn" onClick={() => this.setState({modal_hidden: true})}>Cancel</button>
                    </div>
                </div>: null}
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return { pages: state.pages }
}

export default connect(mapStateToProps, {edit_page_name, edit_name_onChange, delete_page})(MenuDropdown)