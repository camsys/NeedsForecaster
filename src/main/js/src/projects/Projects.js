import React, { useState, useEffect } from "react";
import {Container, Table} from 'react-bootstrap';
import {DropdownInput} from "../lib/DropdownInput";
import {ActionsButton} from "../lib/ActionsButton";
import {toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'react-toastify/dist/ReactToastify.css';
import './Projects.css'
import {IconInput} from "../lib/IconInput";
import {Link} from "react-router-dom";
import {FullTable} from "../lib/FullTable";

export const Projects = () => {
    // TODO: Add/edit projects in separate page
    // TODO: Fiscal year formatted as YYYY when fiscal year is included in the label context, add FY to beginning when not
    // TODO: Move search bar to filters section and have it search on project name and description

    let [organizations, setOrganizations] = useState([]);
    let [fiscalYears, setFiscalYears] = useState([]);
    let [projectTypes, setProjectTypes] = useState([]);
    let [projects, setProjects] = useState([]);
    let [columns, setColumns] = useState({
        "ownerOrganization": true,
        "fiscalYear": true,
        "name": true,
        "description": true,
        "sogr": true,
        "projectType": true
    });
    let [loading, setLoading] = useState(false);

    const exportActionsMenuItems = [
        {
            text: "Dummy Export",
            href: void(0),
            icon: null,
            handleClick: ()=>console.log("Not really exporting table.")
        }
    ]

    const columnNameLabels = {
        "ownerOrganization": "Organization",
        "fiscalYear": "FY",
        "name": "Title",
        "description": "Project Description",
        "sogr": "SOGR",
        "projectType": "Type"
    }

    const fetchProjectsWithFilters = (filters) => {
        const requestOptions = {
            method: "POST",
            credentials: "include",
            body: Object.keys(filters).length > 0 ? JSON.stringify(filters) : null,
            headers: {"Content-Type": "Application/JSON"}
        };

        setLoading(true);
        fetch(`/api/projects`, requestOptions)
            .then((response) => {
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

    const searchProjects = (query) => {
        setTimeout(()=>{
            return projects.filter(p => (p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase())));
        }, 500);
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

        const fetchProjectTypes = () => {
            setLoading(true);
            fetch("/api/projects/types", requestOptions)
                .then((response) => {
                    return response
                        .json()
                        .then((data) => {
                            setProjectTypes(data);
                            setLoading(false);
                        })
                })
                .catch((e) => {
                    setLoading(false);
                    toast.error("Could not retrieve organizations.");
                });
        }
        fetchOrgs();
        fetchFiscalYears();
        fetchProjectTypes();
        fetchProjectsWithFilters({});
    }, []);

    return (<>
        {loading && <div className="spinner-container"><div className={"spinner"}></div></div>}
        <Container id={"projects-page"}>
            <div className={"page-header"}>
                <h1>Projects</h1>
                <Link to={"/projects/new"}><button className={"primary-button"}><FontAwesomeIcon icon="plus-circle" /><p>Add Project</p></button></Link>
            </div>

            <FullTable
                records={projects}
                columnDefs={{
                    "ownerOrganization": {label: "Organization", visible: true},
                    "fiscalYear": {label: "FY", visible: true},
                    "name": {label: "Title", visible: true},
                    "description": {label: "Project Description", visible: true},
                    "sogr": {label: "SOGR", visible: true, className: "icon-column"},
                    "projectType": {label: "Type", visible: true}
                }}
                columnsSelectable={true}
                filterDefs={[
                    {
                        name: "organization",
                        label: "Organization",
                        options: organizations.map(o => ({key: o.orgKey, value: o.orgKey, name: o.name})),
                        includeBlank: "Select"
                    },
                    {
                        name: "fy",
                        label: "FY",
                        options: fiscalYears.map(fy => ({key: `fy_${fy.toString()}`, value: fy, name: fy.toString()})),
                        includeBlank: "Select"
                    },
                    {
                        name: "sogr",
                        label: "SOGR",
                        options: [{key: "sogr_true", value: true, name: "Yes"},{key: "sogr_false", value: false, name: "No"}],
                        includeBlank: "Select"
                    },
                    {
                        name: "project_type",
                        label: "Type",
                        options: projectTypes.map(t => ({key: t, value: t, name: t})),
                        includeBlank: "Select"
                    }
                ]}
                handleFilters={fetchProjectsWithFilters}
                rowsSelectable={false}
                defaultPageSize={10}
                tableFormatter={formatTableData}
                handleSearch={searchProjects}
                searchPlaceholder={"Search project title/description"}
                rowActions={(data)=>
                    <td className={"actions-cell"}><Link to={`/projects/${data.id}/edit`}><FontAwesomeIcon icon={"fa-pencil"} title={"Edit Project"}/></Link><Link to={`/projects/${data.id}`}><FontAwesomeIcon icon={"fa-eye"} title={"View Project"}/></Link></td>
                }
            />
        </Container></>
    );
}