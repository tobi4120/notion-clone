import React, { Component } from "react";
import TextareaAutosize from 'react-textarea-autosize';

class Text extends Component {
    state = {
        text: this.props.page_element.text[0].text,
    }

    handle_change = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div className={`text-element ${this.props.page_element.color}`}>
                <TextareaAutosize autoComplete="off" name="text" onChange={this.handle_change} value={this.state.text} 
                placeholder="Type your text here..." autoFocus className="text"
                onBlur={()=> this.props.edit_text(this.props.page_element.text[0].id, this.state.text)} 
                style={{ opacity: this.props.snapshot.isDragging? '0.5': '1' }} />
            </div>
        )
    }
}

export default Text