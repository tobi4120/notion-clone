import React, { useState, useEffect, useRef } from "react";

// Purpose is to correctly position the dropdown menu given its position on the screen
const DropdownContainer = React.forwardRef((props, ref) => {
    const [state, setState] = useState({
        transform: "",
        opacity: 0
    })
    const myRef = useRef(null);

    useEffect(() => {
        // _____________________ DROPDOWN POSITIONING ________________________ //
        const rect = myRef.current.getBoundingClientRect()
        let transform = state.transform

        // If the dropdown is dropping below the window size (meaning we can't see part of it)
        // reverse the direction and have it point upwards
        if (window.innerHeight - rect.bottom < 5) {
            transform = `translateY(${props.translate_Y || '-95%'})`

            console.log(true)

            // Check if dropdown is past the width of the window size
            if (rect.right > window.innerWidth) {
                transform = `translateY(${props.translate_Y || '-95%'}) translateX(${props.translate_X || '-20%'})`
            }
        // Check if dropdown is past the width of the window size
        } else if (rect.right > window.innerWidth) {
            transform = `translateX(${props.translate_X2 || props.translate_X || '-20%'})`
        }
        setState({...state, transform: transform, opacity: 100})

        // _____________________ DROPDOWN CLICK OUTSIDE - EVENT LISTENR ________________________ //
        // Add event listener to detect when someone clicks away from dropdown
        const handler = async (event) => {
            if (!myRef.current) {
                return
            }
            
            // Close menu when user clicks away from it 
            if (!myRef.current.contains(event.target)) {
                
                if (event.target.className !== "dropdown") {
                    props.setDropdownShown(false);
                }
            }
        }
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, []);

    const className = props.className? ` ${props.className}`: "";

    // Dropdown dynamic positioning
    const topSubtraction = props.topSubtraction? props.topSubtraction : 0;
    const leftSubtraction = props.leftSubtraction? props.leftSubtraction : 0;

    const topPosition = ref? `${ref.current.getBoundingClientRect().top + 20 - topSubtraction}px`: "";
    const leftPosition = ref? `${ref.current.getBoundingClientRect().left - leftSubtraction}px`: "";

    return (
        <div className="dropdown-container">
            {props.screen !== false && <div className="screen dropdown-screen" />}
            <div className={`dropdown${className}`} ref={myRef} style={{ 
                transform: state.transform, 
                opacity: state.opacity,
                top: topPosition,
                left: leftPosition }}>

                { props.children }
            </div>
        </div>
    )
});
export default DropdownContainer;