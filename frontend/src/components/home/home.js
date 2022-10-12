import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { connect } from 'react-redux'; 
import Menu from "./menu";
import { fetch_pages } from "../../actions";
import { get_user_data, logout } from "../../actions/LogIn_out_register";
import Loader from "./loader";
import { motion, AnimatePresence } from "framer-motion";

function Home(props) {
    const [state, setState] = useState({  
        isLoaded: false,
        isLoggedIn: false,
        menu_shown: true
    })
    const { pageId } = useParams();

    useEffect(() => {
        componentStart();
    }, []);

    const componentStart = async () => {
        let userResponse;

        // Check if user is logged in (by seeing if there is a token in local storage)
        if (localStorage.getItem('token')) {
            try {
                userResponse = await props.get_user_data()
            } catch {
                // If token is wrong then return back to login and clear token from localstorage
                localStorage.setItem('token', "")
                setState({ ...state, isLoaded: true })
                return
            }
            // Fetch the pages and update state
            await props.fetch_pages(userResponse.id)
            setState({ ...state, isLoaded: true, isLoggedIn: true })
        } else {
            setState({ ...state, isLoaded: true })
        }
    }

    const logout = () => {
        // Change state to false so that we redirect to log in page.
        setState({ ...state, isLoggedIn: false })

        // Call logout redux action
        props.logout()
    }

    const toggle_menu = (status) => {
        setState({ ...state, menu_shown: status })
    }

    if (!state.isLoaded) return <Loader />
    if (!state.isLoggedIn) return <Navigate to="/login" />
    if (!pageId) return <Navigate to={`/${props.pages[0].id}`} />

    return (
        <div className="home-page">
            {/* Menu */}
            <AnimatePresence initial={false}>
                {state.menu_shown &&
                    <motion.div 
                        key="menu"
                        className="motion-div_menu-anim"
                        animate={{ width: screen.width <= 725? "90vw": "240px" }}
                        initial={{ width: "0px" }}
                        exit={{ width: "0px", transition: { duration: 0.4 } }}
                        transition={{ duration: 0.3 }}>
                        <Menu 
                            pages={props.pages}
                            toggle_menu={toggle_menu} 
                            logout={logout} />
                    </motion.div>}
            </AnimatePresence>
            
            {/* Body */}
            <Outlet context={[toggle_menu, state.menu_shown]} />
        </div>
    )
}

const mapStateToProps = (state) => {
    return { pages: state.pages, current_user: state.current_user }
}

export default connect(mapStateToProps, {
    fetch_pages,
    get_user_data,
    logout
})(Home);