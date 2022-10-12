import React from "react";
import PageNav from "./page-nav";

const ListOfPages = (props) => {
    return (
        props.pages.map(page => {
            if (!props.parentClosed)
                return (
                    <div key={page.id}>
                        <PageNav
                            page={page}
                            depth={props.depth}
                            openClosePages={props.openClosePages}
                            addPage={props.addPage}
                            handle_change={props.handle_change}
                            deletePage={props.deletePage}
                            selected_page={props.selected_page}
                            changeNameOnMenu={props.changeNameOnMenu}
                            toggle_menu={props.toggle_menu} />

                        {page.children && 
                            <ListOfPages 
                                pages={page.children} 
                                depth={props.depth + 1}
                                parentClosed={page.closed}
                                openClosePages={props.openClosePages}
                                addPage={props.addPage}
                                deletePage={props.deletePage}
                                selected_page={props.selected_page}
                                changeNameOnMenu={props.changeNameOnMenu}
                                toggle_menu={props.toggle_menu} />}
                    </div>
                )
        })
    )
}
export default ListOfPages;