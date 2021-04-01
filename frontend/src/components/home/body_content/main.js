// General React and Redux
import React, { Component } from "react";
import { connect } from 'react-redux';

// Dropdowns
import Dropdown from './dropdowns/dropdown';

// Redux Actions
import { select_page, create_element, edit_H1, edit_H2, edit_text, change_order, 
change_order_patchReq, get_breadcrumb } from "../../../actions";

// React DND
import { DragDropContext } from 'react-beautiful-dnd';

// Other
import Loader from '../../home/loader'
import CoverPhoto from './cover_photo/cover_photo'
import Column from './column';
import Templates from "./templates";

class Main extends Component {
    state = {
        isLoaded: false,
        not_found: true,
        option_opacity: 0, 
        isMenuOpen: false,
        page_elements: {},
        templates_modal: false,
    }

    componentDidMount() { 

        // Fetch the selected page
        this.props.select_page(this.props.match.params.page_id)
        .then(() => {

            // Check if page id in URL actually exists
            if (this.props.selected_page === "page not found") {

                this.setState({not_found: true, isLoaded: true})
                return
            }

            // Check if the current user is the creator of the page. If not they should not be able to view it.
            if (this.props.selected_page.creator !== this.props.current_user.id) {
                
                this.setState({not_found: true, isLoaded: true})
                return
            }

            // Get page breadcrumb
            this.props.get_breadcrumb(this.props.selected_page, this.props.pages)

            // Update state
            this.setState({isLoaded: true, not_found: false})
        });
    };

    componentDidUpdate(prevProps) {

        if (this.props.match.params.page_id !== prevProps.match.params.page_id) {

            // Set isLoaded to false by default
            this.setState({isLoaded: false})
            
            this.componentDidMount();
        }
    }

    onDragEnd = async result => {

        // If no destination then return
        if (!result.destination) return

        const { source, destination } = result

        // Get the source column
        const source_groupNum = parseInt(source.droppableId.charAt(0))
        const source_colNum = parseInt(source.droppableId.charAt(1))

        const sourceColumn = this.props.selected_page.page_elements[source_groupNum][source_colNum]

        // Get the destination column
        const dest_groupNum = parseInt(destination.droppableId.charAt(0))
        const dest_colNum = parseInt(destination.droppableId.charAt(1))

        const destColumn = this.props.selected_page.page_elements[dest_groupNum][dest_colNum]

        // Calculate new order
        let new_order = 1

        // If we are moving the element to another group
        if (source.droppableId !== destination.droppableId) {

            // Don't allow movement if the element is being moved from a column with 1 element to a column with 
            // no elements
            if (source_groupNum === dest_groupNum) {
                if (sourceColumn.length === 1 && destColumn.length === 0) return
            }

            // If there are no elements in the group keep new_order at 1 but if not then calculate the new_order
            if (destColumn.length > 0) {

                // If we're trying to move a card to index 0 of the array
                if(destination.index === 0) {
                    new_order = (0 + destColumn[0].order_on_page)/2

                // Else if we are trying to move an element to the last index of the array
                } else if (destination.index === destColumn.length) {
                    new_order = destColumn[destination.index - 1].order_on_page + 1
                
                // Else, we are trying to move it to the middle
                } else {
                    new_order = (destColumn[destination.index - 1].order_on_page + 
                    destColumn[destination.index].order_on_page)/2
                }
            }
        // Else... if we are moving the element to a different position in the same group
        } else {

            if (source.index > destination.index) {
                if (destination.index === 0) {
                    new_order = (0 + destColumn[destination.index].order_on_page)/2
                } else {
                    new_order = (destColumn[destination.index - 1].order_on_page + 
                                destColumn[destination.index].order_on_page)/2
                }
            } else {
                if (destination.index === destColumn.length - 1) {
                    new_order = destColumn[destination.index].order_on_page + 1
                } else {
                    new_order = (destColumn[destination.index + 1].order_on_page + 
                                destColumn[destination.index].order_on_page)/2
                }
            }
        }
        
        // Call redux action to update state
        await this.props.change_order(source, destination, new_order, result.draggableId)

        // Call redux action for a patch request
        await this.props.change_order_patchReq(this.props.selected_page.page_elements, this.props.selected_page)
    }

    // Shows the options beside each element (i.e create new element, delete element, move element)
    show_options = () => {
        this.setState({option_opacity: 100})
    }

    // Hides the options
    hide_options = () => {
        if (this.state.isMenuOpen === false) {
            this.setState({option_opacity: 0})
        }
    }

    // Keeps the options on the screen regardless if the user hovers away (only when the dropdown is open)
    open_menu = () => {
        if (this.state.isMenuOpen === true) {
            this.setState({isMenuOpen: false})
        } else {
            this.setState({isMenuOpen: true})
        }
    }

    // Update database after element is deleted
    update_database = () => {
        this.props.change_order_patchReq(this.props.selected_page.page_elements, this.props.selected_page);
    }

