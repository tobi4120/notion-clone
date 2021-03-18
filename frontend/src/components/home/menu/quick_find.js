import React, { useRef, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';

function QuickFind(props) {
    const firstName = props.current_user.first_name
    const [searchValue, set_searchValue] = useState("")
    const node = useRef();
    const history = useHistory();

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
            props.close_modal();
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
                        {props.pages.map(page => {
                            if (page.name.toUpperCase().includes(searchValue.toUpperCase())) {
                                return (
                                    <div key={page.id} className="result" onClick={() => { 
                                        history.push(`/${page.id}`);
                                        props.close_modal();
                                    }}>
                                        <i className="far fa-file-alt" />
                                        {page.name}
                                    </div>
                                )
                            }
                        })}
                    </div>
                }
            </div>
        </div>
    )
}
export default QuickFind