import React, { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import {Container, Table} from 'react-bootstrap';
import {DropdownInput} from "../lib/DropdownInput";
import {ActionsButton} from "../lib/ActionsButton";
import {toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'react-toastify/dist/ReactToastify.css';
import './ProjectDetails.css'
import {IconInput} from "../lib/IconInput";
import {Link} from "react-router-dom";

export const ProjectDetails = () => {
    const projectId = useParams().projectId;

    let [project, setProject] = useState({});
    let [organizations, setOrganizations] = useState([]);
    let [searchQuery, setSearchQuery] = useState('');
    let [assets, setAssets] = useState([]);
    let [queriedAssets, setQueriedAssets] = useState([]);
    let [visibleAssets, setVisibleAssets] = useState([]);
    let [columns, setColumns] = useState({
        "assetId": true
    });
    let [page, setPage] = useState(1);
    let [pageSize, setPageSize] = useState(10);
    let [selectablePages, setSelectablePages] = useState([]);
    let [loading, setLoading] = useState(false);

    const columnNameLabels = {
        "assetId": "Asset ID"
    }

    const formatTableData = (column, data) => {
        switch (column) {
            default:
                return data;
        }
    }

    const refreshSelectablePages = () => {
        let numPages = Math.floor((queriedAssets.length - 1) / pageSize) + 1;
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

    const executeSearch = (query) => {
        setSearchQuery(query);
        setTimeout(()=>{
            setQueriedAssets(assets.filter(p => (p.assetId.toLowerCase().includes(query.toLowerCase()))));
        }, 500);
    }

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            credentials: "include"
        };
        const fetchProject = () => {
            setLoading(true);
            if (projectId) {
                fetch(`/api/projects/${projectId}`, requestOptions)
                    .then((response) => {
                        return response
                            .json()
                            .then((data) => {
                                setProject(data);
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
        fetchProject();
        fetchOrgs();
    }, []);

    useEffect(() => {
        const fetchAssets = () => {
            const requestOptions = {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "Application/JSON"}
            };

            setLoading(true);
            // TODO: Figure out how assets will be retrieved
            let assetData = [{id: 1, assetId: "An Asset"}];
            setAssets(assetData);
            setQueriedAssets(assetData.filter(p => !!searchQuery ? (p.assetId.includes(searchQuery)) : p));
            setLoading(false);
            // fetch(`/api/projects`, requestOptions)
            //     .then((response) => {
            //         return response
            //             .json()
            //             .then((data) => {
            //                 [...Array(80).keys()].forEach(n => {
            //                     data.push({
            //                         "id": n+6,
            //                         "name": `Curl Project ${n+4}`,
            //                         "description": `Curl Project ${n+4} description`,
            //                         "ownerOrganization": "bpt",
            //                         "fiscalYear": 2025,
            //                         "projectType": "Type 2",
            //                         "sogr": true,
            //                         "valid": true
            //                     });
            //                 });
            //                 setProjects(data);
            //                 setQueriedProjects(data.filter(p => !!searchQuery ? (p.name.includes(searchQuery) || p.description.includes(searchQuery)) : p));
            //                 setLoading(false);
            //             })
            //     })
            //     .catch((e) => {
            //         setLoading(false);
            //         toast.error("Could not retrieve projects.");
            //     });
        }
        if (project.sogr) {
            fetchAssets();
            setPage(1);
        }
    }, [project]);

    useEffect(() => {
        setVisibleAssets(queriedAssets.slice(pageSize * (page - 1), pageSize * page))
        refreshSelectablePages();
    }, [queriedAssets, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [pageSize])

    return (<>
            {loading && <div className="spinner-container"><div className={"spinner"}></div></div>}
            <Container id={"project-details-page"}>
                <div className={"page-header"}>
                    <h1>{project?.name}</h1>
                    <Link to={`/projects/${projectId}/edit`}><button className={"primary-button"}><FontAwesomeIcon icon="pencil" /><p>Edit</p></button></Link>
                </div>
                <div className={"project-info-container"}>
                    <div className={"project-info"}>
                        <div className={"label-and-info"}>
                            <h2>Organization</h2>
                            <p className={"info-text"}>{organizations.filter(o=>(o.orgKey === project?.ownerOrganization))[0]?.name}</p>
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
                {project.sogr && <div className={"assets-table-container"}>
                    <div className={"table-actions"}>
                        <IconInput icon={'magnifying-glass'} name={"search_bar"} placeholder={"Search Table..."} type={"text"} value={searchQuery} handleChange={(e) => executeSearch(e.target.value)}/>
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
                                </tr>
                            </thead>
                            <tbody>
                                {visibleAssets.map(p => <>
                                    <tr>
                                        {/*<td className={"icon-column"} onClick={()=>selectProject(p)}><FontAwesomeIcon icon={selectedProjects.includes(p) ? "fa-regular fa-square-check" : "fa-regular fa-square"}/></td>*/}
                                        {Object.keys(columnNameLabels).filter(c => columns[c]).map(col => <td>{formatTableData(col, p[col])}</td>)}
                                    </tr>
                                </>)}
                            </tbody>
                        </Table>
                    </div>
                    <div className={"table-pagination"}>
                        <div className={"page-size-container"}>
                            <DropdownInput name={"page_size"} options={[{key: "page_size_10", value: 10, name: "10"},{key: "page_size_20", value: 20, name: "20"},{key: "page_size_50", value: 50, name: "50"},{key: "page_size_100", value: 100, name: "100"}]} handleChange={(e)=>setPageSize(e.target.value)} defaultValue={pageSize} noArrow={true}/>Rows per page
                        </div>
                        <p className={"page-info"}>Showing <b>{pageSize * (page - 1) + 1} to {pageSize * page < queriedAssets.length ? pageSize * page : queriedAssets.length}</b> of {queriedAssets.length} rows</p>
                        <div className={"page-selector"}>
                            {page > 1 && <FontAwesomeIcon icon={"fa-angle-left"} onClick={()=>setPage(page - 1)}/>}
                            {selectablePages.map((p) => (
                                <>
                                    {p === selectablePages[1] && page > 4 && <div className={"bottom-align"}>...</div>}
                                    <a className={p === page ? "current-page" : ""} href={void(0)} onClick={()=>setPage(p)}>{p}</a>
                                    {p === selectablePages[selectablePages.length-2] && p < Math.floor((queriedAssets.length - 1) / pageSize) && <div className={"bottom-align"}>...</div>}
                                </>
                            ))}
                            {page <= Math.floor((queriedAssets.length - 1) / pageSize) && <FontAwesomeIcon icon={"fa-angle-right"} onClick={()=>setPage(page + 1)}/>}
                        </div>
                    </div>
                </div>}
            </Container></>
    );
}