import React, { useState, useEffect } from "react";
import {Container} from 'react-bootstrap';
import {DropdownInput} from "../lib/DropdownInput";
import {ActionsButton} from "../lib/ActionsButton";

import 'react-toastify/dist/ReactToastify.css';
import './Policies.css'

export const Policies = () => {
    let [organizations, setOrganizations] = useState([
        {label: "BPT-PennDOT Bureau of Public Transportation", value: "BPT-PennDOT Bureau of Public Transportation"},
        {label: "Organization 2", value: "Organization 2"},
        {label: "Other Organization", value: "Other Organization"}
    ]);
    let [policies, setPolicies] = useState([
        {label: "FY 2017 Statewide Transit Policy (Current)", value: "FY 2017 Statewide Transit Policy (Current)"},
        {label: "FY 2016 Statewide Transit Policy", value: "FY 2016 Statewide Transit Policy"},
        {label: "FY 2015 Statewide Transit Policy", value: "FY 2015 Statewide Transit Policy"}
    ]);
    let [selectedOrganization, setSelectedOrganization] = useState(organizations[0].label);
    let [selectedPolicy, setSelectedPolicy] = useState(policies[0].label);
    let [selectedAssetType, setSelectedAssetType] = useState("Administration");

    const changePolicy = (e) => {
        setSelectedPolicy(e.target.value);
    }

    const changeOrganization = (e) => {
        setSelectedOrganization(e.target.value);
    }

    const selectAssetType = (e) => {
        setSelectedAssetType(e.target.innerText);
    }

    return (
        <Container id={"policies-page"}>
            <div className={"page-header"}>
                <h1>Policies</h1>
            </div>
            <div className={"top-filters"}>
                <h2>Filters</h2>
                <div className={"filters-container"}>
                    <DropdownInput name={"organization"} label={"Organization"} options={organizations} handleChange={changeOrganization} />
                    <DropdownInput name={"policy"} label={"Policy"} options={policies} handleChange={changePolicy}/>
                </div>
            </div>
            <div className={"policy-info-container"}>
                <div className={"policy-info"}>
                    <div className={"label-and-info"}>
                        <h2>Status</h2>
                        <p className={"info-text"}>Active</p>
                    </div>
                    <div className={"label-and-info"}>
                        <h2>Policy Owner</h2>
                        <p className={"info-text"}>{selectedOrganization}</p>
                    </div>
                    <div className={"label-and-info"}>
                        <h2>Description</h2>
                        <p className={"info-text"}>{selectedPolicy}</p>
                    </div>
                </div>
                <div className={"actions-container"}>
                    <ActionsButton />
                </div>
            </div>
            <div className={"policy-rules-container"}>
                <h2>Policy Rules</h2>
                <div className={"policy-rules-type-selector"}>
                    <div className={"policy-rules-types"}>
                        <button className={"policy-rules-type-button" + (selectedAssetType==="Administration" ? " selected" : "")} onClick={selectAssetType}>Administration</button>
                        <button className={"policy-rules-type-button" + (selectedAssetType==="Buses (Rubber Tire Vehicles)" ? " selected" : "")} onClick={selectAssetType}>Buses (Rubber Tire Vehicles)</button>
                        <button className={"policy-rules-type-button" + (selectedAssetType==="Capital Equipment" ? " selected" : "")} onClick={selectAssetType}>Capital Equipment</button>
                        <button className={"policy-rules-type-button" + (selectedAssetType==="Ferries" ? " selected" : "")} onClick={selectAssetType}>Ferries</button>
                        <button className={"policy-rules-type-button" + (selectedAssetType==="Maintenance" ? " selected" : "")} onClick={selectAssetType}>Maintenance</button>
                        <button className={"policy-rules-type-button" + (selectedAssetType==="Other Passenger Vehicles" ? " selected" : "")} onClick={selectAssetType}>Other Passenger Vehicles</button>
                        <button className={"policy-rules-type-button" + (selectedAssetType==="Parking" ? " selected" : "")} onClick={selectAssetType}>Parking</button>
                        <button className={"policy-rules-type-button" + (selectedAssetType==="Passenger" ? " selected" : "")} onClick={selectAssetType}>Passenger</button>
                        <button className={"policy-rules-type-button" + (selectedAssetType==="Rail Cars" ? " selected" : "")} onClick={selectAssetType}>Rail Cars</button>
                    </div>
                    <div className={"policy-rules-additional-types"}>
                        <button className={"policy-rules-ellipses"}>...</button>
                    </div>
                </div>
                <div className={"policy-calculation-method"}>
                    <div className={"table-headers"}>
                        <label className={"table-label"}>Service Life Calculation Method</label>
                        <label className={"table-label"}>Last Updated</label>
                        <label className={"table-label"}>Actions</label>
                    </div>
                    <div className={"table-rows"}>
                        <p>Age Only</p>
                        <p>12/05/2015 07:58 AM</p>
                        <button>(Pencil Icon)</button>
                    </div>
                </div>
            </div>
        </Container>
    );
}
