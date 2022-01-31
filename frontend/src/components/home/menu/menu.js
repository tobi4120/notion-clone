import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { add_page } from "../../../actions/page_menu"
import PageNav from "./page-nav";
import QuickFind from "./quick_find";

function Menu(props) {
    const [ state, setState ] = useState({
        page_list: [],
        quick_find_open: false, 
    })

    useEffect(() => {
        get_pages(props.pages)
    }, [])

    // This function will put all the nested pages into an array which can be easily rendered
    const get_pages = (pages) => {

        // Loop through each page
        pages.map(page => {

            // Only get the pages whose parent is null (since we have duplicates in Django REST Framework)
            if (page.parent === null) {

                // Create an object and store the page inside it
                let page_object = {"id": page.id, "name": page.name, "depth": 0, "parent": page.parent, "closed": true, 
                "children": page.children}

                // Store the page object in an array called page_list
                setState(prevState => ({
                    page_list: [...prevState.page_list, page_object]
                }))

                // Run the recursion function to get all the nested pages, the 1 is used to keep track of the object depth
                if (page.children.length > 0) {
                    recursion(page.children, 1)
                }
            }
        })
    }

    const recursion = (arr, d) => {
        
        // Loop through each page
        arr.map(a => {

            // Create an object and store the page inside it
            let page_object = {"id": a.id, "name": a.name, "depth": d, "parent": a.parent, "closed": true, "children": a.children}

            // Store the page in the page_list array
            setState(prevState => ({
                page_list: [...prevState.page_list, page_object]
            }))

            // If the page has children, re-run the recursion function but increase d by 1 (d is used to track the depth)
            if (a['children'].length > 0) {
                recursion(a['children'], d + 1)
            }
        })
    }  

    // This function displays all the child pages when you click on the parent page or closes it if already open
    const open_close_page_folder = (page_id) => {
        let index = state.page_list.findIndex(x => x.id === page_id)

        let page_list = state.page_list

        // If page is open close it, else open it
        if (page_list[index]['closed'] === false) {
            page_list[index]['closed'] = true

            // Recursion function to close child pages
            recursion_close(page_list[index]['children'])

        } else {
            page_list[index]['closed'] = false
        }

        setState(prevState => ({ ...prevState, page_list: page_list }))
    }

    const recursion_close = (pages) => {
        pages.forEach(page => {

            // Copy state.page_list
            let page_list = [...state.page_list]

            // Find correct page index
            let index = page_list.findIndex(x => x.id === page['id'])

            // Update page to closed
            page_list[index]['closed'] = true

            // Update state
            setState(prevState => ({ ...prevState, page_list: page_list }))

            // Repeat process if page has children
            if (page['children'].length > 0) {
                recursion_close(page['children'])
            }
        });
    }

    // This function adds a new page
    const add_page = async (parent, depth) => {

        // Redux action to create a new page (post request)
        const response = await props.add_page(parent, props.current_user.id)

        // Copy page list
        let page_list = [...state.page_list]

        let index = state.page_list.length - 1

        // Get the index of the last page of the parent's children pages so we can append the new page after it
        if (parent) {
            const parent_index = page_list.findIndex(x => x.id === parent)
            const parent_page = page_list[parent_index]

            index = parent_index

            if (parent_page.children.length !== 0) {
                index = page_list.findIndex(x => x.id === parent_page.children[parent_page.children.length - 1].id)
            }

            // Set the parent page to 'open'
            page_list[parent_index]['closed'] = false
        }

        // Create new page
        const new_page = {id: response.id, name: "Untitled", depth: depth, parent: parent, closed: true, children: []}

        // Append new page to the children array of the parent if it has a parent
        if (parent) {
            const parent_index = page_list.findIndex(x => x.id === parent)
            page_list[parent_index].children.push(new_page)
        }

        // Add page to page_list and update state
        page_list.splice(index + 1, 0, new_page)
        setState(prevState => ({ ...prevState, page_list: page_list }))
    }

    // Handle change
    const handle_change = (page_id, page_name) => {

        // Find page
        const index = state.page_list.findIndex(x => x.id === page_id)

        // Copy pages
        const new_pages = [...state.page_list]

        // Change page name
        new_pages[index].name = page_name

        setState(prevState => ({ ...prevState, page_list: new_pages }))
    }

    // Delete page
    const delete_page = async (page_id) => {

        // Find page index
        const index = state.page_list.findIndex(x => x.id === page_id)

        // Find all the child pages in the page_list and delete them
        await recursion_delete(state.page_list[index].children)

        let new_pages = [...state.page_list]
        
        // Clear the child pages field from the page (so page[children] = [])
        if (state.page_list[index].parent) {
            const parent_index = state.page_list.findIndex(x => x.id === state.page_list[index].parent)
            const child_pages = state.page_list[parent_index].children.filter(page => page.id !== page_id);

            new_pages[parent_index].children = child_pages
        }

        // Delete from page_list
        new_pages = new_pages.filter(page => page.id !== page_id);
        setState(prevState => ({ ...prevState, page_list: new_pages }))
    }

    // Recursion delete
    const recursion_delete = (pages) => {
        let page_list = [...state.page_list]

        const recurring_function = (pages) => {
            pages.forEach(page => {

                // Delete page from list
                let new_pages = page_list.filter(x => x.id !== page.id)
    
                // Update page_list
                page_list = new_pages
    
                // Repeat process if page has children
                if (page['children'].length > 0) {
                    recurring_function(page['children'])
                } 
            });
        }
        
        recurring_function(pages)

        // Update state
        setState(prevState => ({ ...prevState, page_list: page_list }))
    }

    const close_modal = () => {
        setState(prevState => ({ ...prevState, quick_find_open: false }))
    }

    return (
        <div className="menu_body">
            {/* Menu Header */}
            <div className="menu-header">
                <div className="user-icon">
                    {props.current_user.first_name.charAt(0)}
                </div>
                <div className="user-first-name">
                    <p>{props.current_user.first_name.charAt(0).toUpperCase()}
                        {props.current_user.first_name.substring(1)}'s Notion </p> 
                </div>
                <div className="arrows" onClick={() => props.close_menu_animation()}>
                    <div className="arrow-left"></div>
                    <div className="arrow-left"></div>
                </div>
            </div>

            {/* Quick Find */}
            <div className="search" onClick={() => setState(prevState => ({ ...prevState, quick_find_open: true }))}>
                <i className="fas fa-search"></i>
                <p>Quick Find</p>
            </div>

            {state.quick_find_open && 
                <QuickFind 
                    pages={props.pages}
                    current_user={props.current_user}
                    close_modal={close_modal} />
            } 

            {/* User pages */}
            <div className="pages">
                {state.page_list.map(page => {
                    const parent_index = state.page_list.findIndex(x => x.id === page.parent)

                    let is_parent_closed = false
                    
                    if (parent_index !== -1) {
                        is_parent_closed = state.page_list[parent_index]['closed']
                    }

                    if (is_parent_closed === false) {

                        return (
                            <div key={page.id}>
                                <PageNav
                                    page_id={page.id} 
                                    name={page.name}
                                    depth={page.depth}
                                    parent={page.parent}
                                    closed={page.closed}
                                    open_close_page_folder={open_close_page_folder}
                                    add_page={add_page}
                                    handle_change={handle_change}
                                    delete_page_menu={delete_page}
                                    selected_page={props.selected_page} />
                            </div>
                        )
                    }
                })}

                {/* Add a page */}
                <div className="add-page" onClick={() => add_page(null, 0)}>
                    <i className="fas fa-plus"></i>
                    <p>Add a page</p>
                </div>

                {/* Logout */}
                
                <div onClick={() => props.logout()} className="logout">
                    <i className="fas fa-sign-out-alt"></i>
                    <p>Logout</p>
                </div>
            </div>
        </div>
    )  
}

const mapStateToProps = (state) => {
    return { current_user: state.current_user, selected_page: state.selected_page }
}

export default connect(mapStateToProps, {add_page})(Menu);