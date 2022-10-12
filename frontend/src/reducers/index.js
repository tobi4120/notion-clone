import { combineReducers } from 'redux';
import { kanbansReducer } from './kanban';
import { tablesReducer } from './table';

const curent_userReducer = (current_user={}, action) => {
    switch (action.type) {
        case "GET_USER_DATA":
            return action.payload.data;
            
        case "LOGOUT":
            return {};
    
        default:
            return current_user;
    }
};

const pageReducer = (pages=[], action) => {
    switch (action.type) {
        case "FETCH_PAGES":
            return action.payload;

        case "ADD_PAGE":
            // Copy pages
            let new_pages = [...pages]   
            
            // Append to pages
            new_pages = [...pages, action.payload]

            return new_pages
        
        case "EDIT_PAGE_NAME":
            const index = pages.findIndex(x => x.id === action.payload.id)
            
            // Copy pages
            new_pages = [...pages]

            // Change page name
            new_pages[index].name = action.payload.name

            return new_pages
        
        case "DELETE_PAGE":
            new_pages = pages.filter(page => page.id !== action.payload);

            return new_pages

        default:
            return pages;
    }
};

const selectPageReducer = (page=null, action) => {
    switch (action.type) {
        case "SELECT_PAGE":

            if (action.payload === "page not found") {
                return "page not found"
            }
            return action.payload.data;
        
        case "CREATE_ELEMENT":
            // Copy array elements and insert new element after the current index
            let new_elements = [...page.page_elements]
            let current_index = 0

            // If current index is -1 (meaning we are trying to put the element directly under the page title) keep
            // the current index at -1.
            if (action.payload.current_index !== -1) {
                current_index = action.payload.current_index + 1
            }

            new_elements.splice(current_index, 0, action.payload.data)

            // Update page
            let new_page = {...page, page_elements: new_elements}

            return new_page
        
        case "DELETE_ELEMENT":
            // Copy page
            new_page = {...page}

            // Delete the requested page element
            new_page.page_elements = page.page_elements.filter(element => element.id !== action.payload.id);

            return new_page
        
        case "CHANGE_ORDER":
            const { source, destination, new_order } = action.payload

            // Copy page
            new_page = {...page}

            // Copy array elements
            new_elements = [...page.page_elements]

            // Move element from source to destination and update its order_on_page property
            if (destination) {
                let element = new_elements.splice(source.index, 1)[0]
                element.order_on_page = new_order
                new_elements.splice(destination.index, 0, element)
            }

            // Update page
            new_page = {...new_page, page_elements: new_elements}
            return new_page
        
        case "EDIT_NAME_ON_CHANGE":
            if (action.payload.page_id !== page.id) return page
            
            // Copy page
            new_page = {...page}
            new_page.name = action.payload.page_name
            return new_page

        case "CHANGE_COVER_IMAGE":

            // Update page with the photo selected
            new_page = {...page, photo: action.payload }

            return new_page

        case "CHANGE_BG_COLOR":
            let { element_id, color } = action.payload
            
            // Copy page
            new_page = {...page}

            // Find the page element
            let index = new_page.page_elements.findIndex(x => x.id === element_id)

            // Update the color property
            new_page.page_elements[index].color = color

            return new_page

        default:
            return page
    }
}

const BreadCrumbReducer = (breadcrumb=[], action) => {
    switch (action.type) {
        case "GET_BREADCRUMB":
            return action.payload

        case "EDIT_NAME_ON_CHANGE":
            
            // Copy breadcrumb
            const new_breadcrumb = [...breadcrumb]

            // Change name of page in breadcrumb
            const index = new_breadcrumb.findIndex(x => x.id === action.payload.page_id)

            if (index !== -1) {
                new_breadcrumb[index].name = action.payload.page_name
            }
            return new_breadcrumb

        default:
            return breadcrumb
    }
}

export default combineReducers({
    pages: pageReducer,
    selected_page: selectPageReducer,
    current_user: curent_userReducer,
    breadcrumb: BreadCrumbReducer,
    kanbans: kanbansReducer,
    tables: tablesReducer,
});