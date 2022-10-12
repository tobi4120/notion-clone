import React, { useState } from "react";
import { connect } from 'react-redux';
import { add_page, delete_page } from "../../../actions/page_menu"
import QuickFind from "./quick_find";
import MenuHeader from "./menu_header";
import ListOfPages from "./list_of_pages";
import AddIcon from '@material-ui/icons/Add';

function Menu(props) {
    const [pages, setPages] = useState(props.pages)
    const [quickFindShown, setQuickFindShown] = useState(false)

    // Open or close the page folder
    const openClosePages = (pageID) => {
        let newPages = [...pages]
        const page = findPage(newPages, pageID)
        if (!page) return

        // Open page
        if (page.closed) {
            page.closed = false
        
        // Close page
        } else {
            page.closed = true
            page.children = closePages(page.children)
        }
        setPages(newPages)
    }

    const findPage = (pages, pageID) => {
        for (const page of pages) {
            if (page.id === pageID) return page
            const result = findPage(page.children, pageID)
            if (result) return result
        }
        return null
    }

    const closePages = (pages) => {
        for (const page of pages) {
            page.closed = true
            page.children = closePages(page.children)
        }
        return pages
    }

    // Add a new page
    const addPage = async (parentID, depth) => {

        // Create a new page
        const newPage = await props.add_page(parentID, props.current_user.id)
        newPage.depth = depth

        // Append new page to state
        let newPages = [...pages]
        if (parentID) {
            const parentPage = findPage(newPages, parentID)
            parentPage.children = [...parentPage.children, newPage]
    
            // Open parent page
            if (parentPage.closed) openClosePages(parentID)
        } else {
            newPages = [...newPages, newPage]
        }
        setPages(newPages)
    }

    // Change page name on menu
    const changeNameOnMenu = (pageID, pageName) => {

        // Find page
        let newPages = [...pages]
        const page = findPage(newPages, pageID)

        // Change name and update state
        page.name = pageName
        setPages(newPages)
    }

    // Delete page
    const deletePage = async (pageID, parentID) => {
        
        // Delete from database
        await props.delete_page(pageID) 

        // Update state
        let newPages = [...pages]
        if (parentID) {
            let page = findPage(newPages, parentID)
            page.children = page.children.filter(page => page.id !== pageID)
        } else {
            newPages = newPages.filter(page => page.id !== pageID)
        }
        setPages(newPages)
    }

    return (
        <div className="menu">
            {/* Menu Header */}
            <MenuHeader
                current_user={props.current_user}
                toggle_menu={props.toggle_menu} />

            {/* Quick Find */}
            <div className="search" onClick={() => setQuickFindShown(true)}>
                <i className="fas fa-search"></i>
                <p>Quick Find</p>
            </div>

            {quickFindShown && 
                <QuickFind 
                    pages={props.pages}
                    current_user={props.current_user}
                    setQuickFindShown={setQuickFindShown} />
            } 

            {/* User pages */}
            <div className="pages">
                <ListOfPages 
                    pages={pages}
                    depth={0}
                    parentClosed={false}
                    openClosePages={openClosePages}
                    addPage={addPage}
                    deletePage={deletePage}
                    selected_page={props.selected_page}
                    changeNameOnMenu={changeNameOnMenu}
                    toggle_menu={props.toggle_menu} />

                {/* Add a page */}
                <div className="add-page" onClick={() => addPage(null, 0)}>
                    <AddIcon fontSize="inherit" />
                    <p>Add a page</p>
                </div>
            </div>

            {/* Logout */}
            <div onClick={() => props.logout()} className="logout">
                <i className="fas fa-sign-out-alt"></i>
                <p>Logout</p>
            </div>
        </div>
    )  
}

const mapStateToProps = (state) => {
    return { current_user: state.current_user, selected_page: state.selected_page }
}

export default connect(mapStateToProps, { add_page, delete_page })(Menu);