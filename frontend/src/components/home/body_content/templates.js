import React, { useEffect, useRef } from "react";

// Redux 
import { connect } from "react-redux";
import { add_cover_image } from "../../../actions/image";
import { edit_page_name, edit_name_onChange } from "../../../actions/page_menu";
import { create_element } from "../../../actions";
import { add_card } from "../../../actions/kanban";
import { create_template_table } from "../../../actions/templates";

function Templates(props) {
    const node = useRef();

    // Adding event listener to detect clicks outside the modal
    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
      }, []);

    const handleClick = e => {
        // If user clicked outside modal - hide it
        if (node.current === e.target) {
            props.close_template_modal();
        }
    }
    
    // Create goals page
    const goals = async () => {

        // Change page to "loading"
        props.isLoaded(false)

        // Close modal
        props.close_template_modal();

        // Add page cover
        props.add_cover_image(props.page.id, "earth_4")

        // Add some text
        await props.create_element(-1, props.page.id, "Text", 0, 0, { group: 0, column: 0 }, null, 
        `You can add new cards to each group by clicking the "+ New" button at the bottom of the group.
Click on a card to edit its description or click and drag to move it to a different position in the same group or to a new group. 
You can also swap the order of groups by clicking and dragging the group title.`)

        // Create a kanban board 
        let response = await props.create_element(0, props.page.id, "Kanban", 1, null, { group: 0, column: 0 }, null, "My Goals")
        const kanban = response.data.kanban[0]

            // Add kanabn cards
            await props.add_card(kanban.kanban_group[0].id, kanban.id, kanban.kanban_group[0], "🇫🇷 Learn French")
            await props.add_card(kanban.kanban_group[0].id, kanban.id, kanban.kanban_group[0], "🏃‍♀️ Exercise 3x / week")
            await props.add_card(kanban.kanban_group[0].id, kanban.id, kanban.kanban_group[0], "💼 Land first freelance job")

            await props.add_card(kanban.kanban_group[1].id, kanban.id, kanban.kanban_group[1], "🥖 Learn how to bake")
            await props.add_card(kanban.kanban_group[1].id, kanban.id, kanban.kanban_group[1], "🧘 Meditate 15 mins each day")
            await props.add_card(kanban.kanban_group[1].id, kanban.id, kanban.kanban_group[1], "🔗 Update personal website")

            await props.add_card(kanban.kanban_group[2].id, kanban.id, kanban.kanban_group[2], "🏀 Start basketball team")
            await props.add_card(kanban.kanban_group[2].id, kanban.id, kanban.kanban_group[2], "💸 Contribute to 401k")
            await props.add_card(kanban.kanban_group[2].id, kanban.id, kanban.kanban_group[2], "🇯🇵 Visit Japan")

        // Change page to "loaded"
        props.isLoaded(true)
    }

    // Create Travel Planner Page
    const travel_planner = async () => {

        // Change page to "loading"
        await props.isLoaded(false)

        // Close modal
        await props.close_template_modal();

        // Add page cover
        await props.add_cover_image(props.page.id, "earth_3")

        // Add some text
        await props.create_element(-1, props.page.id, "Text", 0, 0, { group: 0, column: 0 }, null, "TRAVEL DATES: June 29 - August 5")

        // Create a table 
        await props.create_template_table(0, props.page.id, "Table", 1, null, { group: 0, column: 0 }, "travel")

        // Change page to "loaded"
        props.isLoaded(true)
    }

    // Create Job Applications Page
    const job_applications = async () => {

        // Change page to "loading"
        await props.isLoaded(false)

        // Close modal
        await props.close_template_modal();

        // Add page cover
        await props.add_cover_image(props.page.id, "red")

        // Create a table 
        await props.create_template_table(0, props.page.id, "Table", 1, null, { group: 0, column: 0 }, "job_apps")

        // Change page to "loaded"
        props.isLoaded(true)
    }

    return (
        <div className="semi-transparent-bg" ref={node}>
            <div className="modal templates-modal">
                <div className="template-option" onClick={() => goals()}>
                    <span>⛰️</span>
                    Goals
                </div>
                <div className="template-option" onClick={() => travel_planner()}>
                    <span>🛫</span>
                    Travel Planner
                </div>
                <div className="template-option" onClick={() => job_applications()}>
                    <span>📥</span>
                    Job Applications
                </div>
            </div>
        </div>
    )
}
export default connect(null, {
    add_cover_image,
    edit_page_name,
    edit_name_onChange,
    create_element,
    add_card,
    create_template_table,
})(Templates);