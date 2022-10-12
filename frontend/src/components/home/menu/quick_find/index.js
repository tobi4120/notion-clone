import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import QuickFindPages from "./quick_find_pages";

function QuickFind(props) {
    const firstName = props.current_user.first_name
    const [searchValue, set_searchValue] = useState("")
    const node = useRef();
    const navigate = useNavigate();

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
            set_searchValue("");
            props.setQuickFindShown(false);
        }
    }

    return (
        <div className="semi-transparent-bg" ref={node}>
            <div className="modal quick-find-modal">
                <div className="search-input">
                    <i className="fas fa-search"></i>
                    <input placeholder=
                        {`Search ${firstName.charAt(0).toUpperCase()}${firstName.substring(1)}'s Notion...`}
                        value={searchValue}
                        onChange={(e) => set_searchValue(e.target.value)}>
                    </input>
                </div>

                {searchValue !== "" &&
                    <div className="search-results">
                        <QuickFindPages
                            pages={props.pages}
                            searchValue={searchValue}
                            setQuickFindShown={props.setQuickFindShown} />
                    </div>
                }
            </div>
        </div>
    )
}
export default QuickFind