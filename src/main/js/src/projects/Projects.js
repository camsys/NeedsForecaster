import React, { useState, useEffect } from "react";
import {Container, Table} from 'react-bootstrap';
import {DropdownInput} from "../lib/DropdownInput";
import {ActionsButton} from "../lib/ActionsButton";
import {toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'react-toastify/dist/ReactToastify.css';
import './Projects.css'
import {IconInput} from "../lib/IconInput";
import {FullTable} from "../lib/FullTable";
import {Link, useSearchParams} from "react-router-dom";

export const Projects = () => {
    let [organizations, setOrganizations] = useState([]);
    let [fiscalYears, setFiscalYears] = useState([]);
    let [projectTypes, setProjectTypes] = useState([]);
    let [projects, setProjects] = useState([]);
    let [selectedProject, setSelectedProject] = useState(null);
    let [loading, setLoading] = useState(false);
    let [showModal, setShowModal] = useState(false);
    let [searchParams, setSearchParams] = useSearchParams();
    const runId = searchParams.get("runId");

    const exportActionsMenuItems = [
        {
            text: "Dummy Export",
            href: void(0),
            icon: null,
            handleClick: ()=>console.log("Not really exporting table.")
        }
    ]

    const tableColumnDefs = {
        "ownerOrganization": {label: "Organization", visible: true},
        "fiscalYear": {label: "FY", visible: true},
        "name": {label: "Title", visible: true},
        "description": {label: "Project Description", visible: true},
        "sogr": {label: "SOGR", visible: true, className: "icon-column"},
        "projectType": {label: "Type", visible: true}
    }

    let tableFilters = [
        {name: "ownerOrganization", label: "Organization", options: organizations?.map(o => ({key: o.orgKey, value: o.orgKey, name: o.name})), includeBlank: "Select"},
        {name: "fiscalYear", label: "FY", options: fiscalYears?.map(fy => ({key: `fy_${fy.toString()}`, value: fy, name: fy.toString()})), includeBlank: "Select"},
        {name: "sogr", label: "SOGR", options: [{key: "sogr_true", value: true, name: "Yes"},{key: "sogr_false", value: false, name: "No"}], includeBlank: "Select"},
        {name: "projectType", label: "Type", options: projectTypes.map(t => ({key: t, value: t, name: t})), includeBlank: "Select"}
    ]

    const fetchProjectsWithFilters = (filters) => {
        const requestOptions = {
            method: "POST",
            credentials: "include",
            body: Object.keys(filters).length > 0 ? JSON.stringify(filters) : null,
            headers: {"Content-Type": "Application/JSON"}
        };

        setLoading(true);
        fetch(`/api/projects${runId ? `?runId=${runId}` : ""}`, requestOptions)
            .then((response) => {
                if (!response.ok) {throw Error}
                return response
                    .json()
                    .then((data) => {
                        setProjects(data);
                        setLoading(false);
                    })
            })
            .catch((e) => {
                setLoading(false);
                toast.error("Could not retrieve projects.");
            });
    }

    const formatTableData = (column, data) => {
        switch (column) {
            case 'sogr':
                return data && <FontAwesomeIcon icon={'circle-check'} />;
            case 'ownerOrganization':
                return organizations.filter(o=>(o.orgKey === data))[0]?.name;
            default:
                return data;
        }
    }

    // const selectProject = (project) => {
    //     selectedProjects.includes(project) ? setSelectedProjects(selectedProjects.filter(p => p != project)) : setSelectedProjects([...selectedProjects, project]);
    // }

    const confirmDelete = (projectId) => {
        setSelectedProject(projectId);
        setShowModal(true);
    }

    const deleteProject = (projectId) => {
        const requestOptions = {
            method: "DELETE",
            credentials: "include"
        };
        setLoading(true);
        fetch(`/api/projects/${projectId}`, requestOptions)
        .then((response) => {
            if (!response.ok) {throw Error}

            let updatedProjectsList = projects.filter(p=>(p.id !== projectId));
            setProjects(updatedProjectsList);
            setSelectedProject(null);
            setShowModal(false);
            setLoading(false);
        })
        .catch((e) => {
            setLoading(false);
            toast.error("Could not delete project.");
        });
    }

    const executeSearch = (query) => {
        return projects.filter(p => (p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase())));
    }

    const tableRowActions = (project) => {
        return (
            <td className={"actions-cell"}>
                <div className={"column-actions-container"}>
                    <Link to={`/projects/${project.id}`}><FontAwesomeIcon icon={"fa-eye"} title={"View Project"}/></Link>
                    <Link to={`/projects/${project.id}/edit`}><FontAwesomeIcon icon={"fa-pencil"} title={"Edit Project"}/></Link>
                    <FontAwesomeIcon icon={"fa-trash-can"} title={"Delete Project"} onClick={()=>confirmDelete(project.id)}/>
                </div>
            </td>
        );
    }

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            credentials: "include"
        };

        const fetchOrgs = () => {
            fetch("/api/orgs", requestOptions)
            .then((response) => {
                if (!response.ok) {throw Error}
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

        const fetchFiscalYears = () => {
            fetch("/api/projects/fiscal-years", requestOptions)
            .then((response) => {
                if (!response.ok) {throw Error}
                return response
                    .json()
                    .then((data) => {
                        setFiscalYears(data);
                    })
            })
            .catch((e) => {
                toast.error("Could not retrieve fiscal years.");
            });
        }

        const fetchProjectTypes = () => {
            fetch("/api/projects/types", requestOptions)
                .then((response) => {
                    if (!response.ok) {throw Error}
                    return response
                        .json()
                        .then((data) => {
                            setProjectTypes(data);
                        })
                })
                .catch((e) => {
                    toast.error("Could not retrieve organizations.");
                });
        }
        fetchOrgs();
        fetchFiscalYears();
        fetchProjectTypes();
    }, []);

    useEffect(() => {
        fetchProjectsWithFilters({});
    }, [runId]);

    return (<>
        {loading && <div className="spinner-container"><div className={"spinner"}></div></div>}
        {showModal && <div className={"modal-container"}>
            <div className={"modal-frame"}>
                <div className={"modal"}>
                    <h2 className={"modal-header"}>Delete Project</h2>
                    <p>Are you sure you want to delete this project?</p>
                    <div className={"modal-buttons"}><button className={"primary-button"} onClick={()=>setShowModal(false)}>Cancel</button><button className={"primary-button danger-button"} onClick={()=>deleteProject(selectedProject)}>Delete</button></div>
                </div>
            </div>
        </div>}
        <Container id={"projects-page"}>
            <div className={"page-header"}>
                <h1>Projects</h1>
                <Link to={"/projects/new"}><button className={"primary-button"}><FontAwesomeIcon icon="plus-circle" /><p>Add Project</p></button></Link>
            </div>
            <FullTable
                records={projects}
                columnDefs={tableColumnDefs}
                columnsSelectable={true}
                filterDefs={!runId ? tableFilters : null}
                handleFilters={fetchProjectsWithFilters}
                customFilterElems={runId &&
                    <div className={"sogr-run-filter-explanation"}>
                        <p>The project list has been automatically filtered to show only the projects associated with the selected SOGR Project Builder run.</p>
                        <p>To return to the unfiltered list of all projects, please click the button below:</p>
                        <Link to={"/projects"}><button className={"primary-button"}>Return to full projects list</button></Link>
                    </div>}
                rowsSelectable={false}
                defaultPageSize={10}
                tableFormatter={formatTableData}
                handleSearch={!runId ? executeSearch : null}
                searchPlaceholder={"Search project title/description"}
                rowActions={tableRowActions}
            />
        </Container></>
    );
}