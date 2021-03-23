import React, { useState, useEffect } from "react";
import ImageIcon from '@material-ui/icons/Image';
import { connect } from "react-redux";
import { add_cover_image, remove_cover_image } from "../../../../actions/image";
import PhotoDropdown from "./photo_dropdown";

// Color and Gradient
import red from './images/solid_red.png';
import yellow from './images/solid_yellow.png';
import blue from './images/solid_blue.png';
import beige from './images/solid_beige.png';
import gradient_1 from './images/gradient_1.png';
import gradient_2 from './images/gradient_2.png';
import gradient_3 from './images/gradient_3.png';
import gradient_4 from './images/gradient_4.png';

// Nasa Archive
import spacewalk from './images/nasa_robert_stewart_spacewalk.jpg';
import nasa_tim_peake_spacewalk from './images/nasa_tim_peake_spacewalk.jpg';
import nasa_robert_stewart_spacewalk_2 from './images/nasa_robert_stewart_spacewalk_2.jpg';
import nasa_earth_grid from './images/nasa_earth_grid.jpg';
import nasa_carina_nebula from './images/nasa_carina_nebula.jpg';
import nasa_orion_nebula from './images/nasa_orion_nebula.jpg';
import nasa_new_york_city_grid from './images/nasa_new_york_city_grid.jpg';
import nasa_great_sandy_desert_australia from './images/nasa_great_sandy_desert_australia.jpg';

// The MET Museum - Patterns
import met_william_morris_1877_willow from './images/met_william_morris_1877_willow.jpg'
import met_william_morris_1875 from './images/met_william_morris_1875.jpg'
import met_william_morris_1878 from './images/met_william_morris_1878.jpg'
import met_silk_kashan_carpet from './images/met_silk_kashan_carpet.jpg'

// The MET Museum - Japanese Prints
import woodcuts_10 from './images/woodcuts_10.jpg'
import woodcuts_15 from './images/woodcuts_15.jpg'
import woodcuts_3 from './images/woodcuts_3.jpg'
import woodcuts_1 from './images/woodcuts_1.jpg'

// Planet Earth
import earth_1 from './images/earth_1.jpg'
import earth_2 from './images/earth_2.jpg'
import earth_3 from './images/earth_3.jpeg'
import earth_4 from './images/earth_4.jpeg'
import earth_5 from './images/earth_5.jpg'
import earth_6 from './images/earth_6.jpeg'
import earth_7 from './images/earth_7.jpg'
import earth_8 from './images/earth_8.jpeg'

const photos = { 
    // Color and Gradient
    red,
    yellow,
    blue,
    beige,
    gradient_1,
    gradient_2,
    gradient_3,
    gradient_4,

    // Nasa Archive
    spacewalk,
    nasa_tim_peake_spacewalk,
    nasa_robert_stewart_spacewalk_2,
    nasa_earth_grid,
    nasa_carina_nebula,
    nasa_orion_nebula,
    nasa_new_york_city_grid,
    nasa_great_sandy_desert_australia,

    // The MET Museum - Patterns
    met_william_morris_1877_willow,
    met_william_morris_1875,
    met_william_morris_1878,
    met_silk_kashan_carpet,

    // The MET Museum - Japanese Prints
    woodcuts_10,
    woodcuts_15,
    woodcuts_3,
    woodcuts_1,

    // Planet Earth
    earth_1,
    earth_2,
    earth_3,
    earth_4,
    earth_5,
    earth_6,
    earth_7,
    earth_8,
}

function CoverPhoto(props) {
    const imageClass = `cover-photo ${props.page.photo}`
    const [dropdown_shown, set_dropdown] = useState(false)
    const [rand_num, set_rand_num] = useState(0)

    // Generate random number (this is used later when a user chooses to add a cover photo to the page. The 
    // photo is slected randomly).
    useEffect(() => {
        set_rand_num(Math.floor(Math.random() * Math.floor(Object.keys(photos).length) + 1))
    }, []);

    return (
        <div>
            {/* If page has a photo */}
            {props.page.photo? 
                <div className="photo-container">
                    <img className={imageClass} src={photos[props.page.photo]} alt={props.page.photo} />
                    {!dropdown_shown && 
                        <div className="cover-buttons">
                            <div className="change-cover-button" onClick={async () => await set_dropdown(true)}>
                                Change cover
                            </div>
                            <div className="remove-cover-button" onClick={() => 
                                props.remove_cover_image(props.page.id)}>
                                Remove cover
                            </div>
                        </div>
                    }

                    {/* Choose a photo dropdown */}
                    {dropdown_shown && 
                        <PhotoDropdown 
                            page={props.page} 
                            add_cover_image={props.add_cover_image}
                            set_dropdown={set_dropdown} />}
                </div>
            
            // Else show add photo button
            :
                <div className="add-photo-container">
                    <div className="add-photo" onClick={() => props.add_cover_image(props.page.id, 
                        Object.keys(photos)[rand_num])}>
                        <span className="photo-icon"><ImageIcon fontSize="inherit" /></span>
                        <span className="add-photo-text">Add Cover</span>
                    </div>
                </div>
            }

        </div>
    )
}
export default connect(null, { add_cover_image, remove_cover_image })(CoverPhoto)