import React from "react";
import { page_elements_list } from "./elements_list";
import Element_menu from '../dropdowns/element_menu';

// React DND
import {  DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Redux
import { connect } from 'react-redux';

// Redux Actions
import { edit_H1, edit_H2, edit_text, change_order } from "../../../../actions";

function PageElements(props) {
    const onDragEnd = async result => {

        // If no destination then return
        if (!result.destination) return

        const { source, destination } = result
        const page_elements = props.selected_page.page_elements

        // Calculate new order
        let new_order = 1

        if (source.index > destination.index) {
            if (destination.index === 0) {
                new_order = (0 + page_elements[destination.index].order_on_page)/2
            } else {
                new_order = (page_elements[destination.index - 1].order_on_page + 
                            page_elements[destination.index].order_on_page)/2
            }
        } else {
            if (destination.index === page_elements.length - 1) {
                new_order = page_elements[destination.index].order_on_page + 1
            } else {
                new_order = (page_elements[destination.index + 1].order_on_page + 
                            page_elements[destination.index].order_on_page)/2
            }
        }
        
        // Call redux action to update state
        props.change_order(source, destination, new_order, result.draggableId, props.selected_page.page_elements)
    }

    return (
        <div className="page_elements">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="page_elements">
                    {(provided, snapshot) => (

                        <div {...provided.droppableProps} ref={provided.innerRef}
                        className={snapshot.isDraggingOver? "dragging-over": null}>

                            {props.selected_page.page_elements.map((page_element, el_index) => { 
                                
                                const component_props = {
                                    key: page_element.id,
                                    page_element: page_element,
                                    edit_H1: props.edit_H1,
                                    edit_H2: props.edit_H2,
                                    edit_text: props.edit_text,
                                }
                                
                                return (
                                    <Draggable key={page_element.id} draggableId={page_element.id.toString()} 
                                    index={el_index}>

                                        {(provided, snapshot) => {
                                            component_props.snapshot = snapshot

                                            return (
                                                <div 
                                                    className={`element ${page_element.element_type} ${el_index === 0? "first_child": ""}`}
                                                    {...provided.draggableProps} 
                                                    ref={provided.innerRef}>
                                                    
                                                    {/* Element menu */}
                                                    <div {...provided.dragHandleProps}>
                                                        <Element_menu
                                                            selected_page={props.selected_page}
                                                            order_on_page={page_element.order_on_page}
                                                            index={el_index}
                                                            element={page_element}
                                                            column_elements={props.selected_page.page_elements} />
                                                    </div>
                                                    
                                                    {/* Element content */}
                                                    {React.createElement(page_elements_list[page_element.element_type], component_props)}
                                                </div> 
                                            )           
                                        }}
                                    </Draggable> 
                                )
                                
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}
export default connect(null, {
    edit_H1, 
    edit_H2, 
    edit_text,
    change_order,
})(PageElements);