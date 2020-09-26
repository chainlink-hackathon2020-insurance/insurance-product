import React, { Component, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ToastMessage, Modal, Card, Box, Heading, Text, Flex, Button, Icon } from 'rimble-ui';

function Contact({ accounts, drizzleStatus }) {
    return (
        <div className="pure-u-1-1">
            <Card width={"auto"} maxWidth={"600px"} mx={"auto"} px={[3, 3, 4]}>
                <Text
                    caps
                    fontSize={0}
                    fontWeight={4}
                    mb={3}
                    display={"flex"}
                    alignItems={"center"}
                >
                    <Icon name={"Code"} mr={2} />
                         https://github.com/chainlink-hackathon2020-insurance
                    </Text>

                    <Text
                    caps
                    fontSize={0}
                    fontWeight={4}
                    mb={3}
                    display={"flex"}
                    alignItems={"center"}
                >
                    <Icon name={"Code"} mr={2} />
                        https://market.link/adapters/90ee0252-f8e5-4437-bfd4-1f95089620ea
                    </Text>
            </Card>
        </div>
    );
}


export default Contact
