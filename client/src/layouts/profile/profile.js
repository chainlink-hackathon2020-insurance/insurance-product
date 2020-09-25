import React, { Component, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'rimble-ui';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { Button } from "rimble-ui";
import { ToastMessage } from 'rimble-ui';

function Profile({ address }, context) {
    const [expanded, setExpanded] = useState('panel1');
    const [policies, setPolicies] = useState([]);
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
        const data = await contract.methods.getInsurancePolicies(address).call();
        setPolicies(data);
    }

    return (
        <div className="pure-u-1-1">
            <div>
                <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                        <Typography>Policies</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Transaction hash</th>
                                        <th>Value</th>
                                        <th>Recipient</th>
                                        <th>Time</th>
                                        <th>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>0xeb...cc0</td>
                                        <td>0.10 ETH</td>
                                        <td>0x4fe...581</td>
                                        <td>March 28 2019 08:47:17 AM +UTC</td>
                                        <td>  <Button icon="Pageview" icononly /></td>
                                    </tr>
                                    <tr>
                                        <td>0xsb...230</td>
                                        <td>0.11 ETH</td>
                                        <td>0x4gj...1e1</td>
                                        <td>March 28 2019 08:52:17 AM +UTC</td>
                                        <td>  <Button icon="Pageview" icononly />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>0xed...c40</td>
                                        <td>0.12 ETH</td>
                                        <td>0x3fd...781</td>
                                        <td>March 28 2019 08:55:17 AM +UTC</td>
                                        <td>  <Button icon="Pageview" icononly />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Typography>
                    </AccordionDetails>
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
            </div>

        </div>
    );
}

Profile.contextTypes = {
    drizzle: PropTypes.object
};

export default Profile
