import React, { Component, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ship from "./../../images/ship.svg";
import { Card, Box, Button, Flex, Image, Heading } from "rimble-ui";
import { Icon } from '@rimble/icons';

function Dashboard(props, context) {
    return (
        <div className="pure-u-1-1">
            dashboard page
        </div>
    );
}

Dashboard.contextTypes = {
    drizzle: PropTypes.object
};

export default Dashboard
