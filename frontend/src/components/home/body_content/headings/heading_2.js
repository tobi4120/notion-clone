import React, { Component } from "react";

class Heading_2 extends Component {
    state = {
        heading_2: this.props.page_element.heading_2[0].heading_text
    }

    handle_change = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        if (this.props.page_element.heading_2.length === 0) {
            return null
        }
        return (
            <div className="side-by-side e_container">

                <input 
                    autoComplete="off" 
                    onChange={this.handle_change} 
                    name="heading_2" 
                    className={`user_input heading_2 ${this.props.page_element.color}`} 
                    autoFocus 
                    placeholder="Heading 2" 
                    value={this.state.heading_2} 
                    onBlur={()=> this.props.edit_H2(this.props.page_element.heading_2[0].id, this.state.heading_2)} 
                    style={{
                        opacity: this.props.snapshot.isDragging? '0.5': '1'
                    }}/>
            </div>
        )
    }
}

export default Heading_2