import React, { Component, useState, useEffect, PropTypes } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import HomeContainer from './layouts/home/home.connect'
import SideBarContainer from './layouts/sidebar/sidebar.connect'
import HeaderNavContainer from './layouts/header/headernav.connect'
import ProfileContainer from './layouts/profile/profile.connect'
import AboutContainer from './layouts/about/about.connect'
import ContactContainer from './layouts/contact/contact.connect'
import PolicyContainer from './layouts/policy/policy.connect'
import ClaimsContainer from './layouts/claims/claims.connect'
import DashboardContainer from './layouts/dashboard/dashboard.connect'
import { ToastMessage } from 'rimble-ui';

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
    if (!address) {
      getAccounts();
    }
  }, [address]);

  const preflightCheck = () => {
    if (window.ethereum) {
      window.ethereum.enable();
    }
  };

  const getAccounts = () => {
    drizzle.web3.eth.getAccounts((error, result) => {
      if (error) {
        console.log(error);
      } else {
        setAddress(result[0]);
        subscribeEvents(drizzle.contracts.MarineInsurance);
      }
    });
  }


  const subscribeEvents = (contract) => {
    contract.events.allEvents(
      {
        filter: { beneficiary: address },
      }
    )
      .on('data', data => {
        let message = '', actionRef = '', vari = '';
        switch (data.event) {
          case 'InsurancePolicyCreation':
            return;
          case 'ClaimPayout':
            vari = 'success';
            message = 'A Payout has been made.'
            actionRef = '/profile#panel2'
            break;
          case 'InsurancePolicyExpired':
            vari = 'failure';
            actionRef = '/profile#panel1'
            message = 'Insurance Policy Expired'
            break;
        }
        window.toastProvider.addMessage(message, {
          secondaryMessage: "",
          actionHref: actionRef,
          actionText: "Check",
          variant: vari //success,processing,failure
        });
        debugger
      })
  }

  return (
    <div className="App">
      <HeaderNavContainer
        drizzle={drizzle}
        drizzleState={drizzleState}
        preflightCheck={preflightCheck}
      />
      <SideBarContainer drizzle={drizzle} />
      <main className="container">
        <div className="pure-g">
        <div className="pure-u-1-1">
          <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
          </div>
          <Switch>
            <Route exact={true} path="/" component={HomeContainer} />
            <Route exact={true} path="/policy" component={PolicyContainer} />
            <Route exact={true} path="/profile" component={ProfileContainer} />
            <Route exact={true} path="/claims" component={ClaimsContainer} />
            <Route exact={true} path="/dashboard" component={DashboardContainer} />
            <Route exact={true} path="/about" component={AboutContainer} />
            <Route exact={true} path="/contact" component={ContactContainer} />
          </Switch>
        </div>

      </main>
    </div>
  );
}

export default App
