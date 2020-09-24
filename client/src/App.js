import React, { Component, useState, useEffect } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import HomeContainer from './layouts/home/home.connect'
import SideBarContainer from './layouts/sidebar/sidebar.connect'
import HeaderNavContainer from './layouts/header/headernav.connect'
import ProfileContainer from './layouts/profile/profile.connect'
import AboutContainer from './layouts/about/about.connect'
import ContactContainer from './layouts/contact/contact.connect'
import PolicyContainer from './layouts/policy/policy.connect'
import ClaimsContainer from './layouts/claims/claims.connect'

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
      <SideBarContainer />
      <main className="container">
        <div className="pure-g">
          <Switch>
            <Route exact={true} path="/" component={() => <HomeContainer contract={drizzle.contracts.MarineInsurance} />} />
            <Route exact={true} path="/policy" component={() => <PolicyContainer contract={drizzle.contracts.MarineInsurance} />} />
            <Route exact={true} path="/profile" component={() => <ProfileContainer contract={drizzle.contracts.MarineInsurance} />} />
            <Route exact={true} path="/claims" component={() => <ClaimsContainer contract={drizzle.contracts.MarineInsurance} />} />
            <Route exact={true} path="/about" component={AboutContainer} />
            <Route exact={true} path="/contact" component={ContactContainer} />
          </Switch>
        </div>

      </main>
    </div>
  );
}

export default App
