import React, { useState } from "react";
import { add_group, add_card, delete_card, edit_card, edit_groupName, 
    edit_kanbanName, change_order_kanbanCard, 
    change_order__kanbanCard_patchReq, change_order_kanbanGroup, change_order__kanbanGroup_patchReq } 
    from "../../../../../actions/kanban";
import { connect } from 'react-redux';
import KanbanGroup from './kanbanGroup';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import AddIcon from '@material-ui/icons/Add';

function Kanban(props) {
    let kanban = props.page_element.kanban[0]

    // State
    const [GroupName, set_GroupName] = useState("");
    const [enterGroupName, set_enterGroupName] = useState(false);
    const [kanbanName, set_KanbanName] = useState(kanban.name)

    // Handle change
    const handle_change = e => {
        
        // If user is trying to change kanban name
        if (e.target.name === 'kanbanName') set_KanbanName(e.target.value)

        // If user is trying to add a new group to the kanban and give it a name
        else set_GroupName(e.target.value) 
    }

    // POST Request to add new group
    const input_blur = (e) => {
        if(e.key === 'Enter' || e.type === "blur") {

            // If user is trying to change kanban name
            if (e.target.name === 'kanbanName') {
                props.edit_kanbanName(kanban.id, kanbanName)
                return
            }

            // Get order of last group in kanban
            const order = kanban.kanban_group[kanban.kanban_group.length - 1].order

            // If user is trying to add a new group to the kanban and give it a name
            set_enterGroupName(false)
            if (GroupName) props.add_group(GroupName, kanban.id, order + 1)

            // Clear input
            set_GroupName('');
        }
    };

    // On drag end
    const dragEndFunc = async result => {

        // If the user moved a column
        if (result.type === 'column') {
            changeColumnOrder(result)
            return
        }
        const { destination, source } = result;
        if (!destination) return;

        // If the source = the destination, then return
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const destination_id = parseInt(destination.droppableId)

        // Find the kanban group that the card was dragged to
        const index = kanban.kanban_group.findIndex(x => x.id === destination_id)
        const kanbanColumn = kanban.kanban_group[index]

        // Calculate new order
        let new_order = 1

        // If there are no cards in the group (column) keep new_order at 1
        if (kanbanColumn.kanban_card.length > 0) {

            // Moving card to first index of array
            if (destination.index === 0) {
                new_order = (kanbanColumn.kanban_card[0].order_on_group)/2
            
            // Moving card to last index of array
            } else if (destination.index >= kanbanColumn.kanban_card.length - 1) {
                new_order = kanbanColumn.kanban_card.at(-1).order_on_group + 1

            // Moving card to middle of array
            } else {
                if (source.index > destination.index) {
                    new_order = (kanbanColumn.kanban_card[destination.index - 1].order_on_group + 
                        kanbanColumn.kanban_card[destination.index].order_on_group)/2 
                } else {
                    new_order = (kanbanColumn.kanban_card[destination.index + 1].order_on_group + 
                        kanbanColumn.kanban_card[destination.index].order_on_group)/2 
                }
            }
        }

        // Find source column index and get the card ID from it
        const sourceIndex = kanban.kanban_group.findIndex(x => x.id === parseInt(source.droppableId))
        const card_id = kanban.kanban_group[sourceIndex].kanban_card[source.index].id

        // Call Redux functions
        await props.change_order_kanbanCard(source, destination, new_order, index, sourceIndex, kanban.id)
        await props.change_order__kanbanCard_patchReq(card_id, new_order, parseInt(destination.droppableId))
    }

    // Calculate column order (for when a column is moved) 
    const changeColumnOrder = result => { 
        const { destination, source } = result;
        let new_order = 1

        // Moving card to first index of array
        if (destination.index === 0) {
            new_order = (kanban.kanban_group[0].order)/2
        
        // Moving card to last index of array
        } else if (destination.index === kanban.kanban_group.length - 1) {
            new_order = kanban.kanban_group.at(-1).order + 1

        // Moving card to middle of array
        } else {
            if (source.index > destination.index) {
                new_order = (kanban.kanban_group[destination.index - 1].order + 
                    kanban.kanban_group[destination.index].order)/2 
            } else {
                new_order = (kanban.kanban_group[destination.index + 1].order + 
                    kanban.kanban_group[destination.index].order)/2 
            }
        }

        // Call Redux functions
        props.change_order_kanbanGroup(result.source, result.destination, new_order, kanban.id)
        props.change_order__kanbanGroup_patchReq(parseInt(result.draggableId), new_order)
    }

    return (
        <div className="kanban" style={{opacity: props.snapshot.isDragging? '0.5': '1'}}>
            <input className="user_input kanban-title" value={kanbanName} name="kanbanName" onChange={handle_change}
            placeholder="Untitled" onBlur={input_blur}></input>

            <hr />
            <DragDropContext onDragEnd={dragEndFunc}>
                <div className="kanban_groups">
                    <Droppable droppableId="all-columns" direction="horizontal" type="column">
                        {provided => (
                            <div className="current_groups" {...provided.droppableProps} ref={provided.innerRef}>
                                {kanban.kanban_group.map((group, index) => {
                                    return (
                                        <KanbanGroup 
                                            key={group.id} 
                                            group={group}
                                            kanban_id={kanban.id}
                                            set_GroupName={set_GroupName}
                                            delete_card={props.delete_card}
                                            edit_card={props.edit_card}
                                            add_card={props.add_card}
                                            edit_groupName={props.edit_groupName}
                                            index={index} />
                                    )
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <div className="new-group">
                        {enterGroupName === false? 
                            // Button to add a kanban group
                            <button onClick={() => set_enterGroupName(true)}>
                                <span><AddIcon fontSize={'inherit'} /></span>
                                <p>Add Group</p>
                            </button>:

                            // Input to enter the group name
                            <input autoFocus placeholder="Untitled" onBlur={input_blur} onKeyPress={input_blur} 
                                value={GroupName} name="GroupName" onChange={handle_change}>
                            </input>}
                    </div>
                </div>
            </DragDropContext>
        </div>
    )
}

const mapStateToProps = (state) => {
    return { 
        kanbans: state.kanbans, 
    }
}

export default connect(mapStateToProps, {
    add_group, 
    add_card, 
    delete_card,
    edit_card,
    edit_groupName,
    edit_kanbanName,
    change_order_kanbanCard,
    change_order__kanbanCard_patchReq,
    change_order_kanbanGroup,
    change_order__kanbanGroup_patchReq
})(Kanban)