import { CardActions } from '@material-ui/core';
import axios from 'axios';
const regeneratorRuntime = require("regenerator-runtime");
import { getCookie } from './index'

// Configure axios to accept the CSRF Token
const headers = {
    'X-CSRFToken': getCookie('csrftoken')
}

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

// Create a kanban
export const create_kanban = async (element_id, optional_text) => {
    const newKanban = await axios.post('/api_kanbans/', {
        name: optional_text || "",
        page_element: element_id,
    }, {headers: headers});

    // Create the 3 default kanban groups
    const newGroups = await create_3_kanbanGroups(newKanban.data.id)

    // Add the groups to the kanban
    newKanban.data.kanban_group = newGroups

    return newKanban.data
} 

// Create 3 default kanban groups (this function gets called when the user creates a new kanban... we are adding 3 groups
// to every new kanban by default)
const create_3_kanbanGroups = async (kanban_id) => {
    const kanban_groups = ["Not started", "In progress", "Completed"]
    const colors = ["red", "yellow", "green"]
    const new_groups = []

    let order = 1

    for (const groupName of kanban_groups){
        const response = await axios.post('/api_kanban_groups/', {
            name: groupName,
            order: order,
            color: colors[order - 1],
            kanban: kanban_id,
        }, {headers: headers});

        // Increment order by 1
        order++
        
        // Append response to new_groups array
        new_groups.push(response.data)
    }
    return new_groups
} 

// Add kanban group
export const add_group = (name, kanban, order) => 
    async (dispatch) => {

        // Randomly assign a color to the tag
        const colors = {1: "default", 2: "grey", 3: "brown", 4: "orange", 5: "yellow", 6: "green", 7: "blue", 
        8: "purple", 9: "pink", 10: "red"}

        const num = Math.floor(Math.random() * Math.floor(10) + 1);

        const response = await axios.post(`/api_kanban_groups/`, {
            name: name,
            order: order,
            color: colors[num],
            kanban: kanban
        }, {headers: headers});

        dispatch({ type: 'ADD_KANBAN_GROUP', payload: response.data });
    };

// Delete kanban group
export const delete_group = (kanban_id, group_id) => 
    async (dispatch) => {
        await axios.delete(`/api_kanban_groups/${group_id}/`, undefined, {headers: headers});

        const response = {kanban_id: kanban_id, group_id: group_id}

        dispatch({ type: 'DELETE_KANBAN_GROUP', payload: response });
    };

// Add kanban card
export const add_card = (kanban_group, kanban, group_kanbanCards, card_desc) => 
    async (dispatch) => {
        let order_on_group = 1

        // Find order_on_group # of last card in group and add 1 to it
        if (group_kanbanCards.length > 0) {
            order_on_group = group_kanbanCards[group_kanbanCards.length - 1].order_on_group + 1
        }

        // POST Request
        const response = await axios.post(`/api_kanban_cards/`, {
            description: card_desc || "",
            order_on_group: order_on_group,
            kanban_group: kanban_group
        }, {headers: headers});

        const data = {kanban_group: kanban_group, kanban: kanban, response: response.data}

        dispatch({ type: 'ADD_KANBAN_CARD', payload: data });
    };


// Delete kanban card
export const delete_card = (kanban_card, kanban_group, kanban) => 
    async (dispatch) => {
        await axios.delete(`/api_kanban_cards/${kanban_card}/`, undefined, {headers: headers});

        const response = {kanban_card, kanban_group, kanban}

        dispatch({ type: 'DELETE_KANBAN_CARD', payload: response });
    };

// Edit kanban card description
export const edit_card = (card_id, newDescription, kanban_id) =>
    async (dispatch) => {
        const response = await axios.patch(`/api_kanban_cards/${card_id}/`, {
            description: newDescription
        }, {headers: headers}); 

        // Add kanban id to response so it is passed to the reducer
        response.kanban_id = kanban_id

        dispatch({ type: 'EDIT_CARD_DESC', payload: response });
    };

// Edit kanban group name
export const edit_groupName = (group_id, newName) =>
    async () => {
        await axios.patch(`/api_kanban_groups/${group_id}/`, {
            name: newName
        }, {headers: headers}); 
    };

// Edit kanban name
export const edit_kanbanName = (kanban_id, newName) =>
    async () => {
        await axios.patch(`/api_kanbans/${kanban_id}/`, {
            name: newName
        }, {headers: headers}); 
    };

// Change order of kanban card (update state)
export const change_order_kanbanCard = (source, destination, new_order, destination_columnIndex, 
    source_columnIndex, kanban_id) => {
    const payload = {source, destination, new_order, destination_columnIndex, source_columnIndex, kanban_id}

    return { type: 'CHANGE_ORDER_KANBAN_CARD', payload: payload };
};

// Change order of kanban card (Patch Request)
export const change_order__kanbanCard_patchReq = (card_id, new_order, group_id) => 
    async () => {
        await axios.patch(`/api_kanban_cards/${card_id}/`, {
            order_on_group: new_order,
            kanban_group: group_id,
        }, {headers: headers});
    };

// Change order of kanban group (update state)
export const change_order_kanbanGroup = (source, destination, new_order, kanban_id) => {
        const payload = {source, destination, new_order, kanban_id}
    
        return { type: 'CHANGE_ORDER_KANBAN_GROUP', payload: payload };
};

// Change order of kanban group (Patch Request)
export const change_order__kanbanGroup_patchReq = (card_id, new_order) => 
    async () => {
        await axios.patch(`/api_kanban_groups/${card_id}/`, {
            order: new_order,
        }, {headers: headers});
    };

// Change color of kanban group 
export const change_color = (group_id, color, kanban_id) => 
    async (dispatch) => {
        await axios.patch(`api_kanban_groups/${group_id}/`, {
            color: color,
        }, {headers: headers})

        dispatch({ type: 'CHANGE_GROUP_COLOR', payload: { group_id, color, kanban_id } })
    }