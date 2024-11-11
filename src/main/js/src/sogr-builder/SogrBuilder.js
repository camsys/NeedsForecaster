import React, { useState, useEffect } from "react";
import {Container, Table} from 'react-bootstrap';
import {DropdownInput} from "../lib/DropdownInput";
import {toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'react-toastify/dist/ReactToastify.css';
import './SogrBuilder.css'

export const SogrBuilder = () => {
    let [organizations, setOrganizations] = useState([]);
    let [fiscalYears, setFiscalYears] = useState([]);
    let [assetTypes, setAssetTypes] = useState([]);
    let [loading, setLoading] = useState(false);
    let [showInfo, setShowInfo] = useState(true);
    let [formData, setFormData] = useState({});
    let [builderRunning, setBuilderRunning] = useState(null);

    const toggleAssetType = (assetType) => {
        let currentAssetTypes = formData["assetTypes"] || [];

        if (currentAssetTypes?.includes(assetType)) {
            currentAssetTypes = currentAssetTypes.filter(t => t !== assetType);
        } else {
            currentAssetTypes.push(assetType);
        }
        setFormData({...formData, assetTypes: currentAssetTypes});
    }

    const runSogr = () => {
        setBuilderRunning(true);
        console.log("Running SOGR using form data:");
        Object.keys(formData).forEach(d=>console.log(`${d}: ${formData[d]}`));
        setTimeout(()=>{
            setBuilderRunning(false);
            console.log("Builder finished.");
        }, 5000);
    }

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            credentials: "include"
        };

        const fetchOrgs = () => {
            setLoading(true);
            fetch("/api/orgs", requestOptions)
                .then((response) => {
                    return response
                        .json()
                        .then((data) => {
                            setOrganizations(data);
                            setLoading(false);
                        })
                })
                .catch((e) => {
                    setLoading(false);
                    toast.error("Could not retrieve organizations.");
                });
        }

        const fetchFiscalYears = () => {
            setLoading(true);
            fetch("/api/projects/fiscal-years", requestOptions)
                .then((response) => {
                    return response
                        .json()
                        .then((data) => {
                            setFiscalYears(data);
                            setLoading(false);
                        })
                })
                .catch((e) => {
                    setLoading(false);
                    toast.error("Could not retrieve fiscal years.");
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

        fetchOrgs();
        fetchFiscalYears();
        fetchAssetTypes();
    }, []);

    return (<>
        {loading && <div className="spinner-container"><div className={"spinner"}></div></div>}
        <Container id={"sogr-builder-page"}>
            <div className={"page-header"}>
                <h1>SOGR Project Builder</h1>
                <div className={"sogr-info-toggle"} hidden={showInfo}>
                    <FontAwesomeIcon icon={"circle-info"} onClick={()=>setShowInfo(true)}/>
                </div>
            </div>
            <div className={"sogr-builder-info-container"} hidden={!showInfo}>
                <div className={"sogr-builder-info"}>
                    <p>The SOGR Capital Projects Analyzer analyzes the capital inventory for your organization and generates a set of replacement and rehabilitation capital projects which are added to the capital needs list.</p>
                    <p>This analyzer uses your current Policy to determine when assets will be replaced and/or rehabiltated.</p>
                </div>
                <div className={"sogr-builder-info"}>
                    <p>Once the builder has completed, you will need to review each capital project and update:</p>
                    <ul>
                        <li>Description of the project</li>
                        <li>Justification for the project</li>
                    </ul>
                </div>
                <div className={"sogr-info-toggle"}>
                    <FontAwesomeIcon icon={"circle-xmark"} onClick={()=>setShowInfo(false)}/>
                </div>
            </div>
            <div className={`sogr-builder-form${builderRunning ? " disabled" : ""}`}>
                <div className={"sogr-builder-dropdowns"}>
                    <DropdownInput name={"organization"} label={"Organization"} options={organizations.map(o => ({key: o.orgKey, value: o.orgKey, name: o.name}))} includeBlank={"Select"} handleChange={(e)=>setFormData({...formData, organization: e.target.value})} disabled={builderRunning}/>
                    <DropdownInput name={"starting-fy"} label={"Starting Fiscal Year"} options={fiscalYears.map(fy => ({key: `fy_${fy.toString()}`, value: fy, name: fy.toString()}))} includeBlank={"Select"} handleChange={(e)=>setFormData({...formData, startingFy: e.target.value})} disabled={builderRunning}/>
                    <DropdownInput name={"range-of-years"} label={"Range of Years"} options = {[...Array(10).keys()].map(n => ({key: `${n+1}_years`, value: n+1, name: `${n+1} ${n > 0 ? 'years' : 'year'}`}))} includeBlank={"Select"} handleChange={(e)=>setFormData({...formData, rangeOfYears: e.target.value})} disabled={builderRunning}/>

                </div>
                <div className={"sogr-builder-asset-types"}>
                    {assetTypes.map(t=>(
                        <div className={"asset-type-group"} onClick={(builderRunning ? void(0) : (e)=>toggleAssetType(t.key))}>
                            <FontAwesomeIcon icon={formData["assetTypes"]?.includes(t.key) ? 'fa-solid fa-square-check' : 'fa-regular fa-square'}/>
                            <p className={formData["assetTypes"]?.includes(t.key) ? "selected" : ""}>{t.name}</p>
                        </div>))
                    }
                </div>
                <div className={"run-sogr-builder-container"}>
                    <button className={"primary-button"} disabled={!["organization","startingFy","rangeOfYears","assetTypes"].every(field=>(Array.isArray(formData[field]) ? formData[field].length > 0 : !!formData[field])) || builderRunning} onClick={runSogr}><FontAwesomeIcon icon="circle-play" /><p>Run SOGR Builder</p></button>
                </div>
            </div>
            <div className={"sogr-builder-status-container"}>
                {builderRunning !== null && (<>
                    <p className={"sogr-builder-status"}><FontAwesomeIcon icon={builderRunning ? "fa-regular fa-hourglass-half" : "circle-check"}/>{builderRunning ? "SOGR Builder Running" : "SOGR Builder Completed"}</p>
                    {builderRunning ?
                        <Table className={"sogr-builder-params"}>
                            <thead>
                                <tr>
                                    <th>Organization</th>
                                    <th>Starting FY</th>
                                    <th>Range of Years</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{organizations.find(o => o.orgKey === formData["organization"]).name}</td>
                                    <td>{formData["startingFy"]}</td>
                                    <td>{`${formData["rangeOfYears"]} years`}</td>
                                </tr>
                            </tbody>
                        </Table>
                    :
                        <p className={"sogr-builder-finished-message"}><b>{formData["rangeOfYears"]} SOGR capital projects</b> added to <b>{organizations.find(o => o.orgKey === formData["organization"]).name}</b></p>
                    }
                </>)}
            </div>
        </Container></>
    );
}
