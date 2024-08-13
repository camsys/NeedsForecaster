import React, { useState, useEffect } from "react";

import { HashRouter, Routes, Route } from "react-router-dom";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./App.css";
import {Home} from "./Home";
import {Policies} from "./policies/Policies";

export default function App() {

	return (
		<>
			<HashRouter>
				<Routes>
					<Route exact path="/" element={ <Home/> } />
					<Route exact path="/policies" element={ <Policies/> } />
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
