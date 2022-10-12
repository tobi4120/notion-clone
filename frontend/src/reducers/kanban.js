export const kanbansReducer = (kanbans=[], action) => {
    switch (action.type) {
        case "CREATE_ELEMENT":
            let kanban_array = [...kanbans]

            // If the element is a kanban, append it to the kanban reducer
            if (action.payload.data.element_type === 'Kanban')
            kanban_array = [...kanbans, action.payload.data.kanban[0]]
            
            return kanban_array

        case "SELECT_PAGE":
            kanban_array = []

            if (action.payload === "page not found") {
                return kanban_array
            }

            action.payload.data.page_elements.forEach(element => {
                if (element.element_type === "Kanban") kanban_array.push(element.kanban[0])
            });
            return kanban_array

        case "DELETE_ELEMENT":
            const element = action.payload
            
            // If the element is a kanban, delete it from the kanban reducer
            if (element.element_type === "Kanban") {
                const kanban_id = element.kanban[0].id

                kanban_array = kanbans.filter(kanban => kanban.id !== kanban_id)   
                return kanban_array
            }
            return kanbans
        
        case "ADD_KANBAN_GROUP":
            // Copy kanbans
            kanban_array = [...kanbans]

            // Find index
            let index = kanban_array.findIndex(x => x.id === action.payload.kanban)

            // Insert new group at end of kanban
            kanban_array[index].kanban_group.push(action.payload)

            return kanban_array
        
        case "DELETE_KANBAN_GROUP":
            // Copy kanbans
            kanban_array = [...kanbans]

            // Find which kanban the group is on
            index = kanban_array.findIndex(x => x.id === action.payload.kanban_id)
            
            // Remove deleted item from kanban_array
            const filteredGroups = kanbans[index].kanban_group.filter(x => x.id !== action.payload.group_id);

            // Update the kanban with the filteredGroups 
            kanban_array[index].kanban_group = filteredGroups

            return kanban_array
        
        case "ADD_KANBAN_CARD":
            // Copy kanbans
            kanban_array = [...kanbans]

            // Find which kanban the card is on
            index = kanban_array.findIndex(x => x.id === action.payload.kanban)

            // Find which kanban group the card is on
            let group_index = kanban_array[index].kanban_group.findIndex(x => x.id === action.payload.kanban_group)

            // Append card to end of group
            kanban_array[index].kanban_group[group_index].kanban_card.push(action.payload.response)

            return kanban_array

        case "DELETE_KANBAN_CARD":
            // Copy kanbans
            kanban_array = [...kanbans]

            // Find which kanban the card is on
            index = kanban_array.findIndex(x => x.id === action.payload.kanban)

            // Find which kanban group the card is on
            group_index = kanban_array[index].kanban_group.findIndex(x => x.id === action.payload.kanban_group)

            // Remove deleted card from cards array
            const filteredCards = kanban_array[index].kanban_group[group_index].kanban_card.filter(
                x => x.id !== action.payload.kanban_card)
            
            // Update the group cards with the new cards
            kanban_array[index].kanban_group[group_index].kanban_card = filteredCards
            
            return kanban_array

        case "EDIT_CARD_DESC":
            const { kanban_group, id, description } = action.payload.data

            // Copy kanbans
            kanban_array = [...kanbans]

            // Find which kanban the card is on
            index = kanban_array.findIndex(x => x.id === action.payload.kanban_id)

            // Find which kanban group the card is on
            group_index = kanban_array[index].kanban_group.findIndex(x => x.id === kanban_group) 

            // Find the index of the kanban card
            const card_index = kanban_array[index].kanban_group[group_index].kanban_card.findIndex(
                x => x.id === id)

            // Update card description
            kanban_array[index].kanban_group[group_index].kanban_card[card_index].description = description

            return kanban_array
        
        case "CHANGE_ORDER_KANBAN_CARD":
            const { source, destination, new_order, destination_columnIndex, source_columnIndex,
                kanban_id } = action.payload;

            // Copy kanbans
            kanban_array = [...kanbans]

            // Find which kanban the card is on
            index = kanban_array.findIndex(x => x.id === kanban_id)

            // Declare source and destination column
            let sourceColumn = kanban_array[index].kanban_group[source_columnIndex]
            let destinationColumn = kanban_array[index].kanban_group[destination_columnIndex]

            // Move element from source to destination and change the 'order on group' property
            let card = sourceColumn.kanban_card.splice(source.index, 1)
            card.order_on_group = new_order
            destinationColumn.kanban_card.splice(destination.index, 0, ...card)

            return kanban_array
        
        case "CHANGE_ORDER_KANBAN_GROUP": 
            // Copy kanbans
            kanban_array = [...kanbans]

            // Find which kanban the card is on
            index = kanban_array.findIndex(x => x.id === action.payload.kanban_id)

            // Move element from source to destination and change the 'order' property
            let group = kanban_array[index].kanban_group.splice(action.payload.source.index, 1)

            group[0].order = action.payload.new_order

            kanban_array[index].kanban_group.splice(action.payload.destination.index, 0, ...group)

            return kanban_array

        case "CHANGE_GROUP_COLOR":
            // Copy kanbans
            kanban_array = [...kanbans]

            // Find kanban
            index = kanban_array.findIndex(x => x.id === action.payload.kanban_id)

            // Find group
            group_index = kanban_array[index].kanban_group.findIndex(x => x.id === action.payload.group_id)

            // Update color and return kanban
            kanban_array[index].kanban_group[group_index].color = action.payload.color

            return kanban_array

        default:
            return kanbans;
    }
};