import React from "react";
import DropdownContainer from "../dropdowns/dropdown_container";
import { photos_list } from "./photos_list";

function PhotoDropdown(props) {
    return (
        <DropdownContainer setDropdownShown={props.setDropdownShown} className="photo-dropdown" translate_X="-43%">
            <h2 className="photo-drpdn-header first-header">COLOR AND GRADIENT</h2>
            <div className="grid color-and-gradient">
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "red")}>
                    <img src={photos_list['red']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "yellow")}>
                    <img src={photos_list['yellow']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "blue")}>
                    <img src={photos_list['blue']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "beige")}>
                    <img src={photos_list['beige']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "gradient_1")}>
                    <img src={photos_list['gradient_1']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "gradient_2")}>
                    <img src={photos_list['gradient_2']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "gradient_3")}>
                    <img src={photos_list['gradient_3']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "gradient_4")}>
                    <img src={photos_list['gradient_4']} />
                    <div className="img-overlay"></div>
                </div>
            </div>

            <h2 className="photo-drpdn-header">NASA ARCHIVE</h2>
            <div className="grid nasa-archive">
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "spacewalk")}>
                    <img src={photos_list['spacewalk']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "nasa_tim_peake_spacewalk")}>
                    <img src={photos_list['nasa_tim_peake_spacewalk']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "nasa_robert_stewart_spacewalk_2")}>
                    <img src={photos_list['nasa_robert_stewart_spacewalk_2']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "nasa_earth_grid")}>
                    <img src={photos_list['nasa_earth_grid']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "nasa_carina_nebula")}>
                    <img src={photos_list['nasa_carina_nebula']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "nasa_orion_nebula")}>
                    <img src={photos_list['nasa_orion_nebula']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "nasa_new_york_city_grid")}>
                    <img src={photos_list['nasa_new_york_city_grid']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "nasa_great_sandy_desert_australia")}>
                    <img src={photos_list['nasa_great_sandy_desert_australia']} />
                    <div className="img-overlay"></div>
                </div>
            </div>

            <h2 className="photo-drpdn-header">THE MET MUSEUM - PATTERNS</h2>
            <div className="grid met-museum-patterns">
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "met_william_morris_1877_willow")}>
                    <img src={photos_list['met_william_morris_1877_willow']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "met_william_morris_1875")}>
                    <img src={photos_list['met_william_morris_1875']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "met_william_morris_1878")}>
                    <img src={photos_list['met_william_morris_1878']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "met_silk_kashan_carpet")}>
                    <img src={photos_list['met_silk_kashan_carpet']} />
                    <div className="img-overlay"></div>
                </div>
            </div>

            <h2 className="photo-drpdn-header">THE MET MUSEUM - JAPANESE PRINTS</h2>
            <div className="grid met-museum-japanese">
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "woodcuts_10")}>
                    <img src={photos_list['woodcuts_10']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "woodcuts_15")}>
                    <img src={photos_list['woodcuts_15']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "woodcuts_3")}>
                    <img src={photos_list['woodcuts_3']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "woodcuts_1")}>
                    <img src={photos_list['woodcuts_1']} />
                    <div className="img-overlay"></div>
                </div>
            </div>

            <h2 className="photo-drpdn-header">PLANET EARTH</h2>
            <div className="grid earth">
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "earth_1")}>
                    <img src={photos_list['earth_1']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "earth_2")}>
                    <img src={photos_list['earth_2']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "earth_3")}>
                    <img src={photos_list['earth_3']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "earth_4")}>
                    <img src={photos_list['earth_4']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "earth_5")}>
                    <img src={photos_list['earth_5']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "earth_6")}>
                    <img src={photos_list['earth_6']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "earth_7")}>
                    <img src={photos_list['earth_7']} />
                    <div className="img-overlay"></div>
                </div>
                <div className="grid-photo" onClick={() => 
                    props.add_cover_image(props.page.id, "earth_8")}>
                    <img src={photos_list['earth_8']} />
                    <div className="img-overlay"></div>
                </div>
            </div>
        </DropdownContainer>
    )
}
export default PhotoDropdown