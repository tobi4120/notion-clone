import React, { useState } from "react";
import { Draggable } from 'react-beautiful-dnd';
import TextareaAutosize from 'react-textarea-autosize';

function KanbanCard(props) {
    // State
    const [CardDescription, set_CardDescription] = useState(props.description);
    const [editCard, set_editCard] = useState(false);

    // Handle change
    const handleChange = (e) => set_CardDescription(e.target.value);

    return (
        <Draggable draggableId={`${props.card_id}`} index={props.index}>
            {provided => (
                <div className="kanban_card" {...provided.draggableProps} {...provided.dragHandleProps}
                ref={provided.innerRef}>
                    {editCard? <TextareaAutosize 
                        style={{ overflow: 'hidden' }}
                        autoComplete="off"
                        className="user_input card_name" 
                        autoFocus 
                        placeholder="Untitled" 
                        onChange={handleChange} 
                        onBlur={() => { 
                            props.edit_card(props.card_id, CardDescription, props.kanban_id); 
                            set_editCard(false)
                        }}
                        resize="none" rows={1} wrap="soft"
                        value={CardDescription} />: 
                        
                    <div className="card_name" style={{ cursor: 'pointer' }} 
                        onClick={() => set_editCard(true)}>
                        {CardDescription? CardDescription: <p className="untitled">Untitled</p>}
                    </div>
                    }

                    <p className="close-card" onClick={() => 
                        props.delete_card(props.card_id, props.group_id, props.kanban_id)}>
                        &times;
                    </p>
                </div>
            )}
        </Draggable>
    )
}
export default KanbanCard