import React, { useState, useEffect } from "react";

// Page elements
import Heading_1 from './headings/heading_1'; 
import Heading_2 from './headings/heading_2'; 
import Text from './text';
import Kanban from './kanban/kanban';
import Page_link from './page_link';
import To_do from './to_do';
import Table from './table/table';

// React DND
import { Droppable, Draggable } from 'react-beautiful-dnd';

// Other
import Element_options from './element_options';

function Column(props) {
    return (
        <div className={props.column_elements.length > 0? 'column': 'empty'}>
            <Droppable droppableId={`${props.group_index}${props.col_num}`} key={`${props.group_index}${props.col_num}`}>
                {(provided, snapshot) => (

                    <div {...provided.droppableProps} ref={provided.innerRef}
                    className={snapshot.isDraggingOver? "dragging-over": null}>

                        {props.column_elements.map((page_element, el_index) => { 

                            const components = {
                                Heading_1,
                                Heading_2, 
                                Text,
                                Kanban,
                                Page_link,
                                To_do,
                                Table,
                            }
                            
                            const component_props = {
                                key: page_element.id,
                                page_element: page_element,
                                edit_H1: props.edit_H1,
                                edit_H2: props.edit_H2,
                                edit_text: props.edit_text,
                            }

                            // If element is the first element on the page, give it a class name of first_child
                            let first_child = ""

                            if (props.group_index === 0 && el_index === 0) {
                                first_child = "first_child"
                            }
                            
                            return (
                                <Draggable key={page_element.id} draggableId={page_element.id.toString()} 
                                index={el_index}>

                                    {(provided, snapshot) => {
                                        component_props.snapshot = snapshot

                                        return (
                                            <div className={`element ${page_element.element_type} ${first_child}`}
                                            {...provided.draggableProps} ref={provided.innerRef}>
                                                <div {...provided.dragHandleProps}>
                                                    <Element_options 
                                                        create_element_func={props.create_element_func}
                                                        selected_page={props.selected_page}
                                                        order_on_page={page_element.order_on_page}
                                                        index={el_index}
                                                        element={page_element}
                                                        column_elements={props.column_elements}
                                                        update_database={props.update_database} />
                                                </div>
                                                
                                                {React.createElement(components[page_element.element_type], 
                                                component_props)}
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
        </div>
    )
}
export default Column