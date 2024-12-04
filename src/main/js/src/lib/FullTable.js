import React, { useState, useEffect } from "react";
import {Container, Table} from 'react-bootstrap';
import {DropdownInput} from "../lib/DropdownInput";
import {ActionsButton} from "../lib/ActionsButton";
import {toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import 'react-toastify/dist/ReactToastify.css';
import {IconInput} from "../lib/IconInput";
import {Link} from "react-router-dom";

export const FullTable = ({records, columnDefs, columnsSelectable, filterDefs, handleFilters, customFilterElems, rowsSelectable, defaultPageSize, exportOptions, tableFormatter, handleSearch, searchPlaceholder, rowActions}) => {
    let [filters, setFilters] = useState({});
    let [searchQuery, setSearchQuery] = useState('');
    let [queriedRecords, setQueriedRecords] = useState([]);
    let [visibleRecords, setVisibleRecords] = useState([]);
    let [selectedRecords, setSelectedRecords] = useState(null);
    let [selectedRecord, setSelectedRecord] = useState(null);
    let [columns, setColumns] = useState(columnDefs);
    let [page, setPage] = useState(1);
    let [pageSize, setPageSize] = useState(defaultPageSize);
    let [selectablePages, setSelectablePages] = useState([]);

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

    const executeSearch = (query) => {
        setSearchQuery(query);
        setTimeout(() => {
            setQueriedRecords(handleSearch(query));
            setPage(1);
        }, 500);
    }

    // const selectRecord = (record) => {
    //     selectedRecords?.includes(record) ? setSelectedRecords(selectedRecords?.filter(r => r != record)) : setSelectedRecords([...selectedRecords, record]);
    // }

    const refreshSelectablePages = () => {
        let numPages = Math.floor((queriedRecords?.length - 1) / pageSize) + 1;
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
        setQueriedRecords(searchQuery ? handleSearch(searchQuery) : records);
        setPage(1);
    }, [records]);

    useEffect(() => {
        handleFilters(filters);
    }, [filters]);

    useEffect(() => {
        setVisibleRecords(queriedRecords?.slice(pageSize * (page - 1), pageSize * page))
        refreshSelectablePages();
    }, [queriedRecords, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [pageSize])

    return (<>
            {(filterDefs || !!handleSearch || customFilterElems) && (<div className={"top-filters"}>
                <h2>Filters</h2>
                <div className={"filters-container"}>
                    {customFilterElems}
                    {filterDefs?.map(f=>(<DropdownInput name={f.name} label={f.label} options={f.options} includeBlank={f.includeBlank} handleChange={(e)=>updateFilters(f.name, e.target.value)}/>))}
                    {!!handleSearch && <IconInput icon={'magnifying-glass'} name={"search_bar"} label={searchPlaceholder} type={"text"} value={searchQuery} handleChange={(e) => executeSearch(e.target.value)}/>}
                </div>
            </div>)}
            <div className={"projects-table-container"}>
                {(columnsSelectable || exportOptions) && <div className={"table-actions"}>
                    {exportOptions && <ActionsButton actions={exportOptions} icon={"file-arrow-down"} label={"Export"}/>}
                    {columnsSelectable && <ActionsButton actions={Object.keys(columnDefs).map(c => ({
                        text: columnDefs[c].label,
                        href: void(0),
                        icon: (columns[c].visible ? 'fa-regular fa-square-check' : 'fa-regular fa-square'),
                        handleClick: ()=>setColumns({...columns, [c]: {...columns[c], visible: !columns[c].visible}})
                    }))} icon={"table-columns"} label={"Columns"}/>}
                </div>}
                <div className={"full-table"}>
                    <Table>
                        <thead>
                        <tr>
                            {/*{rowsSelectable && <th className={"icon-column"} onClick={()=>setSelectedRecords(visibleRecords?.every(r => selectedRecords?.includes(r)) ? [] : visibleRecords)}><FontAwesomeIcon icon={visibleRecords?.every(r => selectedRecords?.includes(r)) ? "fa-regular fa-square-check" : "fa-regular fa-square"}/></th>}*/}
                            {Object.keys(columnDefs).filter(c => columns[c].visible).map(col => <th className={`${col.toLowerCase()}-column`}>{columnDefs[col].label}</th>)}
                            <th className={"actions-column"}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {visibleRecords?.map(r => <>
                            <tr>
                                {/*{rowsSelectable && <td className={"icon-column"} onClick={()=>selectRecord(r)}><FontAwesomeIcon icon={selectedRecords.includes(r) ? "fa-regular fa-square-check" : "fa-regular fa-square"}/></td>}*/}
                                {Object.keys(columnDefs).filter(c => columns[c].visible).map(col => <td className={columnDefs[col].className || ""}>{tableFormatter(col, r[col])}</td>)}
                                {!!rowActions && rowActions(r)}
                            </tr>
                        </>)}
                        </tbody>
                    </Table>
                </div>
                <div className={"table-pagination"}>
                    <div className={"page-size-container"}>
                        <DropdownInput name={"page_size"} options={[{key: "page_size_10", value: 10, name: "10"},{key: "page_size_20", value: 20, name: "20"},{key: "page_size_50", value: 50, name: "50"},{key: "page_size_100", value: 100, name: "100"}]} handleChange={(e)=>setPageSize(e.target.value)} defaultValue={pageSize} noArrow={true}/>Rows per page
                    </div>
                    <p className={"page-info"}>Showing <b>{pageSize * (page - 1) + 1} to {pageSize * page < queriedRecords?.length ? pageSize * page : queriedRecords?.length}</b> of {queriedRecords?.length} rows</p>
                    <div className={"page-selector"}>
                        {page > 1 && <FontAwesomeIcon icon={"fa-angle-left"} onClick={()=>setPage(page - 1)}/>}
                        {selectablePages.map((p) => (
                            <>
                                {p === selectablePages[1] && page > 4 && <div className={"bottom-align"}>...</div>}
                                <a className={p === page ? "current-page" : ""} href={void(0)} onClick={()=>setPage(p)}>{p}</a>
                                {p === selectablePages[selectablePages?.length-2] && p < Math.floor((queriedRecords?.length - 1) / pageSize) && <div className={"bottom-align"}>...</div>}
                            </>
                        ))}
                        {page <= Math.floor((queriedRecords?.length - 1) / pageSize) && <FontAwesomeIcon icon={"fa-angle-right"} onClick={()=>setPage(page + 1)}/>}
                    </div>
                </div>
            </div></>
    );
}