import React, { Component } from 'react'
import {AccountData} from "@drizzle/react-components";
import PropTypes from 'prop-types'
import {Link} from "react-router-dom";
import { ethers } from 'ethers';

class Profile extends Component {
    constructor(props, context) {
        super(props)
        this.contracts = context.drizzle.contracts;
        this.web3 = context.drizzle.web3;
        this.account = props.accounts[0];
        //const provider = new ethers.providers.Web3Provider(web3.currentProvider);
        //const name = await provider.lookupAddress(address);
    }



  render() {
    return(
          <div className="pure-u-1-1">
              <AccountData accountIndex="0" units="ether" precision="3"/>
          </div>
    )
  }

}

Profile.contextTypes = {
    drizzle: PropTypes.object
};

export default Profile
