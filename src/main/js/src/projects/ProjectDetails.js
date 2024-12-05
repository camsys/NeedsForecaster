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
import {FullTable} from "../lib/FullTable";

export const ProjectDetails = () => {
    const projectId = useParams().projectId;

    let [project, setProject] = useState({});
    let [organizations, setOrganizations] = useState([]);
    let [assetTypes, setAssetTypes] = useState([]);
    let [assets, setAssets] = useState([]);
    let [loading, setLoading] = useState(false);

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
                return new Date(data).toLocaleDateString();
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
        const fetchProject = () => {
            setLoading(true);
            if (projectId) {
                fetch(`/api/projects/${projectId}`, requestOptions)
                    .then((response) => {
                        if (!response.ok) {throw Error}
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
        fetchAssetTypes();
        fetchProject();
        fetchOrgs();
    }, []);

    useEffect(() => {
        if (project?.sogr) {
            setAssets(project?.assets);
        }
    }, [project]);

    return (<>
            {loading && <div className="spinner-container"><div className={"spinner"}></div></div>}
            <Container id={"project-details-page"}>
                <div className={"page-header"}>
                    <div className={"page-header-left"}>
                        <span className={"breadcrumbs"}><Link to={"/projects"}>Projects</Link><FontAwesomeIcon icon={"angle-right"}/></span>
                        <h1>{project?.name}</h1>
                    </div>
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