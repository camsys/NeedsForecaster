import React, { useState, useEffect } from "react";
import {Container, Nav, Navbar} from 'react-bootstrap';

import 'react-toastify/dist/ReactToastify.css';

// Home component only needed when NF is deployed alone.  Not needed as part of Asset Cloud workflow

export const Home = () => {

	return (
		<Container>
			<Navbar bg="dark" variant="dark">
				<Navbar.Text>Needs Forecaster v{window.env.VERSION}</Navbar.Text>
				<Nav>
					<Nav.Link href="#/">Home</Nav.Link>
					<Nav.Link href="#/policies">Policies</Nav.Link>
					<Nav.Link href="#/projects">Projects</Nav.Link>
				</Nav>
			</Navbar>
			<h1>Welcome to Needs Forecaster!</h1>
		</Container>
	);
}
