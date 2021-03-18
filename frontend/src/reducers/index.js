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
            let new_page = action.payload.data

            // Split page elements into sections
            let page_elements = []

            {[...Array(new_page.groups).keys()].map((group_index) => {
                const col_0 = []
                const col_1 = []
                const col_2 = []
                
                // Render the elements into three seperate arrays indicating what column they're in
                let columns = [0, 1, 2]
                columns.map(column => {
                    new_page.page_elements.map(page_element => {
        
                        // If element = the group and column then put it in the array
                        if (page_element.column === column && page_element.group === group_index) {

                            if (column === 0) col_0.push(page_element)
                            else if (column === 1) col_1.push(page_element)
                            else col_2.push(page_element)
                        }
                    })
                })
                page_elements.push([col_0, col_1, col_2])
            })}

            // If the column B of the last column is not empty, render another group below
            if (page_elements[page_elements.length - 1][1].length > 0) {
                page_elements.push([[], [], []])

                new_page.groups++
            }

            // Update the page elements and return the new page
            new_page = {...new_page, page_elements: page_elements}
            return new_page;
        
        case "CREATE_ELEMENT":

            // Copy array elements and insert new element after the current index
            let new_elements = [...page.page_elements]
            let current_index = 0
            let group = action.payload.data.group
            let column = action.payload.data.column

            // If current index is -1 (meaning we are trying to put the element directly under the page title) keep
            // the current index at -1.
            if (action.payload.current_index !== -1) {
                current_index = action.payload.current_index + 1
            }

            new_elements[group][column].splice(current_index, 0, action.payload.data)

            // Update page
            new_page = {...page, page_elements: new_elements}

            return new_page
        
        case "DELETE_ELEMENT":
            group = action.payload.group
            column = action.payload.column

            // Copy page
            new_page = {...page}

            // Delete from array
            new_elements = page.page_elements[group][column].filter(element => element.id !== action.payload.id);

            // Update page
            new_page.page_elements[group][column] = new_elements

            return new_page
        
        case "CHANGE_ORDER":
            const { source, destination, new_order } = action.payload

            // Copy page
            new_page = {...page}

            // Copy array elements
            new_elements = [...page.page_elements]

            // Source column
            let source_group = parseInt(source.droppableId.charAt(0))
            let source_column_num = parseInt(source.droppableId.charAt(1))

            let sourceColumn = new_elements[source_group][source_column_num]

            // We have 2 actions that call this type. One is when an element is dragged and dropped and the
            // other is when an element is deleted. The if (destination) statement below is used to say only run 
            //this code if the drag and drop action called this reducer.
            if (destination) {

                // Destination column
                let dest_group = parseInt(destination.droppableId.charAt(0))
                let dest_column_num = parseInt(destination.droppableId.charAt(1))

                let destColumn = new_elements[dest_group][dest_column_num]

                // Move element from source to destination and update the order on page, group, and column 
                // properties
                let element = sourceColumn.splice(source.index, 1)

                element[0].order_on_page = new_order
                element[0].group = dest_group
                element[0].column = dest_column_num

                destColumn.splice(destination.index, 0, ...element)

                // ADD GROUP________________________________________________________________________________
                /* If column B was empty but there's now an element in it, render a new group below         
                but only if there wasn't a group already there. */
                    
                // Check if element was moved into column B and that column B was previously empty
                if (dest_column_num === 1 && destColumn.length === 1) {
                    
                    // Check if there already isn't a group below this one
                    if (new_elements.length === dest_group + 1) {
                                            
                        // If the conditions above are met, render a new group 
                        new_elements = [...new_elements, [[], [], []]]

                        // Increase page columns count
                        new_page.groups++
                    }
                }
            }

            // SLIDING TO THE LEFT________________________________________________________________________
            /* If an element is moving to a column to the right but in doing so, making the source column empty,
            the destination column elements should shift left to the source column */

            if (source_column_num !== 2) {
                if (new_elements[source_group][source_column_num + 1].length > 0 && sourceColumn.length === 0) {
                    
                    // Swap the source column and the column to the right of it
                    let column = new_elements[source_group].splice(source_column_num + 1, 1)
                    new_elements[source_group].splice(source_column_num, 0, ...column)

                    // If second column is empty and third is full, shift third to the second column
                    if (new_elements[source_group][1].length === 0 && new_elements[source_group][2].length > 0) {
                        const third_column = new_elements[source_group].splice(2, 1)
                        new_elements[source_group].splice(1, 0, ...third_column)

                        // Update the group property on each element in the source column
                        for (const element of third_column[0]) {
                            element.column = 1
                        }
                    }

                    // Update the group property on each element in the source column
                    for (const element of column[0]) {
                        element.column = source_column_num
                    }
                }
            } 
            // REMOVE GROUP_____________________________________________________________________________
            
            // If a group is now empty as a result of an element being moved out of it, remove that group
            if (new_elements[source_group][0].length === 0 && new_elements[source_group][1].length === 0 &&
                new_elements[source_group][2].length === 0) {

                    // If column B in group above is not empty, don't remove it
                    if (source_group !== 0) {
                        if (new_elements[source_group - 1][1].length === 0 || source_group !== new_page.groups - 1) {
                            
                            // Remove group
                            new_elements.splice(source_group, 1)

                            // Update the group number for all the page elements
                            new_elements.map((group, index) => {
                                for (const column of group) {
                                    if (column.length > 0) {
                                        for (const element of column) {
                                            element.group = index
                                        }
                                    }
                                }
                            }) 
                            // Decrease page columns count
                            new_page.groups--
                        }
                    } else if (source_group === 0 && new_page.groups > 1) {
                        // Remove group
                        new_elements.splice(source_group, 1)

                        // Update the group number for all the page elements
                        new_elements.map((group, index) => {
                            for (const column of group) {
                                if (column.length > 0) {
                                    for (const element of column) {
                                        element.group = index
                                    }
                                }
                            }
                        }) 
                        // Decrease page columns count
                        new_page.groups--
                    }
                    
                // Else if column B in the source group is now empty and the group below is empty, remove that group
                } else if (source_group !== new_page.groups - 1 && new_elements[source_group][1].length === 0) {
                    if (new_elements[source_group + 1][0].length === 0 && 
                        new_elements[source_group + 1][1].length === 0 &&
                        new_elements[source_group + 1][2].length === 0) {
    
                        // Remove group
                        new_elements.splice(source_group + 1, 1)
    
                        // Decrease page columns count
                        new_page.groups--
                    }   
                }

            // Update page
            new_page = {...new_page, page_elements: new_elements}
            return new_page
        
        case "EDIT_NAME_ON_CHANGE":
            if (action.payload.page_id !== page.id) {
                return page
            }
            
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
            group = action.payload.group
            column = action.payload.column
            
            // Copy page
            new_page = {...page}

            // Find the page element
            let index = new_page.page_elements[group][column].findIndex(x => x.id === element_id)

            // Update the color property
            new_page.page_elements[group][column][index].color = color

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