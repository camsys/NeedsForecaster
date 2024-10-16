import React, { useState, useEffect } from "react";
import {Container, Table} from 'react-bootstrap';
import {DropdownInput} from "../lib/DropdownInput";
import {ActionsButton} from "../lib/ActionsButton";
import {toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'react-toastify/dist/ReactToastify.css';
import './Policies.css'

export const Policies = () => {
    let [organizations, setOrganizations] = useState([]);
    let [assetTypes, setAssetTypes] = useState([]);
    let [policies, setPolicies] = useState([]);
    let [selectedOrganization, setSelectedOrganization] = useState('');
    let [loading, setLoading] = useState(false);
    let [selectedPolicy, setSelectedPolicy] = useState({});
    let [selectedAssetType, setSelectedAssetType] = useState({});
    let [selectedPolicyTypeRule, setSelectedPolicyTypeRule] = useState({});
    let [policyFields, setPolicyFields] = useState({description: null});
    let [typeRuleFields, setTypeRuleFields] = useState({serviceLifeCalculationMethod: null});
    let [subtypeRuleFields, setSubtypeRuleFields] = useState({id: null, eslMonths: null, eslMiles: null});

    const getPolicy = (id) => {
        setLoading(true);
        fetch(`/api/policies/${id}`, {
            method: "GET",
            credentials: "include"
        })
        .then((response) => {
            return response
                .json()
                .then((data) => {
                    setSelectedPolicy(data);
                    setLoading(false);
                })
        })
        .catch((e) => {
            setLoading(false);
            toast.error("Could not retrieve policy information.");
        });
    }

    const editPolicy = (policy) => {
        setLoading(true);
        fetch(`/api/policies/${selectedPolicy.id}`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(policy),
            credentials: "include"
        })
            .then((response) => {
                return response
                    .json()
                    .then((data) => {
                        setPolicyFields({description: null});
                        setSelectedPolicy(data);
                        setLoading(false);
                    })
            })
            .catch((e) => {
                setLoading(false);
                toast.error("Could not update policy description.");
            });
    }

    const editPolicyRule = (policyRule) => {
        setLoading(true);
        fetch(`/api/policy-rules/${selectedPolicyTypeRule.id}`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(policyRule),
            credentials: "include"
        })
            .then((response) => {
                return response
                    .json()
                    .then((data) => {
                        setTypeRuleFields({serviceLifeCalculationMethod: null});
                        setSelectedPolicyTypeRule(data);
                        setLoading(false);
                    })
            })
            .catch((e) => {
                setLoading(false);
                toast.error(`Could not update service life calculation method for ${selectedPolicyTypeRule.assetType}.`);
            });
    }

    const editPolicySubRule = (policySubRule) => {
        setLoading(true);
        fetch(`/api/policy-sub-rules/${policySubRule.id}`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(policySubRule),
            credentials: "include"
        })
            .then((response) => {
                return response
                    .json()
                    .then((data) => {
                        setSubtypeRuleFields({id: null, eslMonths: null, eslMiles: null});
                        let newSubTypeRules = selectedPolicyTypeRule.subRules.filter(sr => sr.id !== data.id);
                        newSubTypeRules.push(data);
                        newSubTypeRules.sort((a,b) => a.assetSubType.localeCompare(b.assetSubType));
                        setSelectedPolicyTypeRule({...selectedPolicyTypeRule, subRules: newSubTypeRules});
                        setLoading(false);
                    })
            })
            .catch((e) => {
                setLoading(false);
                toast.error(`Could not update policy subtype rule.`);
            });
    }

    const copyPolicy = () => {
        console.log("copying policy");
    }

    const defaultActionsMenuItems = [
        {
            text: "Modify this policy",
            href: void(0),
            icon: "pencil",
            handleClick: ()=>setPolicyFields({description: selectedPolicy.description})
        },
        {
            text: "Make a copy",
            href: void(0),
            icon: "clone",
            handleClick: copyPolicy
        }
    ]

    const editingActionsMenuItems = [
        {
            text: "Save policy changes",
            href: void(0),
            icon: "floppy-disk",
            handleClick: ()=>editPolicy(policyFields)
        },
        {
            text: "Cancel policy changes",
            href: void(0),
            icon: "xmark",
            handleClick: ()=>setPolicyFields({description: null})
        }
    ]

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            credentials: "include"
        };

        const fetchOrgs = () => {
            fetch("/api/orgs", requestOptions)
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
        }

        const fetchAssetTypes = () => {
            fetch("/api/asset-types", requestOptions)
            .then((response) => {
                return response
                    .json()
                    .then((data) => {
                        setAssetTypes(data);
                    })
            })
            .catch((e) => {
                toast.error("Could not retrieve asset types.");
            });
        }

        const fetchPolicies = () => {
            fetch(`/api/policies`, requestOptions)
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

        fetchOrgs();
        fetchAssetTypes();
        fetchPolicies();
    }, []);

    useEffect(() => {
        if (policies.length > 0) {
            getPolicy(policies[0].id);
        }
    }, [policies]);

    useEffect(() => {
        setSelectedOrganization(selectedPolicy?.ownerOrganization);
        setSelectedAssetType(assetTypes[0]);
    }, [selectedPolicy]);

    useEffect(() => {
        setSelectedPolicyTypeRule(selectedPolicy?.rules?.filter(r => r?.assetType === selectedAssetType?.key)[0]);
    }, [selectedAssetType]);

    const changePolicy = (e) => {
        getPolicy(e.target.value);
    }

    const selectAssetType = (e) => {
        setSubtypeRuleFields({id: null, eslMonths: null, eslMiles: null})
        setSelectedAssetType(assetTypes.filter(t => t.key === e.target.value)[0]);
    }

    const saveSubtypeRule = (e) => {
        // let selectedSubtype = e.target.closest("tr").children[0].innerText;
        // setAssetSubtypes({...assetSubtypes, [selectedAssetType.key]: {...assetSubtypes[selectedAssetType.key], [selectedSubtype]: {esl_months: subtypeRuleFields.eslMonths, esl_miles: subtypeRuleFields.eslMiles}}});
        // setSubtypeRuleFields({id: null, eslMonths: null, eslMiles: null});
    }

    return (<>
        {loading && <div className="spinner-container"><div className={"spinner"}></div></div>}
        <Container id={"policies-page"}>
            <div className={"page-header"}>
                <h1>Policies</h1>
            </div>
            <div className={"top-filters"}>
                <h2>Filters</h2>
                <div className={"filters-container"}>
                    <DropdownInput name={"policy"} label={"Policy"} options={policies.map(p => ({key: `policy_${p.id}`, value: p.id, name: p.name}))} handleChange={changePolicy}/>
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
                        {policyFields?.description !== null
                            ? <input key={`policy_description`} value={policyFields.description} onChange={(e) => setPolicyFields({...policyFields, description: e.target.value})}/>
                            : <p className={"info-text"}>{selectedPolicy?.description}</p>
                        }
                    </div>
                </div>
                <ActionsButton actions={!policyFields?.description ? defaultActionsMenuItems : editingActionsMenuItems}/>
            </div>
            <div className={"policy-rules-container"}>
                <h2>Policy Rules</h2>
                <div className={"policy-rules-type-selector"}>
                    <div className={"policy-rules-types"}>
                        {assetTypes.map((t,i) => <button key={t.key} value={t.key} className={"policy-rules-type-button" + (selectedAssetType === t ? " selected" : "")} onClick={selectAssetType}>{t.name}</button>)}
                    </div>
                    {/*<div className={"policy-rules-additional-types"}>*/}
                    {/*    <button className={"policy-rules-ellipses"}>...</button>*/}
                    {/*</div>*/}
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
                                <td>
                                    {!!typeRuleFields?.serviceLifeCalculationMethod
                                        ? <DropdownInput name={"service_life_calculation_method"} options={[{key: 'age_only', value: 'Age Only', name: 'Age Only'},{key: 'age_and_mileage', value: 'Age and Mileage', name: 'Age and Mileage'}]} defaultValue={typeRuleFields.serviceLifeCalculationMethod} handleChange={(e) => setTypeRuleFields({...typeRuleFields, serviceLifeCalculationMethod: e.target.value})}/>
                                        : selectedPolicyTypeRule?.serviceLifeCalculationMethod
                                    }
                                </td>
                                <td>{selectedPolicyTypeRule?.updatedOn ? new Date(selectedPolicyTypeRule?.updatedOn)?.toLocaleString() : ''}</td>
                                <td>
                                    {!!typeRuleFields?.serviceLifeCalculationMethod ?
                                        <>
                                            <button onClick={()=>editPolicyRule(typeRuleFields)}><FontAwesomeIcon icon={"floppy-disk"} /></button>
                                            <button onClick={()=>setTypeRuleFields({serviceLifeCalculationMethod: null})}><FontAwesomeIcon icon={"xmark"} /></button>
                                        </>
                                        :
                                        <>
                                            <button onClick={()=>setTypeRuleFields({serviceLifeCalculationMethod: selectedPolicyTypeRule.serviceLifeCalculationMethod})}><FontAwesomeIcon icon={"pencil"} /></button>
                                        </>
                                    }
                                </td>
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
                            {selectedPolicyTypeRule?.subRules?.sort((a,b) => a.assetSubType.localeCompare(b.assetSubType))?.map(sr =>
                                <>
                                    <tr key={sr.id}>
                                        <td>{sr.assetSubType}</td>
                                        <td>{subtypeRuleFields.id === sr.id ? <input key={`esl_months_${sr.id}`} value={subtypeRuleFields.eslMonths} onChange={(e) => setSubtypeRuleFields({...subtypeRuleFields, eslMonths: e.target.value})}/> : sr.eslMonths}</td>
                                        <td>{subtypeRuleFields.id === sr.id ? <input key={`esl_miles_${sr.id}`} value={subtypeRuleFields.eslMiles} onChange={(e) => setSubtypeRuleFields({...subtypeRuleFields, eslMiles: e.target.value})}/> : sr.eslMiles}</td>
                                        <td>
                                            {subtypeRuleFields.id === sr.id ?
                                                <>
                                                    <button onClick={()=>editPolicySubRule(subtypeRuleFields)}><FontAwesomeIcon icon={"floppy-disk"} /></button>
                                                    <button onClick={()=>setSubtypeRuleFields({id: null, eslMonths: null, eslMiles: null})}><FontAwesomeIcon icon={"xmark"} /></button>
                                                </>
                                                :
                                                <>
                                                    <button onClick={()=>setSubtypeRuleFields({id: sr.id, eslMonths: sr.eslMonths, eslMiles: sr.eslMiles})}><FontAwesomeIcon icon={"pencil"} /></button>
                                                </>
                                            }
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </Container></>
    );
}
