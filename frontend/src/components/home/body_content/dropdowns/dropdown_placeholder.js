import React, { useEffect } from "react";

const DropdownContentPlaceholder = React.forwardRef((props, ref) => {
    useEffect(() => {
        const rect = ref.current.getBoundingClientRect()

        // If the dropdown is dropping below the window size (meaning we can't see part of it)
        // reverse the direction and have it point upwards
        if (rect.bottom > window.innerHeight || window.innerHeight - rect.bottom < 5) {
            props.set_transform(`translateY(${props.translate_Y || '-95%'})`) 

            // Check if dropdown is past the width of the window size
            if (rect.right > window.innerWidth) {
                props.set_transform(`translateY(${props.translate_Y || '-95%'}) translateX(${props.translate_X || '-20%'})`)
            }
        } else {

            // Check if dropdown is past the width of the window size
            if (rect.right > window.innerWidth) {
                props.set_transform(`translateX(${props.translate_X || '-20%'})`)
            }
        }
        props.set_opacity(100)
    }, []);

    return (
        <div>
            { props.children }
        </div>
    )
});
export default DropdownContentPlaceholder;



