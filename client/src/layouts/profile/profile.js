import React, { Component, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'rimble-ui';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { Button } from "rimble-ui";
import { ToastMessage, Modal, Card, Box, Heading, Text, Flex } from 'rimble-ui';
import { Loader } from 'rimble-ui';
import Map from 'pigeon-maps'
import Marker from 'pigeon-marker'

function Profile({ address }, context) {
    const [expanded, setExpanded] = useState('panel1');
    const [policies, setPolicies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPolicy, setCurrentPolicy] = useState({
        coverageData: {
            trackingData: {

            }
        }
    });

    const contract = context.drizzle.contracts.MarineInsurance;

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };


    useEffect(() => {
        if (address) {
            getPolicies();
        }
    }, [address]);

    async function getPolicies() {
        setLoading(true);
        const data = await contract.methods.getInsurancePolicies(address).call();
        setLoading(false);
        setPolicies(data)
    }

    const getTimestamp = (ts) => {
        if (!ts) {
            return '';
        }
        return new Date(ts * 1000).toISOString();
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
                            <Table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Current Water Level</th>
                                        <th>Reuqest Status</th>
                                        <th>Coverage Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {policies.map((policy, i) => (
                                        <tr>
                                            <td>{policy.trackingData.currentRequestId}</td>
                                            <td>{policy.trackingData.currentWaterLevel}</td>
                                            <td>{policy.trackingData.requestStatus}</td>
                                            <td><Button icon="Pageview" icononly onClick={() => {
                                                setCurrentPolicy(policy);
                                                setShowModal(true);
                                            }} /></td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </Table>
                        </Typography>
                    </AccordionDetails>) : <Loader size="40px" className="box-left-30" /> }
                </Accordion>
                <Accordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                        <Typography>Collapsible Group Item #2</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                        <Typography>Collapsible Group Item #3</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                            sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
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
                            <Text>Start: {currentPolicy ? getTimestamp(currentPolicy.coverageData.startDate) : ''}</Text>
                            <Text>End: {currentPolicy ? getTimestamp(currentPolicy.coverageData.endDate) : ''}</Text>
                            <Text>Water Levels Range: {currentPolicy ? currentPolicy.coverageData.waterLevelMin : ''} to {currentPolicy ? currentPolicy.coverageData.waterLevelMax : ''}</Text>
                            <Text>Daily Claim Amount: {currentPolicy ? currentPolicy.coverageData.dailyClaimAmount : ''}</Text>
                            <Text>Beneficiary: {currentPolicy ? currentPolicy.coverageData.beneficiary : ''}</Text>
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
