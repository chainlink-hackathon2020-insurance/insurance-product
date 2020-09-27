import React, { Component, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ship from "./../../images/ship.svg";
import { Card, Box, Button, Flex, Image, Heading } from "rimble-ui";
import { Icon } from '@rimble/icons';

function Dashboard({ accounts }, context) {
    const [eventData, setEventData] = useState(undefined);
    const [web3, setWeb3] = useState(context.drizzle.web3);

    const groupBy = (array, property) => {
        var hash = {};
        for (var i = 0; i < array.length; i++) {
            if (!hash[array[i][property]]) hash[array[i][property]] = [];
            hash[array[i][property]].push(array[i]);
        }
        return hash;
    }

    const getTotalPayout = (data) => {
        let value = 0;
        data.forEach(x => {
            value += parseFloat(x.returnValues.amountPaid);
        })
        return web3.utils.fromWei(value.toString(), 'ether') + ' ETH';
    }

    async function fetchPastEvents() {
        const web3 = context.drizzle.web3;
        const drizzleContract = context.drizzle.contracts.MarineInsurance;
        const contract = new web3.eth.Contract(drizzleContract.abi, drizzleContract.address);
        await contract.getPastEvents('allEvents',
            {
                fromBlock: 0,
                toBlock: 'latest',
            },
            function (err, data) {
                if (!err) {
                    var groupedData = groupBy(data, 'event');
                    setEventData(groupedData);
                }
            });
    }

    useEffect(() => {
        if (!eventData) {
            fetchPastEvents();
        }
    }, [eventData]);

    return (
        <div className="pure-u-1-1">
            <Flex>
                <Card width={"auto"} maxWidth={"420px"} mx={"auto"} >
                    <Box px={[3, 3, 4]} py={3}>
                        <Heading.h5>Total Policies Created</Heading.h5>
                        <Heading.h2 color="#666">{eventData?.InsurancePolicyCreation ? eventData?.InsurancePolicyCreation?.length : 0}</Heading.h2>
                    </Box>
                </Card>
                <Card width={"auto"} maxWidth={"420px"} mx={"auto"} >
                    <Box px={[3, 3, 4]} py={3}>
                        <Heading.h5>Total Claims</Heading.h5>
                        <Heading.h2 color="#666">{eventData?.ClaimPayout ? eventData?.ClaimPayout?.length : 0}</Heading.h2>
                    </Box>
                </Card>
                <Card width={"auto"} maxWidth={"420px"} mx={"auto"} >
                    <Box px={[3, 3, 4]} py={3}>
                        <Heading.h5>Total Money Paid Out</Heading.h5>
                        <Heading.h2 color="#666">{eventData?.ClaimPayout ? getTotalPayout(eventData?.ClaimPayout) : '0 ETH'}</Heading.h2>
                    </Box>
                </Card>
            </Flex>


        </div>
    );
}

Dashboard.contextTypes = {
    drizzle: PropTypes.object
};

export default Dashboard
