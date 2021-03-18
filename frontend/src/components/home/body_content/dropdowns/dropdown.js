import React from "react";
import ListOfPages from "./listOfPages";
import AddIcon from '@material-ui/icons/Add';
import DropdownContentPlaceholder from "./dropdown_placeholder";

// Dropdown photos
import text from "./dropdown-images/text.png";
import to_do from "./dropdown-images/to-do.png";
import heading_1 from "./dropdown-images/heading_1.png";
import heading_2 from "./dropdown-images/heading_2.png";
import link_to_page from "./dropdown-images/link-to-page.png";
import table from "./dropdown-images/table.png";
import board from "./dropdown-images/board.png";

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdown_hidden: true,
            listOfPage_open: false,
            transform: "",
            opacity: 0,
        }
        this.myRef = React.createRef();
    }
    
    componentDidMount()  {
        // Add event listener to detect when someone clicks away from menu
        let handler = async (event) => {
            if (!this.myRef.current) {
                return
            }
            
            // Close menu when user clicks away from it 
            if (!this.myRef.current.contains(event.target)) {
                
                if (event.target.className !== "add_element option") {
                    this.hide_dropdown()
                    await this.props.open_menu()
                    this.props.hide_options()
                }
            }
        }
        document.addEventListener("mousedown", handler)

        return () => {
            document.removeEventListener("mousedown", handler)
        }
    }

    hide_dropdown = () => this.setState({ dropdown_hidden: !this.state.dropdown_hidden })

    new_function = async () => {
        await this.props.open_menu();

        if (this.state.dropdown_hidden === false) {
            this.props.hide_options()
        }
    }

    page_list_toggle = () => {
        this.setState({listOfPage_open: false})
    }

    // Function for when a user clicks to create a new item
    click_event = async (element_type, element_above_order) => {
        this.props.create_element(this.props.index, this.props.page.id, element_type, 
        this.props.order_on_page, element_above_order, this.props.element); this.hide_dropdown(); 
        await this.props.open_menu(); this.props.hide_options();
    }

    /// Dropdown positioning 
    set_transform = (value) => {
        this.setState({ transform: value })
    }

    set_opacity = (value) => {
        this.setState({ opacity: value })
    }

    render() {

        // Find the order of the element after the current element
        let element_above_order = null

        if (this.props.index !== (this.props.column_elements.length - 1)) {
            if (this.props.index === -1) {
                element_above_order = 0
            } else {
                element_above_order =this.props.column_elements[this.props.index + 1].order_on_page
            }
        } 
        return (
            <div className="dropdown">
                <div className="dropdown_parent">
                    <span style={{opacity: this.props.option_opacity}} id={this.props.index}
                        onClick={async() => { if (this.props.option_opacity === 0) return 
                            await this.new_function(); this.hide_dropdown();}} 
                        className="add_element"><AddIcon fontSize="inherit" /></span>
                </div>

                {this.state.dropdown_hidden === false && 
                    <DropdownContentPlaceholder ref={this.myRef} set_transform={this.set_transform} 
                        set_opacity={this.set_opacity}>

                    <div className="dropdown-content add-element-drpdn" ref={this.myRef}
                        style={{ transform: this.state.transform, opacity: this.state.opacity }}>
                        <a onClick={async () => this.click_event("Text", element_above_order)}>
                            <img className="drpdn-icon" src={text} alt="text" />
                            <div className="drpdn-text">
                                <p className="drpdn-head">Text</p>
                                <p className="drpdn-sub-head">Just start writing with plain text.</p>
                            </div>
                        </a>

                        <a onClick={async () => this.click_event("To_do", element_above_order)}>
                            <img className="drpdn-icon" src={to_do} alt="to-do" />
                            <div className="drpdn-text">
                                <p className="drpdn-head">To-do list</p>
                                <p className="drpdn-sub-head">Track tasks with a to-do list.</p>
                            </div>
                        </a>

                        <a onClick={async () => this.click_event("Heading_1", element_above_order)}>
                            <img className="drpdn-icon" src={heading_1} alt="heading 1" />
                            <div className="drpdn-text">
                                <p className="drpdn-head">Heading 1</p>
                                <p className="drpdn-sub-head">Big section heading.</p>
                            </div>
                        </a>

                        <a onClick={async () => this.click_event("Heading_2", element_above_order)}>
                            <img className="drpdn-icon" src={heading_2} alt="heading 2" />
                            <div className="drpdn-text">
                                <p className="drpdn-head">Heading 2</p>
                                <p className="drpdn-sub-head">Sub-section heading.</p>
                            </div>
                        </a>

                        <a onClick={async () => { 
                            this.hide_dropdown(); 
                            await this.props.open_menu(); 
                            this.props.hide_options();
                            this.setState({listOfPage_open: true})
                        }}>
                            <img className="drpdn-icon" src={link_to_page} alt="link to page" />
                            <div className="drpdn-text">
                                <p className="drpdn-head">Link to page</p>
                                <p className="drpdn-sub-head">Link to an existing page.</p>
                            </div>
                        </a>

                        <a onClick={async () => this.click_event("Table", element_above_order)}>
                            <img className="drpdn-icon" src={table} alt="table" />
                            <div className="drpdn-text">
                                <p className="drpdn-head">Table</p>
                                <p className="drpdn-sub-head">Create a table.</p>
                            </div>
                        </a>

                        <a onClick={async () => this.click_event("Kanban", element_above_order)}>
                            <img className="drpdn-icon" src={board} alt="board" />
                            <div className="drpdn-text">
                                <p className="drpdn-head">Board</p>
                                <p className="drpdn-sub-head">Create a kanban board.</p>
                            </div>
                        </a>
                    </div>
                    </DropdownContentPlaceholder>
                }

                {this.state.listOfPage_open === true? 
                <ListOfPages 
                    page_list_toggle={this.page_list_toggle}
                    create_element={this.props.create_element}
                    index={this.props.index}
                    page={this.props.page}
                    order_on_page={this.props.order_on_page}
                    element_above_order={element_above_order}
                    element={this.props.element} />: null}
            </div>
        )
    }
};

export default Dropdown