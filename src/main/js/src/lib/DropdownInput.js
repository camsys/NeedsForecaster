import React from "react";

export const DropdownInput = ({name, label, options, handleChange, defaultValue, includeBlank, noArrow, disabled}) => {
    if (includeBlank && !options.some(o => o.value === "")) {
        options.unshift({key: null, value: "", name: includeBlank});
    }

    return (
        <div className={"dropdown-group " + (name ? `${name}-group` : "")}>
            {!!label && <label>{label}</label>}
            <select name={name} className={noArrow ? "dropdown-without-arrow" : ""} onChange={handleChange && (e => handleChange(e))} disabled={disabled} value={defaultValue}>
                {options && options.map(o => <option key={o?.key} value={o?.value}>{o?.name}</option>)}
            </select>
        </div>
    );
}