import React, { useState } from "react";
import GroupDropdown from './groupDropdown';
import KanbanCard from './kanbanCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import AddIcon from '@material-ui/icons/Add';

function KanbanGroup(props) {
    // State
    const [groupName, set_GroupName] = useState(props.group_name)
    const [edit_groupName, set_edit_GroupName] = useState(false)

    // onBlur
    const input_blur = (e) => {
        if(e.key === 'Enter' || e.type === "blur") {
            set_edit_GroupName(false)
            props.edit_groupName(props.group_id, groupName)
        }
    }

    // Handle change
    const handleChange = (e) => set_GroupName(e.target.value);

    return (
        <div className="kanban_group">
            <Draggable draggableId={`${props.group_id}`} index={props.index}>
                {provided => (
                    <div {...provided.draggableProps} ref={provided.innerRef}>
                        <div className="kanban-group-header">

                            <div className="group-name-and-card-count">
                                {edit_groupName === false? 
                                    <div className="group-title">
                                        <p className={props.color} {...provided.dragHandleProps} 
                                            onClick={() => set_edit_GroupName(true)}>{groupName}
                                        </p>
                                    </div>:
                                
                                <input onBlur={input_blur} onKeyPress={input_blur} autoFocus value={groupName} 
                                    onChange={handleChange}></input>}
                                <p className="card-count">{props.card_count}</p>
                            </div>

                            <GroupDropdown 
                                kanban_id={props.kanban_id} 
                                group_id={props.group_id}
                                clear_input={props.clear_input}
                                color={props.color} />
                        </div>

                        <Droppable droppableId={`${props.group_id}`} type="card">
                            {provided => (
                                <div className="kanban_cards" ref={provided.innerRef} {...provided.droppableProps}>
                                    {props.group_kanbanCards.map((card, index) => {
                                        return (
                                            <KanbanCard
                                                key={card.id}
                                                card_id={card.id}
                                                description={card.description}
                                                group_id={props.group_id}
                                                kanban_id={props.kanban_id}
                                                delete_card={props.delete_card}
                                                edit_card={props.edit_card}
                                                index={index} />
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        <button onClick={() => props.add_card(props.group_id, props.kanban_id, 
                            props.group_kanbanCards)} className="new-card">
                            <span><AddIcon fontSize={'inherit'} /></span>
                            New
                        </button>
                    </div>
                )}
            </Draggable>
        </div>
    )
}
export default KanbanGroup