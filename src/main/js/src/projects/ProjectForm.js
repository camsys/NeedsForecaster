import React, { useState, useEffect } from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Container} from "react-bootstrap";
import {DropdownInput} from "../lib/DropdownInput";

import './ProjectForm.css'

export const ProjectForm = ({mode}) => {
    const navigate = useNavigate();
    const projectId = useParams().projectId;
    let [project, setProject] = useState({});
    let [formData, setFormData] = useState({
        name: null,
        ownerOrganization: null,
        fiscalYear: null,
        projectType: null,
        description: null
    });
    let [organizations, setOrganizations] = useState([]);
    let [fiscalYears, setFiscalYears] = useState([]);
    let [projectTypes, setProjectTypes] = useState([]);
    let [loading, setLoading] = useState(false);

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
                    })
            })
            .catch((e) => {
                setLoading(false);
                toast.error("Could not save project.");
            });
    }

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            credentials: "include",
            headers: {"Content-Type": "Application/JSON"}
        };
        const fetchProject = () => {
            if (projectId) {
                setLoading(true);
                fetch(`/api/projects/${projectId}`, requestOptions)
                    .then((response) => {
                        if (!response.ok) {throw Error}
                        return response
                            .json()
                            .then((data) => {
                                setProject(data);
                                setFormData({
                                    name: data.name,
                                    ownerOrganization: data.ownerOrganization,
                                    fiscalYear: data.fiscalYear,
                                    projectType: data.projectType,
                                    description: data.description
                                });
                                setLoading(false);
                            })
                    })
                    .catch((e) => {
                        setLoading(false);
                        toast.error("Could not retrieve project.");
                    });
            }
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
        fetchProject();
        fetchOrgs();
        fetchFiscalYears();
        fetchProjectTypes();
    }, [])

    return (<>
        {loading && <div className="spinner-container"><div className={"spinner"}></div></div>}
        <Container id={"project-form-page"}>
            <div className={"page-header"}>
                <h1>{mode === "edit" ? <><b>Editing:</b> {project.name}</> : <>Add Manual Project</>}</h1>
                <div className={"header-buttons"}>
                    <Link to={mode === "edit" ? `/projects/${projectId}` : "/projects"}><button className={"primary-button cancel-button"}><FontAwesomeIcon icon="xmark" /><p>Cancel</p></button></Link>
                    <button className={"primary-button"} disabled={!["name","ownerOrganization","fiscalYear","projectType","description"].every(field=>(!!formData[field]))} onClick={saveProject}><FontAwesomeIcon icon="floppy-disk" /><p>Save</p></button>
                </div>
            </div>
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
            </div>
        </Container>
    </>);
}