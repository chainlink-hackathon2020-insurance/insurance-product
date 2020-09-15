import React, { Component, useState, useEffect } from 'react'
import {Switch, Route, Link} from 'react-router-dom'
import HomeContainer from './layouts/home/home.connect'
import HeaderNavContainer from './layouts/header/headernav.connect'
import { Avatar } from "rimble-ui";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';


// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App({ drizzle, drizzleState, store }) {
    const [address, setAddress] = useState(null);
    const [route, setRoute] = useState("Home");
  
    useEffect(() => {
      if (drizzleState) {
        setAddress(drizzleState.accounts["0"]);
      }
    }, [drizzleState]);
  
    const preflightCheck = () => {
      if (window.ethereum) {
        window.ethereum.enable();
      }
    };

        return (
            <div className="App">
                        <HeaderNavContainer
                            drizzle={drizzle}
                            drizzleState={drizzleState}
                            preflightCheck={preflightCheck}
                            />
                <br/>
                <br/>
                <main className="container">
                    <div className="pure-g">
                    <Switch>
                            <Route exact={true} path="/" component={HomeContainer}/>
                    </Switch>
                    </div>

                </main>
            </div>
        );
    }

export default App
