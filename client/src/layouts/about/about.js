import React, { Component, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ToastMessage, Modal, Card, Box, Heading, Text, Flex, Tooltip, Icon, Image } from 'rimble-ui';

function About({ accounts }) {

    return (
        <div className="pure-u-1-1">
            <Heading as={"h3"}>About</Heading>
            <Text>
                We started Water-level Ready Insurance because high water levels are temporarily closing major shipping seaway channels. For example, an estimated $193 million is lost per week in the U.S. economy if the St. Lawrence Seaway temporarily closes. Last year, the channel was closed for 12 days costing the U.S. economy an estimated $331 million.
 <br />
                <br />
 That's why we created a high-water level named peril parametric insurance policy for inland marine cargo transportation. With parametric insurance, a loss is triggered by a specific automated event, starting the smart contract's automatic execution on the blockchain. With arbitrators removed from the process, the claim will result in a faster payout.
 <br />
                <br />
 For example, If a shipping channel's water level is outside the pre-agreed upon a water-level range, the insured will receive a daily payment within 24-48 hours for loss of business.
 This insurance product would be useful for primary and secondary supply chain infrastructures impacted by the seaway water fluctuation, such as perishable goods manufacturers, commercial shippers, steel manufacturers, miners, construction companies, etc.
 <br />
                <br />
 Overall, we want to make modern life for inland marine cargo transportation businesses more manageable during the times that matter most by providing a 21st-century insurance solution to help support them with adapting to the effects of a changing climate.
 <br />
                <br />
            </Text>
            <Heading as={"h6"}>Sources:</Heading>
            <Text>

                Characklis, G. (2018, April 02). Center on Financial Risk in Environmental Systems: Great Lakes. Retrieved September 27, 2020, from https://sph.unc.edu/cfres/great-lakes/
<br />
                <br />
Figueiredo, R., Martina, M. L., Stephenson, D. B., & Youngman, B. D. (2018). A Probabilistic Paradigm for the Parametric Insurance of Natural Hazards. Risk Analysis, 38(11), 2400-2414. doi:10.1111/risa.13122
<br />
                <br />
Shipping disappointed by season delay: Calls for high-water solutions that protect Seaway trade corridor. (2020). Retrieved September 27, 2020, from https://www.marinedelivers.com/media_release/shipping-disappointed-by-season-delay-calls-for-high-water-solutions-that-protect-seaway-trade-corridor/
<br />
                <br />
            </Text>

        </div>
    );
}


export default About
