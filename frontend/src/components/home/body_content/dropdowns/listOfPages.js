import React from "react";
import { connect } from 'react-redux';

class ListOfPages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdown_hidden: false,
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
                this.setState({dropdown_hidden: true})
                this.props.page_list_toggle()
            }
        }
        document.addEventListener("mousedown", handler)

        return () => {
            document.removeEventListener("mousedown", handler)
        }
    }

    render() {
        return (
            <div className="dropdown">
                {this.state.dropdown_hidden === false && 
                    <div className="dropdown-content list-of-pages" ref={this.myRef}>

                        <p>Select a page</p>

                        {this.props.pages.map(page => {
                            return (    
                                <a key={page.id} onClick={() => { 
                                    this.setState({dropdown_hidden: true});
                                    this.props.page_list_toggle();
                                    this.props.create_element(this.props.index, this.props.page.id, "Page_link", 
                                        this.props.order_on_page, this.props.element_above_order, this.props.element, page.id);
                                }}>
                                    <i className="far fa-file-alt"></i>
                                    {page.name}
                                </a>
                            )
                        })}
                    </div>
                }
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return { pages: state.pages}
}

export default connect(mapStateToProps)(ListOfPages)