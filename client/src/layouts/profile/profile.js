import React, { Component, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'rimble-ui';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { Button } from "rimble-ui";
import { ToastMessage, Modal, Card, Box, Heading, Text, Flex, Tooltip, Icon, Image } from 'rimble-ui';
import { Loader } from 'rimble-ui';
import Map from 'pigeon-maps'
import Marker from 'pigeon-marker'
import ErrorIcon from "./../../images/error.svg"
import SuccessIcon from "./../../images/success.svg"

function Profile({ address, location }, context) {
    const [expanded, setExpanded] = useState(location.hash === '' ? 'panel1' : location.hash.split('#')[1]);
    const [policies, setPolicies] = useState([]);
    const [claims, setClaims] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [claimsLoading, setClaimsLoading] = useState(false);
    const [currentPolicy, setCurrentPolicy] = useState({
        coverageData: {
            trackingData: {

            }
        }
    });

    const contract = context.drizzle.contracts.MarineInsurance;
    const web3 = context.drizzle.web3;
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };


    useEffect(() => {
        if (address) {
            getPolicies();
            getClaims();
        }
    }, [address]);

    async function getPolicies() {
        setLoading(true);
        const ids = await contract.methods.getInsurancePolicyIds().call();
        const data = await Promise.all(ids.map(async id => {
            let policy = await contract.methods.insurancePolicies(id).call();
            policy.id = id;
            return policy
        }));
        setPolicies(data);
        setLoading(false);
    }

    const getPolicyStatus = (data) => {
        const startDate = getTimestamp(data.coverageData.startDate);
        const endDate = getTimestamp(data.coverageData.endDate);
        const now = new Date().toISOString();
        if (now > endDate) {
            return (
                <Tooltip message="Expired">
                    <Icon name="Close" color="red" />
                </Tooltip>
            );
        }
        if (now >= startDate && now <= endDate) {
            return (
                <Tooltip message="Active">
                    <Icon name="Done" color="green" />
                </Tooltip>
            );
        } else {
            return (
                <Tooltip message="Inactive">
                    <Icon name="Warning" color="orange" />
                </Tooltip>
            );
        }
    }

    async function getClaims() {
        setClaimsLoading(true);
        await contract.events.ClaimPayout(
            {
                filter: { beneficiary: address },
                fromBlock: 0,
            }
        )
            .on('data', claims => {
                setClaimsLoading(false);
                setClaims(c => ([...c, claims.returnValues]))
            })
    }

    const getTimestamp = (ts) => {
        if (!ts) {
            return '';
        }
        return new Date(ts * 1000).toISOString();
    }

    const getWaterLevel = (wl) => {
        return wl;
    }

    const getPayment = (w) => {
        if (w) {
            return web3.utils.fromWei(w, 'ether') + 'ETH';
        }
        return '0 ETH';
    }

    const getStatus = (s) => {
        switch (s) {
            case '0':
                return 'Not Yet fetched.';
            case '1':
                return 'Fetching';
            case '2':
                return 'Fetched.';
        }
    }

    return (
        <div className="pure-u-1-1">
            <div>

                <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                        <Typography>Policies</Typography>
                    </AccordionSummary>
                    {!loading ? (<AccordionDetails>
                        <Typography>
                            {policies.length > 0 ? (<Table>
                                <thead>
                                    <tr>
                                        <th>POLICY #</th>
                                        <th>Water Level (MSL in cm.)</th>
                                        <th>Water Data</th>
                                        <th>Details</th>
                                        <th>Policy Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {policies.map((policy) => (
                                        <tr>
                                            <td>{policy.id}</td>
                                            <td>{getWaterLevel(policy.trackingData.currentWaterLevel)}</td>
                                            <td>{getStatus(policy.trackingData.requestStatus)}</td>
                                            <td><Button icon="Pageview" icononly onClick={() => {
                                                setCurrentPolicy(policy);
                                                setShowModal(true);
                                            }} /></td>
                                            <td>{getPolicyStatus(policy)}</td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </Table>) : 'No policies have been created yet.'}
                        </Typography>
                    </AccordionDetails>) : <Loader size="40px" className="box-left-30" />}
                </Accordion>
                <Accordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                        <Typography>Payout History</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {claims.length > 0 ? (!claimsLoading ?
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>For Policy #</th>
                                            <th>Payment</th>
                                            <th>Transaction</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {claims.map((claim, i) => (
                                            <tr>
                                                <td>{claim.insuranceIdentifier}</td>
                                                <td>{getPayment(claim.amountPaid)}</td>
                                                <td><Button icon="Pageview" icononly onClick={() => {

                                                }} /></td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>
                                </Table>
                                : <Loader size="40px" className="box-left-30" />) : 'You have no claims.'}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Modal isOpen={showModal}>
                    <Card width={"25%"} p={0}>
                        <Button.Text
                            icononly
                            icon={"Close"}
                            color={"moon-gray"}
                            position={"absolute"}
                            top={0}
                            right={0}
                            mt={3}
                            mr={3}
                            onClick={() => setShowModal(false)}
                        />

                        <Box p={4} mb={3}>
                            <Heading.h3>Coverage Details</Heading.h3>
                            <Text><b>Start:</b> {currentPolicy ? getTimestamp(currentPolicy.coverageData.startDate) : ''}</Text>
                            <Text><b>End:</b> {currentPolicy ? getTimestamp(currentPolicy.coverageData.endDate) : ''}</Text>
                            <Text><b>Water Levels Range (MSL in cm.):</b> {currentPolicy ? currentPolicy.coverageData.waterLevelMin : ''} to {currentPolicy ? currentPolicy.coverageData.waterLevelMax : ''}</Text>
                            <Text><b>Daily Claim Amount:</b> {currentPolicy ? currentPolicy.coverageData.dailyClaimAmount : ''}</Text>
                            <Text><b>Beneficiary:</b> {currentPolicy ? currentPolicy.coverageData.beneficiary : ''}</Text>
                            <Box style={{ height: '20vh', width: '100%' }} width={[1, 1, 1 / 2]} px={3}>
                                {currentPolicy.trackingData ? (<Map
                                    center={[parseFloat(currentPolicy.trackingData.location.lat), parseFloat(currentPolicy.trackingData.location.lng)]}
                                    zoom={4}
                                    minZoom={3}
                                    maxZoom={16}>
                                    <Marker anchor={[parseFloat(currentPolicy.trackingData.location.lat), parseFloat(currentPolicy.trackingData.location.lng)]} payload={1} onClick={({ event, anchor, payload }) => { }} />
                                </Map>) : null}
                            </Box>
                        </Box>
                    </Card>
                </Modal>
            </div>

        </div>
    );
}

Profile.contextTypes = {
    drizzle: PropTypes.object
};

export default Profile
