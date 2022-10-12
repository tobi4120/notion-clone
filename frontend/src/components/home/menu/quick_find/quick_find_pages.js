import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function QuickFindPages(props) {
    const navigate = useNavigate();
    return (
        <div>
            {props.pages.map(page => {
                return (
                    <div>
                        {page.name.toUpperCase().startsWith(props.searchValue.toUpperCase()) &&
                            <div key={page.id} className="result" onClick={() => { 
                                navigate(`/${page.id}`);
                                props.setQuickFindShown(false);
                            }}>
                                <i className="far fa-file-alt" />
                                {page.name}
                            </div>
                        }

                        {/* Child pages */}
                        <QuickFindPages
                                pages={page.children}
                                searchValue={props.searchValue}
                                setQuickFindShown={props.setQuickFindShown} />
                    </div>
                )
            })}
        </div>
    )
}