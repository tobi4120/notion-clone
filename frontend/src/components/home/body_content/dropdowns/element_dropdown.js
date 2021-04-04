import React, { Component } from "react";
import { connect } from 'react-redux';
import { delete_element, change_order_patchReq, change_bgColor } from "../../../../actions";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import ColorDropdown_BG from "../dropdowns/color_dropdown-bg";
import DropdownContentPlaceholder from "./dropdown_placeholder";

class Element_dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdown_hidden: true,
            dropdown_parent_class: "dropdown_parent",
            color_dropdown_hidden: true,
            parent_transform: "",
            parent_opacity: 0,
            transform: "",
            opacity: 0,
        }
        this.myRef = React.createRef();
        this.colorRef = React.createRef();
    }

    componentDidMount() {
        // Add event listener to detect when someone clicks away from menu
        let handler = (event) => {
            if (!this.myRef.current) return
            
            if (!this.myRef.current.contains(event.target)) {

                if (event.target.className.baseVal !== "MuiSvgIcon-root") {
                    this.setState({
                        dropdown_hidden: true,
                        dropdown_parent_class: "dropdown_parent"
                    })
                    this.props.open_menu()
                    this.props.hide_options()
                }
            }
        }

        document.addEventListener("mousedown", handler)

        return () => document.removeEventListener("mousedown", handler)
    }

    hide_show_dropdown = () => {
        if (this.state.dropdown_hidden === true) {
            this.setState({
                dropdown_hidden: false,
                dropdown_parent_class: "opacity_1"
            })
        } else {
            this.setState({
                dropdown_hidden: true,
                dropdown_parent_class: "dropdown_parent"
            })
        };
    };

    new_function = async () => {
        await this.props.open_menu();

        if (this.state.dropdown_hidden === false) {
            this.props.hide_options()
        }
    };

    // Parent dropdown positioning
    set_parent_transform = (value) => {
        this.setState({ parent_transform: value })
    }

    set_parent_opacity  = (value) => {
        this.setState({ parent_opacity: value })
    }

    // Dropdown positioning 
    set_transform = (value) => {
        this.setState({ transform: value })
    }

    set_opacity = (value) => {
        this.setState({ opacity: value })
    }

    // Change element background color
    change_bgColor = (color) => {
        this.props.change_bgColor(this.props.element.id, `${color}-bg`, this.props.element.group, 
            this.props.element.column)
    }

    render() {
        return (
            <div className="element-dropdown dropdown">
                <div className={this.state.dropdown_parent_class}>
                    <i className="element-option-icon" onClick={async() => {
                        if (this.props.option_opacity === 0) return
                        await this.new_function(); 
                        this.hide_show_dropdown(); 
                    }} 
                        style={{opacity: this.props.option_opacity}}>
                        <DragIndicatorIcon fontSize="inherit" />
                    </i>
                </div> 
                {this.state.dropdown_hidden === false && 
                    <DropdownContentPlaceholder ref={this.myRef} set_transform={this.set_parent_transform} 
                        set_opacity={this.set_parent_opacity}>

                        <div className="dropdown-content" ref={this.myRef}
                            style={{ transform: this.state.parent_transform, opacity: this.state.parent_opacity }}>
                            <a onClick={async ()=> {
                                await this.props.delete_element(this.props.element);
                                this.props.update_database();
                            }}>
                                <i className="far fa-trash-alt"></i>
                                Delete
                            </a>

                            {this.props.element.element_type !== "Table" && this.props.element.element_type !== "Kanban" &&
                                <div className="element-color dropdown-option" 
                                    onMouseEnter={() => this.setState({ color_dropdown_hidden: false })}
                                    onMouseLeave={() => this.setState({ color_dropdown_hidden: true })}>

                                    <i className="fas fa-paint-roller"></i>
                                    <p>Background</p>
                                    <i className="fas fa-caret-right"></i>

                                    {!this.state.color_dropdown_hidden && 
                                        <DropdownContentPlaceholder ref={this.colorRef} set_transform={this.set_transform} 
                                            set_opacity={this.set_opacity} translate_Y="-77%">

                                            <div className="dropdown-content sub-menu" ref={this.colorRef}
                                                style={{ transform: this.state.transform, opacity: this.state.opacity }}>
                                                <ColorDropdown_BG 
                                                    change_color={this.change_bgColor} 
                                                    selected_color={this.props.element.color} />
                                            </div> 
                                        </DropdownContentPlaceholder>
                                    }
                                </div>
                            }
                        </div>
                    </DropdownContentPlaceholder>
                }
            </div>
        )
    };
};

const mapStateToProps = (state) => {
    return { selected_page: state.selected_page, pages: state.pages.data }
}

export default connect(mapStateToProps, {
    delete_element,
    change_order_patchReq,
    change_bgColor,
})(Element_dropdown);