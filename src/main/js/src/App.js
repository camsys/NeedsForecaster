import React, { useState, useEffect } from "react";

import { HashRouter, Routes, Route } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./App.css";
import {Home} from "./Home";

export default function App() {

	return (
		<>
			<HashRouter>    
				<Navbar bg="dark" variant="dark">
					<Navbar.Brand href="/#/" title={window.env.VERSION}><span className="img">Needs Forecaster</span>Needs Forecaster</Navbar.Brand>
					<Navbar.Text>v0.0.0</Navbar.Text>
					<Navbar>  
						<Nav>
						<Nav.Link href="#/">Home</Nav.Link>
						</Nav>
					</Navbar>

					<Navbar className="justify-content-end tools" variant="dark">
						<Navbar.Text>
							{window.env.USER_NAME}
						</Navbar.Text>
				    </Navbar>
				</Navbar>
				<Routes>
					<Route exact path="/" element={ <Home/> } />
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