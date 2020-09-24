import React, { Component, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ship from "./../../images/ship.svg";
import { Card, Box, Button, Flex, Image, Heading } from "rimble-ui";
import { Icon } from '@rimble/icons';

function Home({ accounts, contract }) {
    return (
        <div className="pure-u-1-1">
            <Card width={"auto"} maxWidth={"100%"} mx={"auto"} my={5} p={0}>
                <Image src={ship} height="auto" />
                <Box px={[3, 3, 4]} py={3}>
                    <Heading.h2>Protect your business with additional named peril insurance</Heading.h2>
                    <Heading.h5 color="#666">Insurance is a life preserver you can always count on when you are sailing through uncharted waters.</Heading.h5>
                </Box>

                <Flex px={[5, 5, 4]} height={300} borderTop={1} borderColor={"#E8E8E8"}>
                    <Box px={[3, 3, 4]} py={3} width={[
                        1,
                        1 / 4,
                        1 / 4,
                    ]}>
                        <Icon name="CardTravel" className="box-left" />
                        <Heading.h5>Shipping Communication</Heading.h5>
                        <Heading.h6 color="#666">Water-Level Ready Insurance provides a specific named peril for Inland Water Transportation businesses. </Heading.h6>
                        <Button >
                            Learn More
                        </Button>
                    </Box>
                    <Box className="box-left" px={[3, 3, 4]} py={3} width={[
                        1,
                        1 / 4,
                        1 / 4,
                    ]}>
                        <Icon name="DirectionsBoat" className="box-left" />
                        <Heading.h5  className="box-left-3">Protection</Heading.h5>
                        <Heading.h6 color="#666">Parametric Insurance is a life preserver you can always count on when you are sailing through uncharted waters.
                         Policies provide coverage for Loss of Business for Inland Water Transportation businesses.  </Heading.h6>
                        <Button >
                            Learn More
                        </Button>
                    </Box>
                    <Box px={[3, 3, 4]} className="box-left" py={3} width={[
                        1,
                        1 / 4,
                        1 / 4,
                    ]}>
                        <Icon name="Settings" className="box-left" />
                        <Heading.h5 className="box-left-3">Named Peril</Heading.h5>
                        <Heading.h6 color="#666">
                            A parametric index of Water-Level Height triggers  an objective (i.e. independently verifiable), transparent, and consistent claims process </Heading.h6>
                        <Button >
                            Learn More
                        </Button>
                    </Box>
                </Flex>
            </Card>
        </div>
    );
}


export default Home
