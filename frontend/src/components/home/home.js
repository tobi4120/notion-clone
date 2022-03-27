import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'; 

import Menu from "./menu/menu"
import Main from "./body_content/main"
import { fetch_pages } from "../../actions"
import { get_user_data, logout } from "../../actions/LogIn_out_register"
import Loader from "./loader";

function Home(props) {
    const [state, setState] = useState({  
        isLoaded: false,
        isLoggedIn: false,
        menu_shown: true,
        hide_menu_animation: 0,
        show_menu_animation: 0,
        marginLeft: "235px" 
    })

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
            // Fetch the pages
            await props.fetch_pages(userResponse.id)

            // Update state
            setState({ ...state, isLoaded: true, isLoggedIn: true })
        } else {
            // Update state
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

    const close_menu_animation = () => {
        setState(prevState => ({ ...prevState, hide_menu_animation: 1 }))
    }

    const open_menu_animation = () => {
        setState(prevState => ({ ...prevState, show_menu_animation: 1 }))
    }

    if (!state.isLoaded) return <Loader />

    if (!state.isLoggedIn) return <Redirect to="/login" />
    
    if (props.computedMatch.isExact) {
        const address = `/${props.pages[0].id}`
        return <Redirect to={address} />
    }

    return (
        <Router>
            <div className="home-page">
                {state.menu_shown &&
                    <div 
                        className="menu" 
                        hide_menu_animation={state.hide_menu_animation}
                        show_menu_animation={state.show_menu_animation}
                        onAnimationEnd={(e) => {
                            if (e.animationName === "hide-menu") 
                                setState({ ...state, 
                                            menu_shown: false, 
                                            marginLeft: 0, 
                                            hide_menu_animation: 0, 
                                            show_menu_animation: 0 
                                        });
                            else setState({ ...state, 
                                            marginLeft: "235px",
                                            hide_menu_animation: 0, 
                                            show_menu_animation: 0
                                        });
                        }}
                    >
                        <Menu 
                            pages={props.pages}
                            close_menu_animation={close_menu_animation}
                            logout={logout} />
                    </div>}
                
                <div 
                    className="body" 
                    style={{ marginLeft: state.marginLeft }}
                    hide_menu_animation={state.hide_menu_animation}
                    show_menu_animation={state.show_menu_animation} 
                >
                    <Route path="/:page_id" 
                        render={(props) => (
                            <Main {...props} 
                                menu_shown={state.menu_shown} 
                                toggle_menu={toggle_menu}
                                open_menu_animation={open_menu_animation}  />
                        )} />
                </div>
            </div>
        </Router>
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