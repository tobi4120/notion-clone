import React, { Component } from "react";

class Heading_1 extends Component {
    state = {
        heading_1: this.props.page_element.heading_1[0].heading_text
    }

    handle_change = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        if (this.props.page_element.heading_1.length === 0) {
            return null
        }
        return (
            <div className="side-by-side e_container">
                <input 
                    autoComplete="off" 
                    onChange={this.handle_change} 
                    name="heading_1" 
                    className={`user_input heading_1 ${this.props.page_element.color}`}
                    placeholder="Heading 1" 
                    value={this.state.heading_1} autoFocus
                    onBlur={()=> this.props.edit_H1(this.props.page_element.heading_1[0].id, this.state.heading_1)} 
                    style={{ opacity: this.props.snapshot.isDragging? '0.5': '1' }}/>
            </div>
        )
    }
}

export default Heading_1