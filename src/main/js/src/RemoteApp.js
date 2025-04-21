import { HashRouter, Routes, Route } from "react-router-dom";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./App.css";
import {Policies} from "./policies/Policies";
import {Projects} from "./projects/Projects";
import {ProjectDetails} from "./projects/ProjectDetails";
import {SogrBuilder} from "./sogr-builder/SogrBuilder";
import { library } from '@fortawesome/fontawesome-svg-core'
import {faClone, faPencil, faChevronDown, faPlusCircle, faMinusCircle, faFloppyDisk, faXmark, faMagnifyingGlass, faSquare, faSquareCheck, faCircleCheck, faFileArrowDown, faTableColumns, faAngleLeft, faAngleRight, faCircleXmark, faCircleInfo, faCirclePlay, faEye, faTrashCan, faRotate, faBook, faFileCsv, faFileExcel} from '@fortawesome/free-solid-svg-icons'
import {faCheckSquare as farSquareCheck, faSquare as farSquare, faHourglassHalf as farHourglassHalf} from '@fortawesome/free-regular-svg-icons'

export default function RemoteApp({ urlPath }) {

    library.add(faClone, faPencil, faChevronDown, faPlusCircle, faMinusCircle, faFloppyDisk, faXmark, faMagnifyingGlass, faSquare, farSquare, faSquareCheck, farSquareCheck, faCircleCheck, faFileArrowDown, faTableColumns, faAngleLeft, faAngleRight, faCircleXmark, faCircleInfo, faCirclePlay, farHourglassHalf, faEye, faTrashCan, faRotate, faBook, faFileCsv, faFileExcel);
    return (
        <>
            <HashRouter>
                <Routes>
                    <Route exact path="/policies" element={ <Policies urlPath={ urlPath }/> } />
                    <Route path="projects">
                        <Route exact path="" element={ <Projects urlPath={ urlPath }/> } />
                        <Route exact path="new" element={ <ProjectDetails mode={"add"} urlPath={ urlPath }/> } />
                        <Route exact path=":projectId" element={ <ProjectDetails mode={"view"} urlPath={ urlPath }/> } />
                        <Route exact path=":projectId/edit" element={ <ProjectDetails mode={"edit"} urlPath={ urlPath }/> } />
                    </Route>
                    <Route exact path="/sogr-builder" element={ <SogrBuilder urlPath={ urlPath }/> } />
                </Routes>
            </HashRouter>
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick/>

        </>
    );
}
