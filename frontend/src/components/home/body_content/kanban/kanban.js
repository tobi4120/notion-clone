import React, { useState } from "react";
import { add_group, add_card, delete_card, edit_card, edit_groupName, 
    edit_kanbanName, change_order_kanbanCard, 
    change_order__kanbanCard_patchReq, change_order_kanbanGroup, change_order__kanbanGroup_patchReq } 
    from "../../../../actions/kanban";
import { connect } from 'react-redux';
import KanbanGroup from './kanbanGroup';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import AddIcon from '@material-ui/icons/Add';

function Kanban(props) {

    // In case there is an element whose type is Kanban but there is no kanban...
    if ((props.page_element.kanban).length === 0) return null

    let kanban = props.kanbans[props.kanbans.findIndex(x => x.id === props.page_element.kanban[0].id)]

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

    // Add a new group on the screen
    const add_group = () => set_enterGroupName(true)

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

    // Clear new group input
    const clear_input = () => set_GroupName('')

    // On drag end
    const dragEndFunc = async result => {

        // If the user moved a column
        if (result.type === 'column') {
            columnOrder(result)
            return
        }
        const { destination, source } = result;

        // If no destiniation, then return
        if (!destination) return;

        // If the source = the destination, then return
        if (source.droppableId === destination.droppableId &&
            source.index === destination.index) return;

        // Convert string to int
        const destination_id = parseInt(destination.droppableId)

        // Find the kanban group that the card was dragged to
        const index = kanban.kanban_group.findIndex(x => x.id === destination_id)
        const kanbanColumn = kanban.kanban_group[index]

        // Calculate new order
        let new_order = 1

        // If we are moving the card to another group
        if (source.droppableId !== destination.droppableId) {
            // If there are no cards in the group (column) keep new_order at 1 but if not then calculate the new_order
            if (kanbanColumn.kanban_card.length > 0) {

                // If we're trying to move a card to index 0 of the array
                if(destination.index === 0) {
                    new_order = (0 + kanbanColumn.kanban_card[0].order_on_group)/2
                
                // Else if we are trying to move a card to the last index of the array
                } else if (destination.index === kanbanColumn.kanban_card.length) {
                    new_order = kanbanColumn.kanban_card[destination.index - 1].order_on_group + 1

                // Else, we are trying to move it to the middle
                } else {
                    new_order = (kanbanColumn.kanban_card[destination.index - 1].order_on_group + 
                        kanbanColumn.kanban_card[destination.index].order_on_group)/2 
                }
            }
        // Else... if we are moving a card to a different position in the same group
        } else {
            // If we move a card towards the start of the list (moving a card upwards on the screen)
            if (source.index > destination.index) {
                // If we're trying to move a card to index 0 of the array
                if (destination.index === 0) {
                    new_order = (0 + kanbanColumn.kanban_card[0].order_on_group)/2
                } else {
                    new_order = (kanbanColumn.kanban_card[destination.index - 1].order_on_group + 
                                kanbanColumn.kanban_card[destination.index].order_on_group)/2
                }
            // If we move a card towards the end of the list (moving a card downwards on the screen)
            } else {
                // If we're trying to move a card to the last index of the list
                if (destination.index === kanbanColumn.kanban_card.length - 1) {
                    new_order = kanbanColumn.kanban_card[destination.index].order_on_group + 1
                } else {
                    new_order = (kanbanColumn.kanban_card[destination.index + 1].order_on_group + 
                                kanbanColumn.kanban_card[destination.index].order_on_group)/2
                }
            }
        }

        // Find source index and get the card ID from it
        const sourceIndex = kanban.kanban_group.findIndex(x => x.id === parseInt(source.droppableId))
        const card_id = kanban.kanban_group[sourceIndex].kanban_card[source.index].id

        // Call Redux functions
        await props.change_order_kanbanCard(source, destination, new_order, index, sourceIndex, kanban.id)
        await props.change_order__kanbanCard_patchReq(card_id, new_order, parseInt(destination.droppableId))
    }

    // Calculte column order (for when a column is moved) 
    const columnOrder = result => { 
        
        const { destination, source } = result;
        let new_order = 1

        // If we move a group towards the start of the list (moving a group left)
        if (source.index > destination.index) {
            // If we're trying to move a card to index 0 of the array
            if (destination.index === 0) {
                new_order = (0 + kanban.kanban_group[0].order)/2
            } else {
                new_order = (kanban.kanban_group[destination.index - 1].order + 
                            kanban.kanban_group[destination.index].order)/2
            }
        // If we move a group towards the end of the list (moving a group right)
        } else {
            // If we're trying to move a group to the last index of the list
            if (destination.index === kanban.kanban_group.length - 1) {
                new_order = kanban.kanban_group[destination.index].order + 1
            } else {
                new_order = (kanban.kanban_group[destination.index + 1].order + 
                            kanban.kanban_group[destination.index].order)/2
            }
        }
        console.log(new_order)
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
                                            group_id={group.id} 
                                            group_name={group.name}
                                            kanban_id={kanban.id}
                                            clear_input={clear_input}
                                            group_kanbanCards={group.kanban_card}
                                            delete_card={props.delete_card}
                                            edit_card={props.edit_card}
                                            add_card={props.add_card}
                                            card_count={group.kanban_card.length}
                                            edit_groupName={props.edit_groupName}
                                            index={index}
                                            color={group.color} />
                                    )
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <div className="new-group">
                        {enterGroupName === false? 
                            // Button to add a kanban group
                            <button onClick={add_group}>
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