import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faChevronDown } from '@fortawesome/free-solid-svg-icons'

import './ActionsButton.css';

export const ActionsButton = ({actions}) => {
    let [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <button className={`actions-button primary-button${menuOpen ? " menu-open" : ""}`} name={"actions"} onClick={()=>setMenuOpen(!menuOpen)}><FontAwesomeIcon icon={faPencil} />Actions<FontAwesomeIcon icon={faChevronDown} /></button>
            <div className={`actions-button-menu${menuOpen ? " menu-open" : ""}`} name={"actions-button-menu"}>
                {actions?.map(action => <a className={`actions-menu-item${menuOpen ? " menu-open" : ""}`} href={action.href} onClick={action.handleClick}><FontAwesomeIcon icon={action.icon} />{action.text}</a>)}
            </div>
        </>
    );
}