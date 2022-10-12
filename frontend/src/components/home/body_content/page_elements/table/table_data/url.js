import React, { useState, useRef } from 'react';
import URL from '@material-ui/icons/Link';

export default function TableData_url(props) {
    const [url, setURL] = useState(props.data.url)
    const [urlInput, set_urlInput] = useState(false)
    const [urlButton_opacity, set_urlButton_opacity] = useState(100)
    const myRef = useRef(null);

    return (
        <div className="url-cell"
            onMouseEnter={() => set_urlButton_opacity(100)}
            onMouseLeave={() => set_urlButton_opacity(100)}
            ref={myRef}>
            <p onClick={() => set_urlInput(true)}>
                {url? url: <span style={{ opacity: 0 }}>&nbsp;</span>}
            </p>

            {/* Input for changing the URL */}
            {urlInput === true && 
                <div className="url-input">
                    <input
                        style={{ 
                            top: `${myRef.current.getBoundingClientRect().top - 8}px`,
                            left: `${myRef.current.getBoundingClientRect().left - 8.5}px`,
                            width: props.data.width
                        }}
                        autoFocus
                        className="user_input" 
                        type="url"
                        value={url? url: ""}
                        onChange={(e) => setURL(e.target.value)}
                        onBlur={() => {
                            props.edit_cell(props.data.property_type, url, props.data.id);
                            set_urlInput(false);
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }} 
                    />
                </div>}

            {/* Button for clicking on URL. Only shown if url exists and user input contains a '.' */}
            {url &&
                url.includes(".") &&
                <a className="url-button"
                    href={url.substring(0,7) === "http://"? url: url.substring(0,8) === "https://"?
                    url : `http://${url}`} 
                    style={{ opacity: urlButton_opacity }}>
                        
                    <URL />
                </a>}
        </div>
    )
}
