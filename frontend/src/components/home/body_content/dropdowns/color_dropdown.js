import React from "react";
import CheckIcon from '@material-ui/icons/Check';

function ColorDropdown (props) {
    return (
        <div className="colors">
            <h3>Colors</h3>

            {props.forElementBackground? 
                <div className="side-by-side color" onClick={() => 
                    props.change_color("")}>
                    <div className="white square"></div>
                    <p>White</p>
                    {!props.selected_color && <span className="check"><CheckIcon fontSize={'inherit'} /></span>}
                </div> :
                <div className="side-by-side color" onClick={() => 
                    props.change_color('default')}>
                    <div className="default square"></div>
                    <p>Default</p>
                    {props.selected_color === 'default' && <span className="check"><CheckIcon fontSize={'inherit'} /></span>}
                </div>
            }
           
            <div className="side-by-side color" onClick={() => 
                props.change_color('grey')}>
                <div className="grey square"></div>
                <p>Grey</p>
                {props.selected_color === 'grey' && <span className="check"><CheckIcon fontSize={'inherit'} /></span>}
            </div>

            <div className="side-by-side color" onClick={() => 
                props.change_color('brown')}>
                <div className="brown square"></div>
                <p>Brown</p>
                {props.selected_color === 'brown' && <span className="check"><CheckIcon fontSize={'inherit'} /></span>}
            </div>

            <div className="side-by-side color" onClick={() => 
                props.change_color('orange')}>
                <div className="orange square"></div>
                <p>Orange</p>
                {props.selected_color === 'orange' && <span className="check"><CheckIcon fontSize={'inherit'} /></span>}
            </div>

            <div className="side-by-side color" onClick={() => 
                props.change_color('yellow')}>
                <div className="yellow square"></div>
                <p>Yellow</p>
                {props.selected_color === 'yellow' && <span className="check"><CheckIcon fontSize={'inherit'} /></span>}
            </div>

            <div className="side-by-side color" onClick={() => 
                props.change_color('green')}>
                <div className="green square"></div>
                <p>Green</p>
                {props.selected_color === 'green' && <span className="check"><CheckIcon fontSize={'inherit'} /></span>}
            </div>

            <div className="side-by-side color" onClick={() => 
                props.change_color('blue')}>
                <div className="blue square"></div>
                <p>Blue</p>
                {props.selected_color === 'blue' && <span className="check"><CheckIcon fontSize={'inherit'} /></span>}
            </div>

            <div className="side-by-side color" onClick={() => 
                props.change_color('purple')}>
                <div className="purple square"></div>
                <p>Purple</p>
                {props.selected_color === 'purple' && <span className="check"><CheckIcon fontSize={'inherit'} /></span>}
            </div>

            <div className="side-by-side color" onClick={() => 
                props.change_color('pink')}>
                <div className="pink square"></div>
                <p>Pink</p>
                {props.selected_color === 'pink' && <span className="check"><CheckIcon fontSize={'inherit'} /></span>}
            </div>

            <div className="side-by-side color" onClick={() => 
                props.change_color('red')}>
                <div className="red square"></div>
                <p>Red</p>
                {props.selected_color === 'red' && <span className="check"><CheckIcon fontSize={'inherit'} /></span>}
            </div>
        </div>
    )
}
export default ColorDropdown