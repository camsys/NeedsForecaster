import React from "react";

export const DropdownInput = ({name, label, options, handleChange}) => {
    return (
        <div className={"dropdown-group"}>
            <label>{label}</label>
            <select name={name} onChange={handleChange && (e => handleChange(e))}>
                {options && options.map(o => <option key={o?.value} value={o?.value}>{o?.label}</option>)}
            </select>
        </div>
    );
}