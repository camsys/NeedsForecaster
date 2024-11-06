import React, { useState, useEffect } from "react";

import { HashRouter, Routes, Route } from "react-router-dom";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./App.css";
import {Home} from "./Home";
import {Policies} from "./policies/Policies";
import {Projects} from "./projects/Projects";
import {ProjectForm} from "./projects/ProjectForm";
import {SogrBuilder} from "./sogr-builder/SogrBuilder";
import { library } from '@fortawesome/fontawesome-svg-core'
import {faClone, faPencil, faChevronDown, faPlusCircle, faMinusCircle, faFloppyDisk, faXmark, faMagnifyingGlass, faSquare, faSquareCheck, faCircleCheck, faFileArrowDown, faTableColumns, faAngleLeft, faAngleRight, faCircleXmark, faCircleInfo, faCirclePlay, faEye} from '@fortawesome/free-solid-svg-icons'
import {faCheckSquare as farSquareCheck, faSquare as farSquare, faHourglassHalf as farHourglassHalf} from '@fortawesome/free-regular-svg-icons'

export default function App() {

	library.add(faClone, faPencil, faChevronDown, faPlusCircle, faMinusCircle, faFloppyDisk, faXmark, faMagnifyingGlass, faSquare, farSquare, faSquareCheck, farSquareCheck, faCircleCheck, faFileArrowDown, faTableColumns, faAngleLeft, faAngleRight, faCircleXmark, faCircleInfo, faCirclePlay, farHourglassHalf, faEye);
	return (
		<>
			<HashRouter>
				<Routes>
					<Route exact path="/" element={ <Home/> } />
					<Route exact path="/policies" element={ <Policies/> } />
					<Route exact path="/projects" element={ <Projects/> } />
					<Route exact path="/projects/new" element={ <ProjectForm mode={"add"}/> } />
					<Route exact path="/projects/:id" element={ <ProjectForm mode={"view"}/> } />
					<Route exact path="/projects/:id/edit" element={ <ProjectForm mode={"edit"}/> } />
					<Route exact path="/sogr-builder" element={ <SogrBuilder/> } />
				</Routes>
			</HashRouter>  		
			<ToastContainer 
				position="bottom-left"
				autoClose={5000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick/>

			<div hidden>NFv{window.env.VERSION}</div>
		</>
	);
}