    // Close template modal
    close_template_modal = () => {
        this.setState({ templates_modal: false })
    }

    // Toggle page loading
    isLoaded = (status) => {
        this.setState({ isLoaded: status })
    }

    render() {
        if (this.state.isLoaded === false) {
            return <Loader />
        } else if (this.state.not_found === true || !this.props.selected_page) {
            return <div><h3>Page not found!</h3></div>
        } else {
            return (
                <div className="body-container">
                    {/* Body header */}
                    <div className="body-header">
                        {!this.props.menu_shown && 
                            <div className="show-menu-btn" onClick={() => {
                                this.props.toggle_menu(true);
                                this.props.open_menu_animation();
                            }}>
                                <i className="fas fa-bars"></i>
                            </div>}

                        {this.props.breadcrumb.map((page, count) => {
                            return (
                                <div className="page-link" key={page.id}>
                                    {count === 0? null: <p className="slash"> / </p>}
                                    <a href={`#/${page.id}`}>{page.name}</a>
                                </div>)
                        })}
                    </div>
                    
                    {/* Placeholder div to push body content down 45px to make room for breadcumb header */}
                    <div style={{ height: "45px" }} />
                    
                    {/* Cover photo */}
                    <CoverPhoto page={this.props.selected_page} />
                    
                    {/* Body content */}
                    <div className="body-content">

                        {/* Page title */}
                        <div className="page_title" onMouseEnter={() => this.show_options()} 
                        onMouseLeave={() => this.hide_options()}>
                            <Dropdown 
                                create_element={this.props.create_element}
                                page={this.props.selected_page}
                                order_on_page={0}
                                index={-1}
                                option_opacity={this.state.option_opacity}
                                hide_options={this.hide_options}
                                open_menu={this.open_menu}
                                openDropdownCount={this.state.openDropdownCount}
                                column_elements={this.props.selected_page.page_elements[0][0]}
                                element={{ group: 0, column: 0 }} />

                            <h1 className="inline">{this.props.selected_page.name}</h1>
                        </div>

                        {/* Templates */}
                        {this.props.selected_page.page_elements[0][0].length === 0 && 
                            <div className="empty-page-text">
                                <div>
                                    Hover over the page title and click the plus sign to add elements to the page.
                                </div>

                                <div>
                                    You can also choose a page layout from one of our pre-designed 
                                    <a onClick={() => this.setState({ templates_modal: true })}>
                                        <i className="fas fa-shapes"></i>
                                        templates.
                                    </a>
                                </div>
                            </div>
                        }

                        {this.state.templates_modal === true && 
                                <Templates 
                                    page={this.props.selected_page}
                                    close_template_modal={this.close_template_modal}
                                    isLoaded={this.isLoaded} />
                        }

                        {/* Columns */}
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            {[...Array(this.props.selected_page.page_elements.length).keys()].map((group_index) => {
                                
                                return (
                                    <div className="group" key={group_index}>
                                        {/* Column 0 */}
                                        <Column
                                            key={`${group_index}0`}
                                            group_index={group_index}
                                            selected_page={this.props.selected_page}
                                            edit_H1={this.props.edit_H1}
                                            edit_H2={this.props.edit_H2}
                                            edit_text={this.props.edit_text}
                                            create_element_func={this.props.create_element}
                                            column_elements={this.props.selected_page.page_elements[group_index][0]}
                                            col_num={0} 
                                            update_database={this.update_database} />

                                        {/* Column 1 */}
                                        {this.props.selected_page.page_elements[group_index][0].length > 0?
                                        <Column
                                            key={`${group_index}1`}
                                            group_index={group_index}
                                            selected_page={this.props.selected_page}
                                            edit_H1={this.props.edit_H1}
                                            edit_H2={this.props.edit_H2}
                                            edit_text={this.props.edit_text}
                                            create_element_func={this.props.create_element}
                                            column_elements={this.props.selected_page.page_elements[group_index][1]}
                                            col_num={1}
                                            update_database={this.update_database} />: null}

                                        {/* Column 2 */}
                                        {this.props.selected_page.page_elements[group_index][1].length > 0?
                                        <Column
                                            key={`${group_index}2`}
                                            group_index={group_index}
                                            selected_page={this.props.selected_page}
                                            edit_H1={this.props.edit_H1}
                                            edit_H2={this.props.edit_H2}
                                            edit_text={this.props.edit_text}
                                            create_element_func={this.props.create_element}
                                            column_elements={this.props.selected_page.page_elements[group_index][2]}
                                            col_num={2}
                                            update_database={this.update_database} />: null}
                                    </div>
                                )
                            })}
                        </DragDropContext>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return { 
        selected_page: state.selected_page, 
        pages: state.pages, 
        current_user: state.current_user, 
        breadcrumb: state.breadcrumb
    }
}

export default connect(mapStateToProps, {
    select_page,
    create_element,
    edit_H1,
    edit_H2,
    edit_text,
    change_order,
    change_order_patchReq,
    get_breadcrumb, 
})(Main);