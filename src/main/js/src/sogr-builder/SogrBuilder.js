import React, { useState, useEffect } from "react";
import {Container, Table} from 'react-bootstrap';
import {DropdownInput} from "../lib/DropdownInput";
import {toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'react-toastify/dist/ReactToastify.css';
import './SogrBuilder.css'
import {ActionsButton} from "../lib/ActionsButton";
import {Link} from "react-router-dom";
import {IconInput} from "../lib/IconInput";

export const SogrBuilder = () => {
    let [organizations, setOrganizations] = useState([]);
    let [fiscalYears, setFiscalYears] = useState([]);
    let [rangesOfYears, setRangesOfYears] = useState([]);
    let [assetTypes, setAssetTypes] = useState([]);
    let [loading, setLoading] = useState(false);
    let [showInfo, setShowInfo] = useState(true);
    let [formData, setFormData] = useState({});
    let [projectBuilderRuns, setProjectBuilderRuns] = useState([]);
    let [filters, setFilters] = useState({});
    let [queriedRuns, setQueriedRuns] = useState([]);
    let [visibleRuns, setVisibleRuns] = useState([]);
    let [columns, setColumns] = useState({
        "runKey": true,
        "ownerOrganization": true,
        "fiscalYear": true,
        "yearRange": true,
        "assetTypeKeys": true,
        "status": true,
        "createdOn": true,
        "completeOn": true
    });
    let [page, setPage] = useState(1);
    let [pageSize, setPageSize] = useState(10);
    let [selectablePages, setSelectablePages] = useState([]);

    const columnNameLabels = {
        "runKey": "Key",
        "ownerOrganization": "Organization",
        "fiscalYear": "Starting Fiscal Year",
        "yearRange": "Range of Years",
        "assetTypeKeys": "Asset Types",
        "status": "Status",
        "createdOn": "Created On",
        "completeOn": "Complete On"
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

    const formatTableData = (column, data) => {
        if ([null,undefined].includes(data)) {
            return "";
        }
        switch (column) {
            case 'ownerOrganization':
                return organizations.filter(o=>(o.orgKey === data))[0].name;
            case 'yearsRange':
                return data === 1 ? '1 year' : `${data} years`;
            case 'assetTypeKeys':
                return data.map(t => assetTypes.filter(at => at.key === t)[0]?.name).join(", ");
            case 'createdOn':
            case 'completeOn':
                return new Date(data).toLocaleString();
            case 'projects':
                return data.map(p => (<Link to={`/projects/${p.id}`}>{p.name}</Link>));
            default:
                return data;
        }
    }

    const fetchProjectBuilderRunsWithFilters = () => {
        const requestOptions = {
            method: "GET",
            credentials: "include",
            // body: Object.keys(filters).length > 0 ? JSON.stringify(filters) : null,
            // headers: {"Content-Type": "Application/JSON"}
        };

        setLoading(true);
        fetch(`/api/runs`, requestOptions)
            .then((response) => {
                if (!response.ok) {throw Error}
                return response
                    .json()
                    .then((data) => {
                        setProjectBuilderRuns(data);
                        setQueriedRuns(data);
                        setPage(1);
                        setLoading(false);
                    })
            })
            .catch((e) => {
                setLoading(false);
                toast.error("Could not retrieve previous project builder runs.");
            });
    }

    const toggleAssetType = (assetType) => {
        let currentAssetTypes = formData["assetTypeKeys"] || [];

        if (currentAssetTypes?.includes(assetType)) {
            currentAssetTypes = currentAssetTypes.filter(t => t !== assetType);
        } else {
            currentAssetTypes.push(assetType);
        }
        setFormData({...formData, assetTypeKeys: currentAssetTypes});
    }

    const runSogr = () => {
        const requestOptions = {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "Application/JSON"},
            body: JSON.stringify(formData)
        };
        setLoading(true);
        fetch("/api/runs/new", requestOptions)
            .then((response) => {
                if (!response.ok) {throw Error}
                return response
                    .json()
                    .then((data) => {
                        setLoading(false);
                        setFilters({});
                    })
            })
            .catch((e) => {
                setLoading(false);
                toast.error("Could not create new SOGR Project.");
            });
    }

    const refreshSelectablePages = () => {
        let numPages = Math.floor((queriedRuns.length - 1) / pageSize) + 1;
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
            fetch("/api/runs/fiscal-years", requestOptions)
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

        const fetchRangesOfYears = () => {
            fetch("/api/runs/range-years", requestOptions)
                .then((response) => {
                    if (!response.ok) {throw Error}
                    return response
                        .json()
                        .then((data) => {
                            setRangesOfYears(data);
                        })
                })
                .catch((e) => {
                    toast.error("Could not retrieve ranges of years.");
                });
        }

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

        fetchOrgs();
        fetchFiscalYears();
        fetchRangesOfYears();
        fetchAssetTypes();
    }, []);

    useEffect(() => {
        fetchProjectBuilderRunsWithFilters();
    }, [filters]);

    useEffect(() => {
        setVisibleRuns(queriedRuns.slice(pageSize * (page - 1), pageSize * page))
        refreshSelectablePages();
    }, [queriedRuns, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [pageSize])

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
                    <p>This analyzer uses your current Policy to determine when assets will be replaced and/or rehabilitated.</p>
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
            <div className={`sogr-builder-form${loading ? " disabled" : ""}`}>
                <div className={"sogr-builder-dropdowns"}>
                    <DropdownInput name={"organization"} label={"Organization"} options={organizations.map(o => ({key: o.orgKey, value: o.orgKey, name: o.name}))} includeBlank={"Select"} handleChange={(e)=>setFormData({...formData, ownerOrganization: e.target.value})} disabled={loading}/>
                    <DropdownInput name={"starting-fy"} label={"Starting Fiscal Year"} options={fiscalYears.map(fy => ({key: `fy_${fy.toString()}`, value: fy, name: fy.toString()}))} includeBlank={"Select"} handleChange={(e)=>setFormData({...formData, fiscalYear: e.target.value})} disabled={loading}/>
                    <DropdownInput name={"range-of-years"} label={"Range of Years"} options = {rangesOfYears.map(n => ({key: `${n}_years`, value: n, name: `${n} ${n > 1 ? 'years' : 'year'}`}))} includeBlank={"Select"} handleChange={(e)=>setFormData({...formData, yearRange: e.target.value})} disabled={loading}/>

                </div>
                <div className={"sogr-builder-asset-types"}>
                    {assetTypes.map(t=>(
                        <div className={"asset-type-group"} onClick={(loading ? void(0) : (e)=>toggleAssetType(t.key))}>
                            <FontAwesomeIcon icon={formData["assetTypeKeys"]?.includes(t.key) ? 'fa-solid fa-square-check' : 'fa-regular fa-square'}/>
                            <p className={formData["assetTypeKeys"]?.includes(t.key) ? "selected" : ""}>{t.name}</p>
                        </div>))
                    }
                </div>
                <div className={"run-sogr-builder-container"}>
                    <button className={"primary-button"} disabled={!["ownerOrganization","fiscalYear","yearRange","assetTypeKeys"].every(field=>(Array.isArray(formData[field]) ? formData[field].length > 0 : !!formData[field])) || loading} onClick={runSogr}><FontAwesomeIcon icon="circle-play" /><p>Run SOGR Builder</p></button>
                </div>
            </div>
            <div className={"sogr-builder-runs-table-container"}>
                <div className={"table-actions"}><button className={"primary-button"} onClick={fetchProjectBuilderRunsWithFilters}><FontAwesomeIcon icon={"fa-rotate"}/>Refresh builder run list</button></div>
                <div className={"full-table"}>
                    <Table>
                        <thead>
                        <tr>
                            {Object.keys(columnNameLabels).filter(c => columns[c]).map(col => <th className={`${col.toLowerCase()}-column`}>{columnNameLabels[col]}</th>)}
                            <th className={"actions-column"}>Projects</th>
                        </tr>
                        </thead>
                        <tbody>
                        {visibleRuns.map(r => <>
                            <tr>
                                {Object.keys(columnNameLabels).filter(c => columns[c]).map(col => <td>{formatTableData(col, r[col])}</td>)}
                                <td className={"actions-cell"}>
                                    <div className={"column-actions-container"}>
                                        {r.status === "COMPLETE" && r.numProjectsInRange > 0 && <Link to={`/projects?runId=${r.id}`}><FontAwesomeIcon icon={"fa-book"} title={"View Associated Projects"}/>({r.numProjectsInRange})</Link>}
                                    </div>
                                </td>
                            </tr>
                        </>)}
                        </tbody>
                    </Table>
                </div>
                <div className={"table-pagination"}>
                    <div className={"page-size-container"}>
                        <DropdownInput name={"page_size"} options={[{key: "page_size_10", value: 10, name: "10"},{key: "page_size_20", value: 20, name: "20"},{key: "page_size_50", value: 50, name: "50"},{key: "page_size_100", value: 100, name: "100"}]} handleChange={(e)=>setPageSize(e.target.value)} defaultValue={pageSize} noArrow={true}/>Rows per page
                    </div>
                    <p className={"page-info"}>Showing <b>{queriedRuns?.length > 0 ? pageSize * (page - 1) + 1 : 0} to {pageSize * page < queriedRuns.length ? pageSize * page : queriedRuns.length}</b> of {queriedRuns.length} rows</p>
                    <div className={"page-selector"}>
                        {page > 1 && <FontAwesomeIcon icon={"fa-angle-left"} onClick={()=>setPage(page - 1)}/>}
                        {selectablePages.map((p) => (
                            <>
                                {p === selectablePages[1] && page > 4 && <div className={"bottom-align"}>...</div>}
                                <a className={p === page ? "current-page" : ""} href={void(0)} onClick={()=>setPage(p)}>{p}</a>
                                {p === selectablePages[selectablePages.length-2] && p < Math.floor((queriedRuns.length - 1) / pageSize) && <div className={"bottom-align"}>...</div>}
                            </>
                        ))}
                        {page <= Math.floor((queriedRuns.length - 1) / pageSize) && <FontAwesomeIcon icon={"fa-angle-right"} onClick={()=>setPage(page + 1)}/>}
                    </div>
                </div>
            </div>
        </Container></>
    );
}
