import React from "react";

export const DropdownInput = ({name, label, options, handleChange, defaultValue, includeBlank}) => {
    if (includeBlank) {
        options.unshift({key: null, value: null, name: includeBlank});
    }

    return (
        <div className={"dropdown-group"}>
            {!!label && <label>{label}</label>}
            <select name={name} onChange={handleChange && (e => handleChange(e))} value={defaultValue || options[0]?.value}>
                {options && options.map(o => <option key={o?.key} value={o?.value}>{o?.name}</option>)}
            </select>
        </div>
    );
}