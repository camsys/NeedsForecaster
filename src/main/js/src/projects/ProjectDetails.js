import React, { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Container, Table} from 'react-bootstrap';
import {DropdownInput} from "../lib/DropdownInput";
import {ActionsButton} from "../lib/ActionsButton";
import {toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'react-toastify/dist/ReactToastify.css';
import './ProjectDetails.css'
import {IconInput} from "../lib/IconInput";
import {Link} from "react-router-dom";
import {FullTable} from "../lib/FullTable";

export const ProjectDetails = ({mode}) => {
    const navigate = useNavigate();
    let [projectId, setProjectId] = useState(useParams().projectId);
    let [project, setProject] = useState({});
    let [organizations, setOrganizations] = useState([]);
    let [fiscalYears, setFiscalYears] = useState([]);
    let [projectTypes, setProjectTypes] = useState([]);
    let [assetTypes, setAssetTypes] = useState([]);
    let [assets, setAssets] = useState([]);
    let [loading, setLoading] = useState(false);
    let [formData, setFormData] = useState({
        name: null,
        ownerOrganization: null,
        fiscalYear: null,
        projectType: null,
        description: null
    });

    const fetchProject = () => {
        const requestOptions = {
            method: "GET",
            credentials: "include"
        };
        if (projectId) {
            setLoading(true);
            fetch(`/api/projects/${projectId}`, requestOptions)
                .then((response) => {
                    if (!response.ok) {throw Error}
                    return response
                        .json()
                        .then((data) => {
                            setProject(data);
                            if (mode !== "add") {
                                setFormData({
                                    name: data.name,
                                    ownerOrganization: data.ownerOrganization,
                                    fiscalYear: data.fiscalYear,
                                    projectType: data.projectType,
                                    description: data.description
                                });
                            }
                            setLoading(false);
                        })
                })
                .catch((e) => {
                    setLoading(false);
                    toast.error("Could not retrieve project.");
                });
        }
    }

    const saveProject = () => {
        const requestOptions = {
            method: mode === "add" ? "POST" : "PUT",
            credentials: "include",
            headers: {"Content-Type": "Application/JSON"},
            body: JSON.stringify(formData)
        };

        setLoading(true);
        fetch(`/api/projects/${mode === "add" ? "new" : projectId}`, requestOptions)
            .then((response) => {
                if (!response.ok) {throw Error}
                return response
                    .json()
                    .then((data) => {
                        navigate(`/projects/${data.id}`);
                        if (!projectId) {
                            setProjectId(data.id);
                        } else {
                            fetchProject();
                        }
                        setLoading(false);
                    })
            })
            .catch((e) => {
                setLoading(false);
                toast.error("Could not save project.");
            });
    }

    const tableColumnDefs = {
        "assetId": {label: "Asset ID", visible: true},
        "assetTypeKey": {label: "Type", visible: true},
        "assetSubTypeKey": {label: "Subtype", visible: true},
        "inServiceDate": {label: "In Service Date", visible: true},
        "odometer": {label: "Odometer", visible: true},
        "condition": {label: "Condition", visible: true},
        "vin": {label: "VIN", visible: true},
        "name": {label: "Name", visible: true},
        "description": {label: "Description", visible: true}
    }

    const formatTableData = (column, data) => {
        switch (column) {
            case "assetTypeKey":
                return assetTypes?.filter(t=>t.key===data)[0]?.name;
            case "inServiceDate":
                return new Date(data).toLocaleDateString('en-US', {timeZone: 'UTC'});
            default:
                return data;
        }
    }

    const executeSearch = (query) => {
        return assets.filter(a => (a.assetId.toLowerCase().includes(query.toLowerCase())));
    }

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            credentials: "include"
        };
        const fetchAssetTypes = () => {
            fetch("/api/asset-types", requestOptions)
                .then((response) => {
                    if (!response.ok) {throw Error}
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
        const fetchOrgs = () => {
            setLoading(true);
            fetch("/api/orgs", requestOptions)
                .then((response) => {
                    if (!response.ok) {throw Error}
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
                    if (!response.ok) {throw Error}
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
        const fetchProjectTypes = () => {
            setLoading(true);
            fetch("/api/projects/types", requestOptions)
                .then((response) => {
                    if (!response.ok) {throw Error}
                    return response
                        .json()
                        .then((data) => {
                            setProjectTypes(data);
                            setLoading(false);
                        })
                })
                .catch((e) => {
                    setLoading(false);
                    toast.error("Could not retrieve project types.");
                });
        }
        fetchAssetTypes();
        fetchProject();
        fetchOrgs();
        fetchFiscalYears();
        fetchProjectTypes();
    }, []);

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    useEffect(() => {
        if (project?.sogr) {
            setAssets(project?.assets);
        }
    }, [project]);

    return (<>
            {loading && <div className="spinner-container"><div className={"spinner"}></div></div>}
            <Container id={mode === "view" ? "project-details-page" : "project-form-page"}>
                <div className={"page-header"}>
                    {mode === "view" && <>
                        <div className={"page-header-left"}>
                            <span className={"breadcrumbs"}><Link to={"/projects"}>Projects</Link><FontAwesomeIcon icon={"angle-right"}/></span>
                            <h1>{project?.name}</h1>
                        </div>
                        <Link to={`/projects/${projectId}/edit`}><button className={"primary-button"}><FontAwesomeIcon icon="pencil" /><p>Edit</p></button></Link></>
                    }
                    {["edit", "add"].includes(mode) && <>
                        <h1>{mode === "edit" ? <><b>Editing:</b> {project.name}</> : <>Add Manual Project</>}</h1>
                        <div className={"header-buttons"}>
                        <Link to={mode === "edit" ? `/projects/${projectId}` : "/projects"}><button className={"primary-button cancel-button"}><FontAwesomeIcon icon="xmark" /><p>Cancel</p></button></Link>
                        <button className={"primary-button"} disabled={!["name","ownerOrganization","fiscalYear","projectType","description"].every(field=>(!!formData[field]))} onClick={saveProject}><FontAwesomeIcon icon="floppy-disk" /><p>Save</p></button>
                        </div></>
                    }
                </div>
                {mode === "view" && <>
                    <div className={"project-info-container"}>
                        <div className={"project-info"}>
                            <div className={"label-and-info"}>
                                <h2>Organization</h2>
                                <p className={"info-text"}>{organizations.filter(o => (o.orgKey === project?.ownerOrganization))[0]?.name}</p>
                            </div>
                            <div className={"label-and-info"}>
                                <h2>FY</h2>
                                <p className={"info-text"}>{project?.fiscalYear}</p>
                            </div>
                            <div className={"label-and-info"}>
                                <h2>Type</h2>
                                <p className={"info-text"}>{project?.projectType}</p>
                            </div>
                            <div className={"label-and-info"}>
                                <h2>Description</h2>
                                <p className={"info-text"}>{project?.description}</p>
                            </div>
                        </div>
                    </div>
                </>
                }
                {["edit", "add"].includes(mode) && <>
                    <div className={"project-form"}>
                        <div className={"project-form-left"}>
                            <div className={"input-group"}>
                                <label>Title</label>
                                <input key={"name"} value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})}/>
                            </div>
                            <div className={"project-form-dropdowns"}>
                                <DropdownInput name={"owner-organization"} label={"Organization"} options={organizations.map(o => ({key: o.orgKey, value: o.orgKey, name: o.name}))} includeBlank={"Select"} handleChange={(e)=>setFormData({...formData, ownerOrganization: e.target.value})} defaultValue={formData.ownerOrganization || ''} disabled={mode === "edit"}/>
                                <DropdownInput name={"fiscal-year"} label={"FY"} options={fiscalYears.map(fy => ({key: `fy_${fy.toString()}`, value: fy, name: fy.toString()}))} includeBlank={"Select"} handleChange={(e)=>setFormData({...formData, fiscalYear: e.target.value})} defaultValue={formData.fiscalYear || ''} disabled={project.sogr}/>
                                <DropdownInput name={"project-type"} label={"Type"} options={projectTypes.map(t => ({key: t, value: t, name: t}))} includeBlank={"Select"} handleChange={(e)=>setFormData({...formData, projectType: e.target.value})} defaultValue={formData.projectType || ''} disabled={project.sogr}/>
                            </div>
                        </div>
                        <div className={"project-form-right"}>
                            <div className={"input-group"}>
                                <label>Description</label>
                                <textarea key={"description"} value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})}/>
                            </div>
                        </div>
                    </div></>
                }
                {project?.sogr && <FullTable
                    records={assets}
                    columnDefs={tableColumnDefs}
                    columnsSelectable={true}
                    rowsSelectable={false}
                    defaultPageSize={10}
                    tableFormatter={formatTableData}
                    handleSearch={executeSearch}
                    searchPlaceholder={"Search Table..."}
                    searchPosition={"actions"}
                />}
            </Container></>
    );
}