import React, { Component } from "react";
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'; 

import Menu from "./menu/menu"
import Main from "./body_content/main"
import { fetch_pages } from "../../actions"
import { get_user_data, logout } from "../../actions/LogIn_out_register"
import Loader from "./loader";

class Home extends Component {
    state = {
        isLoaded: false,
        isLoggedIn: false,
        menu_shown: true,
        hide_menu_animation: 0,
        show_menu_animation: 0,
        marginLeft: "235px",
    }

    async componentDidMount() {

        // Check if user is logged in (by seeing if there is a token in local storage)
        if (localStorage.getItem('token') !== null) {

            try {
                await this.props.get_user_data()
            } catch {

                // If token is wrong then return back to login and clear token from localstorage
                localStorage.setItem('token', "")
                this.setState({ isLoaded: true })
                return
            }

            this.setState({isLoggedIn: true})
        }

        // Fetch the pages
        this.props.fetch_pages(this.props.current_user.id)
        .then(() => {

            // Update state
            this.setState({isLoaded: true})
        });
    }

    logout = () => {
        // Change state to false so that we redirect to log in page.
        this.setState({isLoggedIn: false})

        // Call logout redux action
        this.props.logout()
    }

    toggle_menu = (status) => {
        this.setState({menu_shown: status })
    }

    close_menu_animation = () => {
        this.setState({hide_menu_animation: 1})
    }

    open_menu_animation = () => {
        this.setState({show_menu_animation: 1})
    }

    render() {
        if (this.state.isLoaded === false) {
            return (
                <Loader />
            )
        } else {
            if (this.state.isLoggedIn === false) {
                return <Redirect to="/login" />
            } else if (this.props.computedMatch.isExact === true) {
                const address = `/${this.props.pages[0].id}`
                return <Redirect to={address} />
            }
            return (
                <Router>
                    <div className="home-page">
                        {this.state.menu_shown &&
                            <div 
                                className="menu" 
                                hide_menu_animation={this.state.hide_menu_animation}
                                show_menu_animation={this.state.show_menu_animation}
                                onAnimationEnd={(e) => {
                                    this.setState({ hide_menu_animation: 0, show_menu_animation: 0 });
                                    
                                    if (e.animationName === "hide-menu") 
                                        this.setState({ menu_shown: false, marginLeft: 0 });
                                    else this.setState({ marginLeft: "235px" });
                                }}
                            >
                                    <Menu 
                                        pages={this.props.pages}
                                        close_menu_animation={this.close_menu_animation}
                                        logout={this.logout} />
                            </div>}
                        
                        <div 
                            className="body" 
                            style={{ marginLeft: this.state.marginLeft }}
                            hide_menu_animation={this.state.hide_menu_animation}
                            show_menu_animation={this.state.show_menu_animation} 
                        >
                            <Route path="/:page_id" 
                                render={(props) => (
                                    <Main {...props} 
                                        menu_shown={this.state.menu_shown} 
                                        toggle_menu={this.toggle_menu}
                                        open_menu_animation={this.open_menu_animation}  />
                                )} />
                        </div>
                    </div>
                </Router>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return { pages: state.pages, current_user: state.current_user }
}

export default connect(mapStateToProps, {
    fetch_pages,
    get_user_data,
    logout
})(Home);