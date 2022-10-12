import React from 'react'
import { useState } from 'react'
import TemplatesContent from "./templates_content";

function Templates(props) {
    const [templatesModal, setTemplatesModal] = useState(false)
    return (
        <div>
            <div className="empty-page-text">
                <div>
                    Hover over the page title and click the plus sign to add elements to the page.
                </div>

                <div>
                    You can also choose a page layout from one of our pre-designed 
                    <a onClick={() => setTemplatesModal(true)}>
                        <i className="fas fa-shapes"></i>
                        templates.
                    </a>
                </div>
            </div>

        {templatesModal && 
                <TemplatesContent
                    page={props.page}
                    setTemplatesModal={setTemplatesModal}
                    isLoaded={props.isLoaded} />}
        </div>
    )
}
export default Templates;
