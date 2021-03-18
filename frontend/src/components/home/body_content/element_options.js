import React from "react";
import Dropdown from './dropdowns/dropdown';
import Element_dropdown from "./dropdowns/element_dropdown";

class Element_options extends React.Component {
    state = {
        option_opacity: 0,
        isMenuOpen: false,
    }

    show_options = () => {
        this.setState({option_opacity: 100})
    }

    hide_options = () => {
        if (this.state.isMenuOpen === false) {
            this.setState({option_opacity: 0})
        }
    }

    open_menu = () => {
        if (this.state.isMenuOpen === true) {
            this.setState({isMenuOpen: false})
        } else {
            this.setState({isMenuOpen: true})
        }
    }

    render() {
        return (
            <div className="element-options"
                onMouseEnter={() => this.show_options()}
                onMouseLeave={() => this.hide_options()}>
                        
                <Dropdown 
                    create_element={this.props.create_element_func}
                    page={this.props.selected_page}
                    order_on_page={this.props.order_on_page}
                    index={this.props.index}
                    option_opacity={this.state.option_opacity}
                    hide_options={this.hide_options}
                    open_menu={this.open_menu}
                    column_elements={this.props.column_elements}
                    element={this.props.element} />
                
                <Element_dropdown 
                    element={this.props.element}
                    option_opacity={this.state.option_opacity}
                    hide_options={this.hide_options}
                    open_menu={this.open_menu}
                    update_database={this.props.update_database} />
            </div>
        )
    }
}
export default Element_options