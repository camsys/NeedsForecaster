import React from "react";

export const DropdownInput = ({name, label, options, handleChange, defaultValue, includeBlank, noArrow}) => {
    if (includeBlank) {
        options.unshift({key: null, value: "", name: includeBlank});
    }

    return (
        <div className={"dropdown-group"}>
            {!!label && <label>{label}</label>}
            <select name={name} className={noArrow ? "dropdown-without-arrow" : ""} onChange={handleChange && (e => handleChange(e))}>
                {options && options.map(o => <option key={o?.key} value={o?.value}>{o?.name}</option>)}
            </select>
        </div>
    );
}