import React, { Component } from 'react'
import {Switch, Route, Link} from 'react-router-dom'
import ProfileContainer from "./layouts/profile/ProfileContainer";
import HomeContainer from './layouts/home/HomeContainer'
import { Avatar } from "rimble-ui";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';


// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
    render() {
        return (
            <div className="App">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#pricing">Pricing</Nav.Link>
                <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>
                </Nav>
                <Nav>
                <Nav.Link href="#deets">More deets</Nav.Link>
                <Nav.Link eventKey={2} href="#memes">
                    Dank memes
                </Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
                <br/>
                <br/>
                <main className="container">
                    <div className="pure-g">
                    <Switch>
                            <Route exact={true} path="/" component={HomeContainer}/>
                            <Route exact={true} path="/profile" component={ProfileContainer}/>
                    </Switch>
                    </div>

                </main>
            </div>
        );
    }
}

export default App
