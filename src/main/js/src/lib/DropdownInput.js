import React from "react";

export const DropdownInput = ({name, label, options, handleChange, defaultValue}) => {
    return (
        <div className={"dropdown-group"}>
            {!!label && <label>{label}</label>}
            <select name={name} onChange={handleChange && (e => handleChange(e))} value={defaultValue || options[0]?.key}>
                {options && options.map(o => <option key={o?.key} value={o?.key}>{o?.name}</option>)}
            </select>
        </div>
    );
}