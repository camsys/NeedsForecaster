import React, { useState, useEffect } from "react";
import {Container, Table} from 'react-bootstrap';
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
    let [assetTypes, setAssetTypes] = useState([
        "Administration",
        "Buses (Rubber Tire Vehicles)",
        "Capital Equipment",
        "Ferries",
        "Maintenance",
        "Other Passenger Vehicles",
        "Parking",
        "Passenger",
        "Rail Cars"
    ])

    let [assetSubtypes, setAssetSubtypes] = useState({
            "Administration": {
                "Hardware": {esl_months: 48, esl_miles: 48},
                "Software": {esl_months: 48, esl_miles: 24},
                "Networks": {esl_months: 144, esl_miles: 48},
                "Custom Rule": {esl_months: 96, esl_miles: 96},
                "Storage": {esl_months: 144, esl_miles: 48},
                "Other IT Equipment": {esl_months: 144, esl_miles: 48}
            }
        }
    )

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
                        {assetTypes.map((t,i) => <button key={i} className={"policy-rules-type-button" + (selectedAssetType === t ? " selected" : "")} onClick={selectAssetType}>{t}</button>)}
                    </div>
                    <div className={"policy-rules-additional-types"}>
                        <button className={"policy-rules-ellipses"}>...</button>
                    </div>
                </div>
                <div className={"policy-calculation-method"}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Service Life Calculation Method</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Age Only</td>
                                <td>12/05/2015 07:58 AM</td>
                                <td><button>(Pencil Icon)</button></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div className={"policy-asset-subtype-rules"}>
                    <Table id={"subtype-rules-table"}>
                        <thead>
                            <tr>
                                <th>Asset Subtype</th>
                                <th>ESL (Mo)</th>
                                <th>ESL (Mi)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assetSubtypes[selectedAssetType] && Object.entries(assetSubtypes[selectedAssetType]).map(([k,v], i) =>
                                <>
                                    <tr key={i}>
                                        <td>{k}</td>
                                        <td>{v.esl_months}</td>
                                        <td>{v.esl_miles}</td>
                                        <td>
                                            <button>(Pencil Icon)</button>
                                            {k.includes("Custom") && (
                                                <>
                                                    <button>(Copy Icon)</button>
                                                    <button>(Delete Icon)</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </Table>
                    <button className={"primary-button"}>(Plus Icon) Add Asset Subtype Rule</button>
                </div>
            </div>
        </Container>
    );
}
