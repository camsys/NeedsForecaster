import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const IconInput = ({icon, name, type, label, handleChange, value, placeholder}) => {
    return (
        <div className={"icon-input-group"}>
            {!!label && <label>{label}</label>}
            <div className={"icon-input"}>
                {!!icon && <FontAwesomeIcon icon={icon}/>}
                <input name={name} type={type} onChange={handleChange && (e => handleChange(e))} value={value} placeholder={placeholder}/>
            </div>
        </div>
    );
}