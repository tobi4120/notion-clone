import React, { useEffect, useRef, useState } from "react";
import DropdownContentPlaceholder from "../dropdowns/dropdown_placeholder";

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

function PhotoDropdown(props) {
    const ref = useRef();
    const [transform, set_transform] = useState("")
    const [opacity, set_opacity] = useState(0)

    // Adding event listener to detect clicks outside the modal
    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
      }, []);

    const handleClick = e => {
        // If user clicked outside modal - hide it
        if (!ref.current.contains(e.target)) {

            if (e.target.className !== "screen")
                props.set_dropdown(false);
        }
    }

    return (
        <DropdownContentPlaceholder ref={ref} set_transform={set_transform} set_opacity={set_opacity}
        translate_X="-43%">
            <div className="photo-dropdown" ref={ref} 
                style={{ transform: transform, opacity: opacity }}>

                <h2 className="photo-drpdn-header first-header">COLOR AND GRADIENT</h2>
                <div className="grid color-and-gradient">
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "red")}>
                        <img src={photos['red']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "yellow")}>
                        <img src={photos['yellow']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "blue")}>
                        <img src={photos['blue']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "beige")}>
                        <img src={photos['beige']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "gradient_1")}>
                        <img src={photos['gradient_1']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "gradient_2")}>
                        <img src={photos['gradient_2']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "gradient_3")}>
                        <img src={photos['gradient_3']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "gradient_4")}>
                        <img src={photos['gradient_4']} />
                        <div className="img-overlay"></div>
                    </div>
                </div>

                <h2 className="photo-drpdn-header">NASA ARCHIVE</h2>
                <div className="grid nasa-archive">
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "spacewalk")}>
                        <img src={photos['spacewalk']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "nasa_tim_peake_spacewalk")}>
                        <img src={photos['nasa_tim_peake_spacewalk']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "nasa_robert_stewart_spacewalk_2")}>
                        <img src={photos['nasa_robert_stewart_spacewalk_2']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "nasa_earth_grid")}>
                        <img src={photos['nasa_earth_grid']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "nasa_carina_nebula")}>
                        <img src={photos['nasa_carina_nebula']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "nasa_orion_nebula")}>
                        <img src={photos['nasa_orion_nebula']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "nasa_new_york_city_grid")}>
                        <img src={photos['nasa_new_york_city_grid']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "nasa_great_sandy_desert_australia")}>
                        <img src={photos['nasa_great_sandy_desert_australia']} />
                        <div className="img-overlay"></div>
                    </div>
                </div>

                <h2 className="photo-drpdn-header">THE MET MUSEUM - PATTERNS</h2>
                <div className="grid met-museum-patterns">
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "met_william_morris_1877_willow")}>
                        <img src={photos['met_william_morris_1877_willow']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "met_william_morris_1875")}>
                        <img src={photos['met_william_morris_1875']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "met_william_morris_1878")}>
                        <img src={photos['met_william_morris_1878']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "met_silk_kashan_carpet")}>
                        <img src={photos['met_silk_kashan_carpet']} />
                        <div className="img-overlay"></div>
                    </div>
                </div>

                <h2 className="photo-drpdn-header">THE MET MUSEUM - JAPANESE PRINTS</h2>
                <div className="grid met-museum-japanese">
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "woodcuts_10")}>
                        <img src={photos['woodcuts_10']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "woodcuts_15")}>
                        <img src={photos['woodcuts_15']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "woodcuts_3")}>
                        <img src={photos['woodcuts_3']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "woodcuts_1")}>
                        <img src={photos['woodcuts_1']} />
                        <div className="img-overlay"></div>
                    </div>
                </div>

                <h2 className="photo-drpdn-header">PLANET EARTH</h2>
                <div className="grid earth">
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "earth_1")}>
                        <img src={photos['earth_1']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "earth_2")}>
                        <img src={photos['earth_2']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "earth_3")}>
                        <img src={photos['earth_3']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "earth_4")}>
                        <img src={photos['earth_4']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "earth_5")}>
                        <img src={photos['earth_5']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "earth_6")}>
                        <img src={photos['earth_6']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "earth_7")}>
                        <img src={photos['earth_7']} />
                        <div className="img-overlay"></div>
                    </div>
                    <div className="grid-photo" onClick={() => 
                        props.add_cover_image(props.page.id, "earth_8")}>
                        <img src={photos['earth_8']} />
                        <div className="img-overlay"></div>
                    </div>
                </div>
            </div>
        </DropdownContentPlaceholder>
    )
}
export default PhotoDropdown