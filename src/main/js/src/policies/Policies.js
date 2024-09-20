import React, { useState, useEffect } from "react";
import {Container, Table} from 'react-bootstrap';
import {DropdownInput} from "../lib/DropdownInput";
import {ActionsButton} from "../lib/ActionsButton";
import {toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faClone, faPencil, faPlusCircle, faMinusCircle, faFloppyDisk, faXmark} from '@fortawesome/free-solid-svg-icons'

import 'react-toastify/dist/ReactToastify.css';
import './Policies.css'

export const Policies = () => {
    let [organizations, setOrganizations] = useState([]);
    let [policies, setPolicies] = useState([]);
    let [selectedOrganization, setSelectedOrganization] = useState({});
    let [selectedPolicy, setSelectedPolicy] = useState({});
    let [selectedAssetType, setSelectedAssetType] = useState("Administration");
    let [editingSubtypeRule, setEditingSubtypeRule] = useState(null);

    const assetTypes = [
        "Administration",
        "Buses (Rubber Tire Vehicles)",
        "Capital Equipment",
        "Ferries",
        "Maintenance",
        "Other Passenger Vehicles",
        "Parking",
        "Passenger",
        "Rail Cars"
    ];

    let [assetSubtypes, setAssetSubtypes] = useState({
        "Administration": {
            "Hardware": {esl_months: 48, esl_miles: 48},
            "Software": {esl_months: 48, esl_miles: 24},
            "Networks": {esl_months: 144, esl_miles: 48},
            "Custom Rule": {esl_months: 96, esl_miles: 96},
            "Storage": {esl_months: 144, esl_miles: 48},
            "Other IT Equipment": {esl_months: 144, esl_miles: 48}
        }
    });

    const modifyPolicy = () => {
        console.log("modifying policy");
    }

    const copyPolicy = () => {
        console.log("copying policy");
    }

    const actionsMenuItems = [
        {
            text: "Modify this policy",
            href: void(0),
            icon: faPencil,
            handleClick: modifyPolicy
        },
        {
            text: "Make a copy",
            href: void(0),
            icon: faClone,
            handleClick: copyPolicy
        }
    ]

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            credentials: "include"
        };

        fetch("/api/orgs/list", requestOptions)
            .then((response) => {
                return response
                    .json()
                    .then((data) => {
                        setOrganizations(data);
                    })
            })
            .catch((e) => {
                toast.error("Could not retrieve organizations.");
            });
    }, []);

    useEffect(() => {
        setSelectedOrganization(organizations[0]);
    }, [organizations]);

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            credentials: "include"
        };

        if (!!selectedOrganization?.orgKey) {
            fetch(`/api/policies/list${!!selectedOrganization?.orgKey ? '?orgKey=' + selectedOrganization?.orgKey : ''}`, requestOptions)
                .then((response) => {
                    return response
                        .json()
                        .then((data) => {
                            setPolicies(data);
                        })
                })
                .catch((e) => {
                    toast.error("Could not retrieve policies.");
                });
        }
    }, [selectedOrganization]);

    useEffect(() => {
        setSelectedPolicy(policies[0]);
    }, [policies]);

    const changePolicy = (e) => {
        setSelectedPolicy(policies.filter(p => p.id == e.target.value)[0]);
    }

    const changeOrganization = (e) => {
        setSelectedOrganization(organizations.filter(o => o.orgKey === e.target.value)[0]);
    }

    const selectAssetType = (e) => {
        setSelectedAssetType(e.target.innerText);
    }

    const saveSubtypeRule = (e) => {
        // setAssetSubtypes({...assetSubtypes, })
        console.log("not really updating subtype rule");
        setEditingSubtypeRule(null);
    }

    const cloneSubtypeRule = (e) => {
        // setAssetSubtypes({...assetSubtypes, })
        console.log("not really cloning subtype rule");
    }

    const removeSubtypeRule = (e) => {
        // setAssetSubtypes({...assetSubtypes, })
        console.log("not really removing subtype rule");
    }

    const addSubtypeRule = () => {
        console.log(`not really adding subtype rule for ${selectedAssetType} assets in the ${selectedOrganization.name} ${selectedPolicy.name} policy`);
    }

    return (
        <Container id={"policies-page"}>
            <div className={"page-header"}>
                <h1>Policies</h1>
            </div>
            <div className={"top-filters"}>
                <h2>Filters</h2>
                <div className={"filters-container"}>
                    <DropdownInput name={"organization"} label={"Organization"} options={organizations.map(o => ({key: o.orgKey, name: o.name}))} handleChange={changeOrganization} />
                    <DropdownInput name={"policy"} label={"Policy"} options={policies.map(p => ({key: p.id, name: p.name}))} handleChange={changePolicy}/>
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
                        <p className={"info-text"}>{selectedOrganization?.name}</p>
                    </div>
                    <div className={"label-and-info"}>
                        <h2>Description</h2>
                        <p className={"info-text"}>{selectedPolicy?.description}</p>
                    </div>
                </div>
                <div className={"actions-container"}>
                    <ActionsButton actions={actionsMenuItems}/>
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
                                <td><button><FontAwesomeIcon icon={faPencil} /></button></td>
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
                                        <td>{editingSubtypeRule === i ? <input key={`esl_months_${i}`} type={"number"} value={v.esl_months}/> : v.esl_months}</td>
                                        <td>{editingSubtypeRule === i ? <input key={`esl_miles_${i}`} type={"number"} value={v.esl_miles}/> : v.esl_miles}</td>
                                        <td>
                                            {editingSubtypeRule === i ?
                                                <>
                                                    <button onClick={saveSubtypeRule}><FontAwesomeIcon icon={faFloppyDisk} /></button>
                                                    <button onClick={()=>setEditingSubtypeRule(null)}><FontAwesomeIcon icon={faXmark} /></button>
                                                </>
                                                :
                                                <>
                                                    <button onClick={()=>setEditingSubtypeRule(i)}><FontAwesomeIcon icon={faPencil} /></button>
                                                    {k.includes("Custom") &&
                                                        <>
                                                            <button onClick={cloneSubtypeRule}><FontAwesomeIcon icon={faClone} /></button>
                                                            <button onClick={removeSubtypeRule}><FontAwesomeIcon icon={faMinusCircle} /></button>
                                                        </>
                                                    }
                                                </>
                                            }
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </Table>
                    <button className={"primary-button"} onClick={addSubtypeRule}><FontAwesomeIcon icon={faPlusCircle} /><p>Add Asset Subtype Rule</p></button>
                </div>
            </div>
        </Container>
    );
}
