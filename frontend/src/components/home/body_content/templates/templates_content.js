import React, { useEffect, useRef } from "react";

// Redux 
import { connect } from "react-redux";
import { add_cover_image } from "../../../../actions/image";
import { edit_page_name } from "../../../../actions/page_menu";
import { create_element } from "../../../../actions";
import { add_card } from "../../../../actions/kanban";
import { create_template_table } from "../../../../actions/templates";
import { add_tag, add_tag_to_cell } from "../../../../actions/table";

function TemplatesContent(props) {
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
            props.setTemplatesModal(false);
        }
    }
    
    // Create goals page
    const goals = async () => {

        // Change page to "loading"
        props.isLoaded(false)

        // Close modal
        props.setTemplatesModal(false);

        // Add page cover
        props.add_cover_image(props.page.id, "earth_4")

        // Add some text
        await props.create_element(-1, props.page.id, "Text", 0, null, null, 
        `You can add new cards to each group by clicking the "+ New" button at the bottom of the group.
Click on a card to edit its description or click and drag to move it to a different position in the same group or to a new group. 
You can also swap the order of groups by clicking and dragging the group title.`)

        // Create a kanban board 
        let response = await props.create_element(0, props.page.id, "Kanban", 1, null, null, "My Goals")
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
        await props.setTemplatesModal(false);

        // Add page cover
        await props.add_cover_image(props.page.id, "earth_3")

        // Add some text
        await props.create_element(-1, props.page.id, "Text", 0, null, null, "TRAVEL DATES: June 29 - August 5")

        // Create a table 
        await props.create_template_table(0, props.page.id, "Table", 1, null, "travel")

        // Change page to "loaded"
        props.isLoaded(true)
    }

    // Create Job Applications Page
    const job_applications = async () => {

        // Change page to "loading"
        await props.isLoaded(false)

        // Close modal
        await props.setTemplatesModal(false);

        // Add page cover
        await props.add_cover_image(props.page.id, "red")

        // Create a table 
        let table = await props.create_template_table(-1, props.page.id, "Table", 0, null, "job_apps")

        // Add tags to "Position" and "Status" columns
        table = table.data.table[0]

            // Position column
            const tag  = await props.add_tag("Full Stack Developer", table.rows[0].data[1], table.rows[1].data[1].id, 0, 0, 1, table, "pink")

            await props.add_tag("Frontend Developer", table.rows[0].data[1], table.rows[2].data[1].id, 0, 1, 1, table, "yellow")

            await props.add_tag("Backend Developer", table.rows[0].data[1], table.rows[3].data[1].id, 0, 2, 1, table, "grey")

            await props.add_tag_to_cell(tag.data, table.rows[4].data[1].id, 0, 3, 1, { className: "tag-option" }, table)

            // Status column
            await props.add_tag("Received offer!", table.rows[0].data[2], table.rows[1].data[2].id, 0, 0, 2, table, "green")

            await props.add_tag("Interview scheduled", table.rows[0].data[2], table.rows[2].data[2].id, 0, 1, 2, table, "brown")

            await props.add_tag("Application sent", table.rows[0].data[2], table.rows[3].data[2].id, 0, 2, 2, table, "orange")

            await props.add_tag("Rejected", table.rows[0].data[2], table.rows[4].data[2].id, 0, 3, 2, table, "red")


        // Change page to "loaded"
        props.isLoaded(true)
    }

    // Create Journal page
    const journal = async () => {

        // Change page to "loading"
        await props.isLoaded(false)

        // Close modal
        await props.setTemplatesModal(false);

        // Add page cover
        await props.add_cover_image(props.page.id, "woodcuts_1")

        // Add an H2
        await props.create_element(-1, props.page.id, "Heading_2", 0, null, null, "Section 1")

        // Add text
        await props.create_element(0, props.page.id, "Text", 1, null, null, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")

        // Add an H2
        await props.create_element(1, props.page.id, "Heading_2", 2, null, null, "Section 2")

        // Add text
        await props.create_element(2, props.page.id, "Text", 3, null, null, "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).")

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
                <div className="template-option inbox" onClick={() => job_applications()}>
                    <span>📥</span>
                    Job Applications
                </div>
                <div className="template-option pen" onClick={() => journal()}>
                    <span>🖊️</span>
                    Journal
                </div>
            </div>
        </div>
    )
}
export default connect(null, {
    add_cover_image,
    edit_page_name,
    create_element,
    add_card,
    create_template_table,
    add_tag, 
    add_tag_to_cell,
})(TemplatesContent);