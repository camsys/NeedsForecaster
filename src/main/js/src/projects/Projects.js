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
    let [organizations, setOrganizations] = useState([]);
    let [fiscalYears, setFiscalYears] = useState([2020, 2021, 2022, 2023, 2024, 2025]);
    let [projectTypes, setProjectTypes] = useState([{key:"type_1", name:"Type 1"},{key:"type_2", name:"Type 2"}]);
    let [filters, setFilters] = useState({});
    let [searchQuery, setSearchQuery] = useState('');
    let [projects, setProjects] = useState([]);
    let [visibleProjects, setVisibleProjects] = useState([]);
    let [selectedProjects, setSelectedProjects] = useState([]);
    let [columns, setColumns] = useState({
        "Agency": true,
        "FY": true,
        "Title": true,
        "Project Description": true,
        "SOGR": true,
        "Type": true,
        "Manual": true
    });
    let [page, setPage] = useState(1);
    let [pageSize, setPageSize] = useState(10);
    let [loading, setLoading] = useState(false);

    const exportActionsMenuItems = [
        {
            text: "Dummy Export",
            href: void(0),
            icon: null,
            handleClick: ()=>console.log("Not really exporting table.")
        }
    ]

    const fetchProjectsWithFilters = (filters) => {
        // TODO: Will we have an API call with pagination or is that strictly frontend?
        console.log("Hook up to API call that can parse filters and return projects.");
        console.log("Using filters: " + filters.toString());
    }

    const formatTableData = (column, data) => {
        switch (column) {
            case 'SOGR':
            case 'Manual':
                return data && <FontAwesomeIcon icon={'circle-check'} />;
            default:
                return data;
        }
    }

    const selectProject = (project) => {
        selectedProjects.includes(project) ? setSelectedProjects(selectedProjects.filter(p => p != project)) : setSelectedProjects([...selectedProjects, project]);
    }

    const changePage = (pageNum) => {
        // TODO: Will we have an API call with pagination or is that strictly frontend?
        setPage(pageNum);
        setVisibleProjects(projects.slice(pageSize * (page - 1), pageSize * page));
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

        const fetchFiscalYears = () => {
            console.log("Not fetching fiscal years.")
            // fetch("/api/asset-types", requestOptions)
            // .then((response) => {
            //     return response
            //         .json()
            //         .then((data) => {
            //             setAssetTypes(data);
            //         })
            // })
            // .catch((e) => {
            //     toast.error("Could not retrieve asset types.");
            // });
        }

        const fetchProjects = () => {
            // TODO: Will we have an API call with pagination or is that strictly frontend?
            console.log("Fetching dummy projects.")
            setProjects([
                {
                    'Agency': 'ACTS',
                    'FY': '23-24',
                    'Title': 'Replace Maintenance Shop - Battery Jump Boxes',
                    'Project Description': 'Battery boxes used in parking lot to jump vehicles that have dead batteries.',
                    'SOGR': true,
                    'Type': 'R',
                    'Manual': false
                },
                {
                    'Agency': 'ACTS',
                    'FY': '23-24',
                    'Title': 'Replace Maintenance Shop - Battery Jump Boxes Part 2',
                    'SOGR': true,
                    'Type': 'R',
                    'Manual': true
                }
            ]);
            // fetch(`/api/projects`, requestOptions)
            // .then((response) => {
            //     return response
            //         .json()
            //         .then((data) => {
            //             setProjects(data);
            //         })
            // })
            // .catch((e) => {
            //     toast.error("Could not retrieve projects.");
            // });
        }

        setLoading(true);
        fetchOrgs();
        fetchFiscalYears();
        fetchProjects();
        setLoading(false);
    }, []);

    useEffect(() => {
        setVisibleProjects(projects.slice(0, pageSize));
    }, [projects, pageSize]);

    useEffect(() => {
        fetchProjectsWithFilters(filters);
        changePage(1);
    }, [filters]);

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
                    <DropdownInput name={"agency"} label={"Agency"} options={organizations.map(o => ({key: o.orgKey, value: o.orgKey, name: o.name}))} includeBlank={"Select"} handleChange={(e)=>setFilters({...filters, agency: e.target.value})}/>
                    <DropdownInput name={"fy"} label={"FY"} options={fiscalYears.map(o => ({key: `fy_${o.toString()}`, value: o, name: o.toString()}))} includeBlank={"Select"} handleChange={(e)=>setFilters({...filters, fiscalYear: e.target.value})}/>
                    <DropdownInput name={"sogr"} label={"SOGR"} options={[{key: "sogr_true", value: true, name: "Yes"},{key: "sogr_false", value: false, name: "No"}]} includeBlank={"Select"} handleChange={(e)=>setFilters({...filters, sogr: e.target.value})}/>
                    <DropdownInput name={"project_type"} label={"Type"} options={projectTypes.map(t => ({key: t.key, value: t.key, name: t.name}))} includeBlank={"Select"} handleChange={(e)=>setFilters({...filters, projectType: e.target.value})}/>
                </div>
            </div>
            <div className={"projects-table-container"}>
                <div className={"table-actions"}>
                    <IconInput icon={'magnifying-glass'} name={"searchBar"} type={"text"} placeholder={"Search Table..."} value={searchQuery} handleChange={(e) => setSearchQuery(e.target.value)}/>
                    <ActionsButton actions={exportActionsMenuItems} icon={"file-arrow-down"} label={"Export"}/>
                    <ActionsButton actions={Object.keys(columns).map(c => ({
                        text: c,
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
                                {Object.keys(columns).filter(c => columns[c]).map(col => <th className={`${col.toLowerCase()}-column`}>{col}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {visibleProjects.map(p => <>
                                <tr>
                                    <td className={"icon-column"} onClick={()=>selectProject(p)}><FontAwesomeIcon icon={selectedProjects.includes(p) ? "fa-regular fa-square-check" : "fa-regular fa-square"}/></td>
                                    {Object.keys(columns).filter(c => columns[c]).map(col => <td className={['SOGR','Manual'].includes(col) ? "icon-column" : ""}>{formatTableData(col, p[col])}</td>)}
                                </tr>
                            </>)}
                        </tbody>
                    </Table>
                </div>
                <div className={"table-pagination"}>

                </div>
            </div>
        </Container></>
    );
}
