import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Home extends Component {
    constructor(props, context) {
        super(props)
        this.contracts = context.drizzle.contracts;
        this.web3 = context.drizzle.web3;
        this.account = props.accounts[0];
    }

    render() {
        return (
            <div className="pure-u-1-1">
            </div>
        )
    }
}

Home.contextTypes = {
    drizzle: PropTypes.object
};

export default Home
