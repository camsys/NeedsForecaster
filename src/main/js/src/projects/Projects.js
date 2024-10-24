import React, { useState, useEffect } from "react";
import {Container, Table} from 'react-bootstrap';
import {DropdownInput} from "../lib/DropdownInput";
import {ActionsButton} from "../lib/ActionsButton";
import {toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'react-toastify/dist/ReactToastify.css';
import './Projects.css'
import {IconInput} from "../lib/IconInput";

export const Projects = () => {
    // TODO: Add/edit projects in separate modal window
    // TODO: Fiscal year formatted as YYYY when fiscal year is included in the label context, add FY to beginning when not
    // TODO: Move search bar to filters section and have it search on project name and description
    // TODO: Add filter for manual projects

    let [organizations, setOrganizations] = useState([]);
    let [fiscalYears, setFiscalYears] = useState([]);
    let [projectTypes, setProjectTypes] = useState([{key:"type 1", name:"Type 1"},{key:"type 2", name:"Type 2"}]);
    let [filters, setFilters] = useState({});
    let [searchQuery, setSearchQuery] = useState('');
    let [projects, setProjects] = useState([]);
    let [visibleProjects, setVisibleProjects] = useState([]);
    let [selectedProjects, setSelectedProjects] = useState([]);
    let [columns, setColumns] = useState({
        "ownerOrganization": true,
        "fiscalYear": true,
        "name": true,
        "description": true,
        "sogr": true,
        "projectType": true,
        "manual": true
    });
    let [page, setPage] = useState(1);
    let [pageSize, setPageSize] = useState(10);
    let [selectablePages, setSelectablePages] = useState([]);
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
        "projectType": "Type",
        "manual": "Manual"
    }

    const updateFilters = (filter, value) => {
        if (value) {
            setFilters({...filters, [filter]: value})
        } else {
            setFilters(allFilters => {
                const {[filter]: _, ...otherFilters} = allFilters;
                return otherFilters;
            });
        }
    }

    const fetchProjectsWithFilters = (filters) => {
        // TODO: Pagination will be frontend
        // TODO: Filters will be handled by backend as a request body
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
            case 'manual':
                return data && <FontAwesomeIcon icon={'circle-check'} />;
            default:
                return data;
        }
    }

    const selectProject = (project) => {
        selectedProjects.includes(project) ? setSelectedProjects(selectedProjects.filter(p => p != project)) : setSelectedProjects([...selectedProjects, project]);
    }

    const changePage = (pageNum) => {
        // TODO: Pagination will be frontend
        setPage(pageNum);
        setVisibleProjects(projects.slice(pageSize * (pageNum - 1), pageSize * pageNum));
        refreshSelectablePages();
    }

    const refreshSelectablePages = () => {
        let numPages = Math.floor((projects.length - 1) / pageSize) + 1;
        if (numPages <= 0) {
            setSelectablePages([]);
        }
        else if (numPages <= 6) {
            setSelectablePages([...Array(numPages).keys()].map(p=>p+1));
        }
        else if (page <= 3) {
            let pagesList = [...Array(5).keys()].map(p=>p+1);
            pagesList.push(numPages);
            setSelectablePages(pagesList);
        } else {
            let pagesList = [1];
            if (page >= numPages -2) {
                for (let i = numPages - 4; i < numPages + 1; i++) {
                    if (i <= numPages) {
                        pagesList.push(i);
                    }
                }
            }
            else {
                for (let i = page - 2; i < page + 3; i++) {
                    pagesList.push(i);
                }
                if (pagesList[pagesList.length - 1] != numPages) {
                    pagesList.push(numPages);
                }
            }
            setSelectablePages(pagesList);
        }
    }

    const addProject = () => {
        console.log("Not really adding new project.");
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
        fetchOrgs();
        fetchFiscalYears();
    }, []);

    useEffect(() => {
        fetchProjectsWithFilters(filters);
        setPage(1);
    }, [filters]);

    useEffect(() => {
        setVisibleProjects(projects.slice(pageSize * (page - 1), pageSize * page))
        refreshSelectablePages();
    }, [projects, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [pageSize])

    return (<>
        {loading && <div className="spinner-container"><div className={"spinner"}></div></div>}
        <Container id={"projects-page"}>
            <div className={"page-header"}>
                <h1>Projects</h1>
                <button className={"primary-button"} onClick={addProject}><FontAwesomeIcon icon="plus-circle" /><p>Add Project</p></button>
            </div>
            <div className={"top-filters"}>
                <h2>Filters</h2>
                <div className={"filters-container"}>
                    <DropdownInput name={"organization"} label={"Organization"} options={organizations.map(o => ({key: o.orgKey, value: o.orgKey, name: o.name}))} includeBlank={"Select"} handleChange={(e)=>updateFilters("ownerOrganization", e.target.value)}/>
                    <DropdownInput name={"fy"} label={"FY"} options={fiscalYears.map(o => ({key: `fy_${o.toString()}`, value: o, name: o.toString()}))} includeBlank={"Select"} handleChange={(e)=>updateFilters("fiscalYear", parseInt(e.target.value))}/>
                    <DropdownInput name={"sogr"} label={"SOGR"} options={[{key: "sogr_true", value: true, name: "Yes"},{key: "sogr_false", value: false, name: "No"}]} includeBlank={"Select"} handleChange={(e)=>updateFilters("sogr", e.target.value)}/>
                    <DropdownInput name={"project_type"} label={"Type"} options={projectTypes.map(t => ({key: t.key, value: t.key, name: t.name}))} includeBlank={"Select"} handleChange={(e)=>updateFilters("projectType", e.target.value)}/>
                </div>
            </div>
            <div className={"projects-table-container"}>
                <div className={"table-actions"}>
                    <IconInput icon={'magnifying-glass'} name={"searchBar"} type={"text"} placeholder={"Search Table..."} value={searchQuery} handleChange={(e) => setSearchQuery(e.target.value)}/>
                    <ActionsButton actions={exportActionsMenuItems} icon={"file-arrow-down"} label={"Export"}/>
                    <ActionsButton actions={Object.keys(columnNameLabels).map(c => ({
                        text: columnNameLabels[c],
                        href: void(0),
                        icon: (columns[c] ? 'fa-regular fa-square-check' : 'fa-regular fa-square'),
                        handleClick: ()=>setColumns({...columns, [c]: !columns[c]})
                    }))} icon={"table-columns"} label={"Columns"}/>
                </div>
                <div className={"full-table"}>
                    <Table>
                        <thead>
                            <tr>
                                <th className={"icon-column"} onClick={()=>setSelectedProjects(visibleProjects.every(p => selectedProjects.includes(p)) ? [] : visibleProjects)}><FontAwesomeIcon icon={visibleProjects.every(p => selectedProjects.includes(p)) ? "fa-regular fa-square-check" : "fa-regular fa-square"}/></th>
                                {Object.keys(columnNameLabels).filter(c => columns[c]).map(col => <th className={`${col.toLowerCase()}-column`}>{columnNameLabels[col]}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {visibleProjects.map(p => <>
                                <tr>
                                    <td className={"icon-column"} onClick={()=>selectProject(p)}><FontAwesomeIcon icon={selectedProjects.includes(p) ? "fa-regular fa-square-check" : "fa-regular fa-square"}/></td>
                                    {Object.keys(columnNameLabels).filter(c => columns[c]).map(col => <td className={['sogr','manual'].includes(col) ? "icon-column" : ""}>{formatTableData(col, p[col])}</td>)}
                                </tr>
                            </>)}
                        </tbody>
                    </Table>
                </div>
                <div className={"table-pagination"}>
                    <div className={"page-size-container"}>
                        <DropdownInput name={"page_size"} options={[{key: "page_size_10", value: 10, name: "10"},{key: "page_size_20", value: 20, name: "20"},{key: "page_size_50", value: 50, name: "50"},{key: "page_size_100", value: 100, name: "100"}]} handleChange={(e)=>setPageSize(e.target.value)} defaultValue={pageSize} noArrow={true}/>Rows per page
                    </div>
                    <p className={"page-info"}>Showing <b>{pageSize * (page - 1) + 1} to {pageSize * page < projects.length ? pageSize * page : projects.length}</b> of {projects.length} rows</p>
                    <div className={"page-selector"}>
                        {page > 1 && <FontAwesomeIcon icon={"fa-angle-left"} onClick={()=>setPage(page - 1)}/>}
                        {selectablePages.map((p) => (
                            <>
                                {p === selectablePages[1] && page > 4 && <p>...</p>}
                                <a className={p === page ? "current-page" : ""} href={void(0)} onClick={()=>setPage(p)}>{p}</a>
                                {p === selectablePages[selectablePages.length-2] && p < Math.floor((projects.length - 1) / pageSize) && <p>...</p>}
                            </>
                        ))}
                        {page <= Math.floor((projects.length - 1) / pageSize) && <FontAwesomeIcon icon={"fa-angle-right"} onClick={()=>setPage(page + 1)}/>}
                    </div>
                </div>
            </div>
        </Container></>
    );
}