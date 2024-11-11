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

export const Projects = () => {
    // TODO: Add/edit projects in separate page
    // TODO: Fiscal year formatted as YYYY when fiscal year is included in the label context, add FY to beginning when not
    // TODO: Move search bar to filters section and have it search on project name and description

    let [organizations, setOrganizations] = useState([]);
    let [fiscalYears, setFiscalYears] = useState([]);
    let [projectTypes, setProjectTypes] = useState([]);
    let [filters, setFilters] = useState({});
    let [searchQuery, setSearchQuery] = useState('');
    let [projects, setProjects] = useState([]);
    let [queriedProjects, setQueriedProjects] = useState([]);
    let [visibleProjects, setVisibleProjects] = useState([]);
    let [selectedProjects, setSelectedProjects] = useState([]);
    let [columns, setColumns] = useState({
        "ownerOrganization": true,
        "fiscalYear": true,
        "name": true,
        "description": true,
        "sogr": true,
        "projectType": true
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
        "projectType": "Type"
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
                        setQueriedProjects(data.filter(p => !!searchQuery ? (p.name.includes(searchQuery) || p.description.includes(searchQuery)) : p));
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
                return organizations.filter(o=>(o.orgKey === data))[0].name;
            default:
                return data;
        }
    }

    const selectProject = (project) => {
        selectedProjects.includes(project) ? setSelectedProjects(selectedProjects.filter(p => p != project)) : setSelectedProjects([...selectedProjects, project]);
    }

    const refreshSelectablePages = () => {
        let numPages = Math.floor((queriedProjects.length - 1) / pageSize) + 1;
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

    const executeSearch = (query) => {
        setSearchQuery(query);
        setTimeout(()=>{
            setQueriedProjects(projects.filter(p => (p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()))));
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
    }, []);

    useEffect(() => {
        fetchProjectsWithFilters(filters);
        setPage(1);
    }, [filters]);

    useEffect(() => {
        setVisibleProjects(queriedProjects.slice(pageSize * (page - 1), pageSize * page))
        refreshSelectablePages();
    }, [queriedProjects, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [pageSize])

    return (<>
        {loading && <div className="spinner-container"><div className={"spinner"}></div></div>}
        <Container id={"projects-page"}>
            <div className={"page-header"}>
                <h1>Projects</h1>
                <Link to={"/projects/new"}><button className={"primary-button"}><FontAwesomeIcon icon="plus-circle" /><p>Add Project</p></button></Link>
            </div>
            <div className={"top-filters"}>
                <h2>Filters</h2>
                <div className={"filters-container"}>
                    <DropdownInput name={"organization"} label={"Organization"} options={organizations.map(o => ({key: o.orgKey, value: o.orgKey, name: o.name}))} includeBlank={"Select"} handleChange={(e)=>updateFilters("ownerOrganization", e.target.value)}/>
                    <DropdownInput name={"fy"} label={"FY"} options={fiscalYears.map(fy => ({key: `fy_${fy.toString()}`, value: fy, name: fy.toString()}))} includeBlank={"Select"} handleChange={(e)=>updateFilters("fiscalYear", parseInt(e.target.value))}/>
                    <DropdownInput name={"sogr"} label={"SOGR"} options={[{key: "sogr_true", value: true, name: "Yes"},{key: "sogr_false", value: false, name: "No"}]} includeBlank={"Select"} handleChange={(e)=>updateFilters("sogr", e.target.value)}/>
                    <DropdownInput name={"project_type"} label={"Type"} options={projectTypes.map(t => ({key: t, value: t, name: t}))} includeBlank={"Select"} handleChange={(e)=>updateFilters("projectType", e.target.value)}/>
                    <IconInput icon={'magnifying-glass'} name={"search_bar"} label={"Search project title/description"} type={"text"} value={searchQuery} handleChange={(e) => executeSearch(e.target.value)}/>
                </div>
            </div>
            <div className={"projects-table-container"}>
                <div className={"table-actions"}>
                    {/*<ActionsButton actions={exportActionsMenuItems} icon={"file-arrow-down"} label={"Export"}/>*/}
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
                                {/*<th className={"icon-column"} onClick={()=>setSelectedProjects(visibleProjects.every(p => selectedProjects.includes(p)) ? [] : visibleProjects)}><FontAwesomeIcon icon={visibleProjects.every(p => selectedProjects.includes(p)) ? "fa-regular fa-square-check" : "fa-regular fa-square"}/></th>*/}
                                {Object.keys(columnNameLabels).filter(c => columns[c]).map(col => <th className={`${col.toLowerCase()}-column`}>{columnNameLabels[col]}</th>)}
                                <th className={"actions-column"}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleProjects.map(p => <>
                                <tr>
                                    {/*<td className={"icon-column"} onClick={()=>selectProject(p)}><FontAwesomeIcon icon={selectedProjects.includes(p) ? "fa-regular fa-square-check" : "fa-regular fa-square"}/></td>*/}
                                    {Object.keys(columnNameLabels).filter(c => columns[c]).map(col => <td className={col === "sogr" ? "icon-column" : ""}>{formatTableData(col, p[col])}</td>)}
                                    <td className={"actions-cell"}><Link to={`/projects/${p.id}/edit`}><FontAwesomeIcon icon={"fa-pencil"} title={"Edit Project"}/></Link><Link to={`/projects/${p.id}`}><FontAwesomeIcon icon={"fa-eye"} title={"View Project"}/></Link></td>
                                </tr>
                            </>)}
                        </tbody>
                    </Table>
                </div>
                <div className={"table-pagination"}>
                    <div className={"page-size-container"}>
                        <DropdownInput name={"page_size"} options={[{key: "page_size_10", value: 10, name: "10"},{key: "page_size_20", value: 20, name: "20"},{key: "page_size_50", value: 50, name: "50"},{key: "page_size_100", value: 100, name: "100"}]} handleChange={(e)=>setPageSize(e.target.value)} defaultValue={pageSize} noArrow={true}/>Rows per page
                    </div>
                    <p className={"page-info"}>Showing <b>{pageSize * (page - 1) + 1} to {pageSize * page < queriedProjects.length ? pageSize * page : queriedProjects.length}</b> of {queriedProjects.length} rows</p>
                    <div className={"page-selector"}>
                        {page > 1 && <FontAwesomeIcon icon={"fa-angle-left"} onClick={()=>setPage(page - 1)}/>}
                        {selectablePages.map((p) => (
                            <>
                                {p === selectablePages[1] && page > 4 && <div className={"bottom-align"}>...</div>}
                                <a className={p === page ? "current-page" : ""} href={void(0)} onClick={()=>setPage(p)}>{p}</a>
                                {p === selectablePages[selectablePages.length-2] && p < Math.floor((queriedProjects.length - 1) / pageSize) && <div className={"bottom-align"}>...</div>}
                            </>
                        ))}
                        {page <= Math.floor((queriedProjects.length - 1) / pageSize) && <FontAwesomeIcon icon={"fa-angle-right"} onClick={()=>setPage(page + 1)}/>}
                    </div>
                </div>
            </div>
        </Container></>
    );
}