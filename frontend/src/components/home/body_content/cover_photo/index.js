import React, { useState, useEffect } from "react";
import ImageIcon from '@material-ui/icons/Image';
import { connect } from "react-redux";
import { add_cover_image, remove_cover_image } from "../../../../actions/image";
import PhotoDropdown from "./photo_dropdown";
import { photos_list } from "./photos_list";

function CoverPhoto(props) {
    const imageClass = `cover-photo ${props.page.photo}`
    const [dropdownShown, setDropdownShown] = useState(false)
    const [rand_num, set_rand_num] = useState(0)

    // Generate random number (this is used when a user chooses to add a cover photo to the page. The 
    // photo is slected randomly).
    useEffect(() => {
        set_rand_num(Math.floor(Math.random() * Math.floor(Object.keys(photos_list).length) + 1))
    }, []);
    
    return (
        <div className="cover-photo-container">
            {/* If page has a photo */}
            {props.page.photo? 
                <div className="photo-container">
                    <img className={imageClass} src={photos_list[props.page.photo]} alt={props.page.photo} />
                    <div className="cover-buttons" style={{ opacity: dropdownShown && "0" }}>
                        <div className="change-cover-button" onClick={() => setDropdownShown(true)}>
                            Change cover
                        </div>
                        <div className="remove-cover-button" onClick={() => 
                            props.remove_cover_image(props.page.id)}>
                            Remove cover
                        </div>
                    </div>

                    {/* Choose a photo dropdown */}
                    {dropdownShown && 
                        <PhotoDropdown 
                            page={props.page} 
                            add_cover_image={props.add_cover_image}
                            setDropdownShown={setDropdownShown} />}
                </div>
            
            // Else show add photo button
            :<div className="add-photo-container">
                <div className="add-photo" onClick={() => props.add_cover_image(props.page.id, 
                    Object.keys(photos_list)[rand_num])}>
                    <span className="photo-icon"><ImageIcon fontSize="inherit" /></span>
                    <span className="add-photo-text">Add Cover</span>
                </div>
            </div>}
        </div>
    )
}
export default connect(null, { add_cover_image, remove_cover_image })(CoverPhoto)