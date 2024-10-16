import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './ActionsButton.css';

export const ActionsButton = ({actions, icon="pencil", label="Actions"}) => {
    let [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className={"actions-container"}>
            <button className={`actions-button primary-button${menuOpen ? " menu-open" : ""}`} name={"actions"} onClick={()=>setMenuOpen(!menuOpen)}><FontAwesomeIcon icon={icon} />{label}<FontAwesomeIcon icon={"chevron-down"} /></button>
            <div className={`actions-button-menu${menuOpen ? " menu-open" : ""}`} name={"actions-button-menu"}>
                {actions?.map(action => <a className={`actions-menu-item${menuOpen ? " menu-open" : ""}`} href={action.href} onClick={action.handleClick}>{!!action.icon && <FontAwesomeIcon icon={action.icon} />}{action.text}</a>)}
            </div>
        </div>
    );
}