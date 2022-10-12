// General React and Redux
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

// Redux
import { select_page, get_breadcrumb } from "../../../actions";

// Componenets
import Loader from '../loader'
import CoverPhoto from './cover_photo'
import PageElements from './page_elements';
import Templates from "./templates";
import CreateElement_dropdown from './dropdowns/element_menu/createElement_dropdown';
import BodyHeader from "./body_header";

// React Router
import { useParams, useOutletContext } from 'react-router-dom';

const Body = (props) => {
    const [state, setState] = useState({
        isLoaded: false,
        not_found: false,
        page_elements: {},
    });
    const { pageId } = useParams();

    // Redux
    const dispatch = useDispatch();
    const selected_page = useSelector(state => state.selected_page);
    const pages = useSelector(state => state.pages);
    const current_user = useSelector(state => state.current_user);
    const breadcrumb = useSelector(state => state.breadcrumb);

    // Component props from Home
    const [toggle_menu, menu_shown] = useOutletContext();

    useEffect(() => {
        const componentStart = async () => {
            setState({ ...state, isLoaded: false})

            // Fetch the selected page
            const pageResponse = await dispatch(select_page(pageId));

            // Check if page id in URL actually exists and the page was created by the current user
            if (!pageResponse || pageResponse === "page not found" || pageResponse.creator !== current_user.id) {
                setState({ ...state, isLoaded: true, not_found: true })
                return
            }
            
            // Get page breadcrumb
            dispatch(get_breadcrumb(pageResponse, pages));

            // Update state
            setState({ ...state, isLoaded: true })
        }
        componentStart();
    }, [pageId])

    // Toggle page loading
    const isLoaded = (status) => {
        setState({ ...state, isLoaded: status })
    }

    if (!state.isLoaded) return <Loader />
    if (state.not_found) return <div><h3>Page not found!</h3></div>
    
    return (
        <div className="body">
            <BodyHeader 
                menu_shown={menu_shown}
                toggle_menu={toggle_menu}
                breadcrumb={breadcrumb} />

            <div className="body-scroller" style={{ overflow: menu_shown? screen.width <= 350? "hidden": "scroll": "scroll" }}>
                <CoverPhoto page={selected_page} />

                <div className="body-content">
                    {/* Page title */}
                    <div className="page_title">
                        <div className="element-options">
                            <CreateElement_dropdown
                                page={selected_page}
                                order_on_page={0}
                                index={-1}
                                openDropdownCount={state.openDropdownCount}
                                column_elements={selected_page.page_elements}
                                element={0} />
                        </div>

                        <h1 className="inline">{selected_page.name}</h1>
                    </div>
                    
                    {selected_page.page_elements.length === 0 && 
                        <Templates
                            page={selected_page}
                            isLoaded={isLoaded} />
                    }
                    <PageElements selected_page={selected_page} />
                </div>
            </div>
        </div>
    )
}
export default Body;