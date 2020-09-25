import React, { Component, useState, useEffect, createContext } from 'react'
import PropTypes from 'prop-types'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import ButtonMat from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styled from "styled-components";
import { EthAddress, Link } from "rimble-ui";
import { MetaMaskButton } from 'rimble-ui';
import { Field, Input, Form, Flex, Box, Heading, Select, Tooltip, Modal, Card, Icon, Text, Loader, Button, Image } from 'rimble-ui';
import Map from 'pigeon-maps'
import Marker from 'pigeon-marker'
import Overlay from 'pigeon-overlay'
import MetaMaskIcon from "./../../images/icon-metamask.svg"

const StyledButton = styled(ButtonMat)`
    margin-right: 1rem;
`;

const StyledTypography = styled(Typography)`
margin-top: 1rem;
marginBottom: 1rem;
`;

function getSteps() {
  return ['Dates', 'Locations', 'Cargo Details', 'Coverage & Payout', 'Review & Purchase'];
}


function Policy({ accounts }, context) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [locations, setLocations] = useState([]);
  const [mapFirstClick, setMapFirstClick] = useState(true);
  const [premium, setPremium] = useState(undefined);
  const [address, setAddress] = useState(accounts[0]);
  const [paymentComplete, setPaymentComplete] = useState(undefined);
  const [mapProperties, setMapProperties] = useState({
    center: [50.1102, 3.1506],
    zoom: 4,
    minZoom: 3,
    maxZoom: 16,
  })
  const [cargoDetails, setCargoDetails] = useState({
    shipmentValue: 0
  })
  const [web3, setWeb3] = useState(context.drizzle.web3);
  const contract = context.drizzle.contracts.MarineInsurance;

  const steps = getSteps();

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (<div className="box-left">
          <br />
          <br />
          <Form validated={true}>
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box px={3}>
                <Heading.h2>Protect your business with additional named peril insurance</Heading.h2>
                <Heading.h5 color="#666">Insurance is a life preserver you can always count on when you are sailing through uncharted waters.</Heading.h5>
              </Box>
            </Flex>
            <br />
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box width={[1, 1, 1 / 2]} px={3}>
                <Field label="From" >
                  <Input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)}

                    min={new Date().toISOString().split('T')[0]} />
                </Field>
              </Box>
              <Field label="To" >
                <Input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} />
              </Field>
            </Flex>

          </Form>
        </div>
        );
      case 1:
        return (
          <div className="box-left">
            <br />
            <br />
            <Form validated={true}>
              <Flex mx={-3} flexWrap={"wrap"}>
                <Box px={3}>
                  <Heading.h2>Select a Coverage Location</Heading.h2>
                </Box>
              </Flex>
              <br />
              <Flex mx={-3} flexWrap={"wrap"}>
                <Box style={{ height: '40vh', width: '100%' }} width={[1, 1, 1 / 2]} px={3}>
                  <Map onClick={onMapClick}
                    center={mapProperties.center}
                    zoom={mapProperties.zoom}
                    minZoom={mapProperties.minZoom}
                    maxZoom={mapProperties.maxZoom}

                  >
                    {locations.map((cordinate, i) => (
                      <Marker anchor={[cordinate.lat, cordinate.lng]} payload={1} onClick={({ event, anchor, payload }) => { }} />
                    ))
                    }
                  </Map>
                </Box>
                <Box width={[1, 1, 1 / 2]} px={3}>
                  <Flex mx={-3} flexWrap={"wrap"}>
                    <Box width={[1, 1, 1 / 2]} px={3}>
                      <Field label="Starting location of voyage">
                        <Input type="text" disabled required value={locations.length > 0 ? getCordinateFormat(locations[0]) : ''} />
                      </Field>
                    </Box>
                  </Flex>

                  <Flex mx={-3} flexWrap={"wrap"}>
                    <Box width={[1, 1, 1 / 2]} px={3}>
                      <Field label="Ending location of voyage">
                        <Input type="text" disabled required value={locations.length > 1 ? getCordinateFormat(locations[1]) : ''} />
                      </Field>
                    </Box>
                  </Flex>
                </Box>
              </Flex>

            </Form>
          </div>
        ); case 2:
        return (<div>
          <Form validated={true}>
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box width={[1, 1, 1 / 2]} px={3}>
                <Field label="Shipment Value" width={1}>
                  <Input
                    type="number"
                    required // set required attribute to use brower's HTML5 input validation
                    width={1}
                    onChange={(e) => setCargoDetails({ shipmentValue: e.target.value })}
                    value={cargoDetails.shipmentValue}
                  />
                </Field>
              </Box>
              <Box width={[1, 1, 1 / 2]} px={3}>
                <Field label="Form Email Input" width={1}>
                  <Form.Input
                    type="email"
                    required // set required attribute to use brower's HTML5 input validation
                    width={1}
                  />
                </Field>
              </Box>
            </Flex>
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box width={[1, 1, 1 / 2]} px={3}>
                <Field label="Plain Input" width={1}>
                  <Input
                    type="text"
                    required // set required attribute to use brower's HTML5 input validation
                    width={1}
                  />
                </Field>
              </Box>
              <Box width={[1, 1, 1 / 2]} px={3}>
                <Field label="Form Email Input" width={1}>
                  <Form.Input
                    type="email"
                    required // set required attribute to use brower's HTML5 input validation
                    width={1}
                  />
                </Field>
              </Box>
            </Flex>
          </Form>
        </div>
        ); case 3:
        return (<div>
          <Form>
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box width={[1, 1, 1 / 2]} px={3}>
                <Field label="Plain Input" width={1}>
                  <Input
                    type="text"
                    required // set required attribute to use brower's HTML5 input validation
                    width={1}
                  />
                </Field>
              </Box>
              <Box width={[1, 1, 1 / 2]} px={3}>
                <Field label="Form Email Input" width={1}>
                  <Form.Input
                    type="email"
                    required // set required attribute to use brower's HTML5 input validation
                    width={1}
                  />
                </Field>
              </Box>
            </Flex>
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box width={[1, 1, 1 / 2]} px={3}>
                <Field label="Plain Input" width={1}>
                  <Input
                    type="text"
                    required // set required attribute to use brower's HTML5 input validation
                    width={1}
                  />
                </Field>
              </Box>
              <Box width={[1, 1, 1 / 2]} px={3}>
                <Field label="Form Email Input" width={1}>
                  <Form.Input
                    type="email"
                    required // set required attribute to use brower's HTML5 input validation
                    width={1}
                  />
                </Field>
              </Box>
            </Flex>
          </Form>
        </div>
        ); case 4:
        calculatePremium(contract)
        return (<div>
          <br />
          <br />
          {confirmationUI()}
        </div>
        );
      default:
        return 'Unknown step';
    }
  }

  async function calculatePremium(contract) {
    if (!premium) {
      const data = await contract.methods.calculatePremium(cargoDetails).call();
      setPremium(data);
    }
  }

  const getCargoDetails = () => {
    return cargoDetails.shipmentValue;
  }

  const getCordinateFormat = (location) => {
    return location.lat + " , " + location.lng;
  }
  const isStepOptional = (step) => {
    return step === -1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const confirmationUI = () => {
    return (

      <Card borderRadius={1} p={0}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          borderBottom={1}
          borderColor="near-white"
          p={[3, 4]}
          pb={3}
        >
          <Image
            src={MetaMaskIcon}
            aria-label="MetaMask extension icon"
            size="50px"
          />
          <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
            Confirm your purchase
    </Heading>
          <Link>
            <Icon name="" color="moon-gray" aria-label="Close" />
          </Link>
        </Flex>
        <Box p={[3, 4]}>
          <Flex justifyContent={"space-between"} flexDirection={"column"}>
            <Text textAlign="center">
              Double check the details here – your purchase can't be refunded.
      </Text>
            <Flex
              alignItems={"stretch"}
              flexDirection={"column"}
              borderRadius={2}
              borderColor={"moon-gray"}
              borderWidth={1}
              borderStyle={"solid"}
              overflow={"hidden"}
              my={[3, 4]}
            >
              <Box bg={"primary"} px={3} py={2}>
                <Text color={"white"}>Policy</Text>
              </Box>
              <Flex
                p={3}
                borderBottom={"1px solid gray"}
                borderColor={"moon-gray"}
                alignItems={"center"}
                flexDirection={["column", "row"]}
              >
                <Box
                  position={"relative"}
                  height={"2em"}
                  width={"2em"}
                  mr={[0, 3]}
                  mb={[3, 0]}
                >
                  <Box position={"absolute"} top={"0"} left={"0"}>
                    <Loader size={"2em"} />
                  </Box>
                </Box>
                <Box>
                  <Text
                    textAlign={["center", "left"]}
                    fontWeight={"600"}
                    fontSize={1}
                    lineHeight={"1.25em"}
                  >
                    Waiting for confirmation...
            </Text>
                </Box>
              </Flex>
              <Flex
                justifyContent={"space-between"}
                bg="light-gray"
                p={[2, 3]}
                borderBottom={"1px solid gray"}
                borderColor={"moon-gray"}
                flexDirection={["column", "row"]}
              >
                <Text
                  textAlign={["center", "left"]}
                  color="near-black"
                  fontWeight="bold"
                >
                  Policy Details
          </Text>

                <Box>
                  <Text fontWeight="bold">Duration: {startDate} to {endDate}</Text>
                  <Text fontWeight="bold">Voyage: {getCordinateFormat(locations[0])} to {getCordinateFormat(locations[1])}</Text>
                  <Text fontWeight="bold">Cargo: {getCargoDetails()}</Text>
                </Box>
              </Flex>
              <Flex
                justifyContent={"space-between"}
                bg="light-gray"
                p={[2, 3]}
                borderBottom={"1px solid gray"}
                borderColor={"moon-gray"}
                flexDirection={["column", "row"]}
              >
                <Text
                  textAlign={["center", "left"]}
                  color="near-black"
                  fontWeight="bold"
                >
                  Your account
          </Text>
                <Link
                  href={"https://rinkeby.etherscan.io/address/" + address}
                  target={"_blank"}
                >
                  <Tooltip message={address}>
                    <Flex
                      justifyContent={["center", "auto"]}
                      alignItems={"center"}
                      flexDirection="row-reverse"
                    >
                      <Text fontWeight="bold">{address.slice(0, 6)}...{address.slice(address.length - 4)}</Text>
                      <Flex
                        mr={2}
                        p={1}
                        borderRadius={"50%"}
                        bg={"primary-extra-light"}
                        height={"2em"}
                        width={"2em"}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon color={"primary"} name="RemoveRedEye" size={"1em"} />
                      </Flex>
                    </Flex>
                  </Tooltip>
                </Link>
              </Flex>
              <Flex
                justifyContent={"space-between"}
                bg="near-white"
                py={[2, 3]}
                px={3}
                alignItems={"center"}
                borderBottom={"1px solid gray"}
                borderColor={"moon-gray"}
                flexDirection={["column", "row"]}
              >
                <Flex alignItems={"center"}>
                  <Text
                    textAlign={["center", "left"]}
                    color="near-black"
                    fontWeight="bold"
                  >
                    Premium Price
            </Text>
                  <Tooltip
                    message="Calculated based on your duration, voyage location and shipment value."
                    position="top"
                  >
                    <Icon
                      ml={1}
                      name={"InfoOutline"}
                      size={"14px"}
                      color={"primary"}
                    />
                  </Tooltip>

                </Flex>
                <Flex
                  alignItems={["center", "flex-end"]}
                  flexDirection={["row", "column"]}
                >
                  {premium ? (
                    <Box>
                      <Text
                        textAlign={["center", "left"]}
                        fontWeight={"600"}
                        fontSize={1}
                        lineHeight={"1.25em"}
                      >
                        {web3.utils.fromWei(premium, 'ether')} ETH
                      </Text>
                    </Box>
                  ) : <Flex
                    p={3}
                    alignItems={"center"}
                    flexDirection={["column", "row"]}
                  >
                      <Box
                        position={"relative"}
                        height={"2em"}
                        width={"2em"}
                        mr={[0, 3]}
                        mb={[3, 0]}
                      >
                        <Box position={"absolute"} top={"0"} left={"0"}>
                          <Loader size={"2em"} />
                        </Box>
                      </Box>
                      <Box>
                        <Text
                          textAlign={["center", "left"]}
                          fontWeight={"600"}
                          fontSize={1}
                        >
                          Calculating Premium
            </Text>
                      </Box>
                    </Flex>

                  }
                </Flex>
              </Flex>
            </Flex>
            <Button.Outline onClick={makePayment} width="30%">Make Payment</Button.Outline>
          </Flex>
        </Box>
      </Card>
    );
  }

  async function makePayment() {
    if (!paymentComplete) {
      debugger
       await contract.methods.registerInsurancePolicy(
        cargoDetails,
        locations[0],
        getTimeForSmartContract(startDate),
        getTimeForSmartContract(endDate),
        address
      ).send({value : premium})
      .on('transactionHash', function(hash){
        debugger
      })
      .on('confirmation', function(confirmationNumber, receipt){
        debugger
      })
      .on('receipt', function(receipt){
        debugger
      })
      .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        debugger
      });
    }
  }

  const onMapClick = (e) => {
    const lat = e.latLng[0];
    const long = e.latLng[1];
    const loc = locations;
    var data = {
      lat: lat,
      lng: long
    };
    if (mapFirstClick) {
      if (locations.length === 0) {
        loc.push(data);
      } else {
        loc[0] = data;
      }
    } else {
      if (locations.length === 1) {
        loc.push(data);
      } else {
        loc[1] = data;
      }
    }
    setMapFirstClick(!mapFirstClick);
    setLocations(loc);
  }

  const isNextDisabled = () => {
    switch (activeStep) {
      case 0:
        if (startDate === undefined || endDate === undefined) {
          return true; //todo make true
        }
        return false;
      case 1:
        if (locations.length == 2) {
          return false;
        }
        return true; //todo make true
      case 2:
        return false;
      case 3:
        return false;
      case 4:
        return false;
      default:
        return true;
    }
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    setEndDate(undefined);
    setStartDate(undefined);
    setLocations([]);
    setPremium(undefined);
    setMapFirstClick(false);
  };

  const getTimeForSmartContract = (t) => {
    return Math.floor(new Date(t).getTime() / 1000);
  }

  return (
    <div className="pure-u-1-1">
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <StyledTypography>
              All steps completed - you&apos;re finished
                </StyledTypography>
            <StyledButton onClick={handleReset}>
              Reset
                </StyledButton>
          </div>
        ) : (
            <div>
              <br />
              <StyledTypography>{getStepContent(activeStep)}</StyledTypography>
              <br />
              <br />
              <div>
                <StyledButton disabled={activeStep === 0} onClick={handleBack}>
                  Back
                  </StyledButton>

                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={isNextDisabled()}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </StyledButton>
              </div>
            </div>
          )}
      </div>

    </div>
  );
}

Policy.contextTypes = {
  drizzle: PropTypes.object
};

export default Policy
