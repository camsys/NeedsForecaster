import React, { useState, useEffect } from "react";
import {Container, Nav, Navbar} from 'react-bootstrap';

import 'react-toastify/dist/ReactToastify.css';
import {toast} from "react-toastify";

// Home component only needed when NF is deployed alone.  Not needed as part of Asset Cloud workflow

export const Home = () => {
	function testApi(selectedKey) {
		if (selectedKey === 'testApi') {
			const requestOptions = {
				method: "GET",
				credentials: "include"
			};

			console.log('testing');

			fetch("/api/test_api", requestOptions)
				.then((response) => {
					if (!response.ok) {throw Error}
					return response
						.text()
						.then((data) => {
							console.log(data);
						})
				})
				.catch((e) => {
					toast.error("Test API failed.");
				});

		}
	}

	return (
		<Container>
			<Navbar bg="dark" variant="dark">
				<Navbar.Text>Needs Forecaster v{window.env.VERSION}</Navbar.Text>
				<Nav onSelect={testApi}>
					<Nav.Link href="#/">Home</Nav.Link>
					<Nav.Link href="#/policies">Policies</Nav.Link>
					<Nav.Link href="#/projects">Projects</Nav.Link>
					<Nav.Link href="#/sogr-builder">SOGR Project Builder</Nav.Link>
					<Nav.Link eventKey='testApi'>Test API</Nav.Link>
				</Nav>
			</Navbar>
			<h1>Welcome to Needs Forecaster, {window.env.USER_NAME}!</h1>
		</Container>
	);
}
