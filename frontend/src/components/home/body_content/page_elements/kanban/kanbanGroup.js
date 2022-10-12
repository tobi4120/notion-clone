import React, { useState } from "react";
import GroupDropdown from './kanban_dropdowns';
import KanbanCard from './kanbanCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import AddIcon from '@material-ui/icons/Add';

function KanbanGroup(props) {
    // State
    const [groupName, set_GroupName] = useState(props.group.name)
    const [edit_groupName, set_edit_GroupName] = useState(false)

    // Change group name
    const input_blur = (e) => {
        if(e.key === 'Enter' || e.type === "blur") {
            set_edit_GroupName(false)
            props.edit_groupName(props.group.id, groupName)
        }
    }

    // Handle change
    const handleChange = (e) => set_GroupName(e.target.value);

    return (
        <div className="kanban_group">
            <Draggable draggableId={`${props.group.id}`} index={props.index}>
                {provided => (
                    <div {...provided.draggableProps} ref={provided.innerRef}>
                        <div className="kanban-group-header">

                            <div className="group-name-and-card-count">
                                {edit_groupName === false? 
                                    <div className="group-title">
                                        <p className={`${props.group.color} ${props.group.color}-text`} {...provided.dragHandleProps} 
                                            onClick={() => set_edit_GroupName(true)}>{groupName}
                                        </p>
                                    </div>:
                                
                                    <input onBlur={input_blur} onKeyPress={input_blur} autoFocus value={groupName} 
                                        onChange={handleChange}></input>}
                                <p className="card-count">{props.group.kanban_card.length}</p>
                            </div>

                            <GroupDropdown 
                                kanban_id={props.kanban_id} 
                                group_id={props.group.id}
                                set_GroupName={props.set_GroupName}
                                color={props.group.color} />
                        </div>

                        <Droppable droppableId={`${props.group.id}`} type="card">
                            {provided => (
                                <div className="kanban_cards" ref={provided.innerRef} {...provided.droppableProps}>
                                    {props.group.kanban_card.map((card, index) => {
                                        return (
                                            <KanbanCard
                                                key={card.id}
                                                card_id={card.id}
                                                description={card.description}
                                                group_id={props.group.id}
                                                kanban_id={props.kanban_id}
                                                delete_card={props.delete_card}
                                                edit_card={props.edit_card}
                                                index={index} />
                                        )
                                    })}
                                    {provided.placeholder}
                                    <div className="placeholder">Placeholder</div>
                                </div>
                            )}
                        </Droppable>
                        <button onClick={() => props.add_card(
                            props.group.id, 
                            props.kanban_id, 
                            props.group.kanban_card)} 
                            className="new-card">
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