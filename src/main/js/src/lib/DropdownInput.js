import React from "react";

export const DropdownInput = ({name, label, options, handleChange}) => {
    return (
        <div className={"dropdown-group"}>
            <label>{label}</label>
            <select name={name} onChange={handleChange && (e => handleChange(e))}>
                {options && options.map(o => <option key={o?.key} value={o?.key}>{o?.name}</option>)}
            </select>
        </div>
    );
}