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
import { Field, Input, Form, Flex, Box, Heading, Select, Tooltip, Modal, Card, Icon, Text, Loader, Button, Image, ToastMessage } from 'rimble-ui';
import Map from 'pigeon-maps'
import Marker from 'pigeon-marker'
import Overlay from 'pigeon-overlay'
import MetaMaskIcon from "./../../images/icon-metamask.svg"
import ErrorIcon from "./../../images/error.svg"
import AnimatedIconProcessing from 'rimble-ui/dist/es/ToastMessage/AnimatedIconProcessing';
import Conditions from "./../../images/conditions.png"

const StyledButton = styled(ButtonMat)`
    margin-right: 1rem;
`;

const StyledTypography = styled(Typography)`
margin-top: 1rem;
marginBottom: 1rem;
`;

function getSteps() {
  return ['Dates', 'Location', 'Cargo Details', 'Coverage Terms', 'Review & Purchase'];
}


function Policy({ accounts }, context) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [locations, setLocations] = useState([]);
  const [premium, setPremium] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [success, setSuccess] = useState(undefined);
  const [transaction, setTransaction] = useState(undefined);
  const [address, setAddress] = useState(accounts[0]);
  const [paymentComplete, setPaymentComplete] = useState(undefined);
  const [claimPayout, setClaimPayout] = useState(undefined);
  const [mapProperties, setMapProperties] = useState({
    center: [43.76165780303581, -77.23736067237853],
    zoom: 4,
    minZoom: 3,
    maxZoom: 16,
  })
  const [cargoDetails, setCargoDetails] = useState({
    shipmentValue: 0
  })
  const [web3, setWeb3] = useState(context.drizzle.web3);
  const contract = context.drizzle.contracts.MarineInsurance;

  contract.events
    .InsurancePolicyCreation({}, onPolicyCreated)
    .on('error', onContractError);

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
                <Heading.h2>Please select a Start and End Date for your coverage period</Heading.h2>
                <Heading.h5 color="#666">Applications must be submitted at least 1 days ahead of the start date of the coverage period. </Heading.h5>
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
                      <Field label="Select a river system or channel">
                        <Input type="text" disabled required value={locations.length > 0 ? getCordinateFormat(locations[0]) : ''} />
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
              <Heading.h5 className="box-left-1" color="#666">Please describe your inland waterway shipment transportation details to calculate the named peril insurance premium.</Heading.h5>
              <Box width={[1, 1, 1 / 2]} px={3}>
                <Field label="What is the SHIPMENT VALUE (In USD)?" width={1}>
                  <Input
                    type="number"
                    required // set required attribute to use brower's HTML5 input validation
                    width={1}
                    min="0"
                    onChange={(e) => setCargoDetails({ shipmentValue: e.target.value })}
                    value={cargoDetails.shipmentValue}
                  />
                </Field>
              </Box>
            </Flex>
          </Form>
        </div>
        ); case 3:
        calculateDailyClaimPayouts(contract)
        return (<div>
          {claimPayout ? (<div><Text className="box-left-3">Your estimated daily payout is:   {web3.utils.fromWei(claimPayout, 'ether')} ETH
          </Text>
            <Image
              src={Conditions}
            />
          </div>
          ) : <Loader size="40px" />}
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

  async function calculateDailyClaimPayouts(contract) {
    if (!claimPayout) {
      const data = await contract.methods.calculateDailyClaimPayouts(
        cargoDetails
      ).call();
      setClaimPayout(data);
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
    clearMetamaskTask();
  };

  const clearMetamaskTask = () => {
    setError(undefined);
    setSuccess(undefined);
    setTransaction(undefined);
  }

  function onPolicyCreated(error, ethEvent) {
    clearMetamaskTask();
    if (!error) {
      setSuccess('Policy was created');
    } else {
      onContractError(error);
    }
  }

  function onContractError(error) {
    clearMetamaskTask();
    if (error.message) {
      setError(error.message);
    } else {
      setError(error)
    }
  }

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

                    {transaction ? <AnimatedIconProcessing /> :
                      error ? <Image
                        src={ErrorIcon}
                        aria-label="MetaMask extension icon"
                        size="2em"
                      /> : <Loader size={"2em"} />
                    }
                  </Box>
                </Box>
                <Box>
                  <Text
                    textAlign={["center", "left"]}
                    fontWeight={"600"}
                    fontSize={1}
                    lineHeight={"1.25em"}
                  >
                    {transaction ? 'Payment Sent with TX: ' + transaction :
                      error ? error : 'Waiting for confirmation...'}

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
                  <Text fontWeight="bold">Location: {getCordinateFormat(locations[0])}</Text>
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
          </Flex>
        </Box>
      </Card>
    );
  }

  async function makePayment() {
    clearMetamaskTask();
    if (!paymentComplete) {
      await contract.methods.registerInsurancePolicy(
        cargoDetails,
        getLocationForSmartContract(locations[0]),
        getTimeForSmartContract(startDate),
        getTimeForSmartContract(endDate)
      ).send({ value: premium })
        .on('transactionHash', function (hash) {
          setTransaction(hash);
        })
        .on('error', onContractError);
    }
  }

  const onMapClick = (e) => {
    const lat = e.latLng[0];
    const long = e.latLng[1];
    var data = {
      lat: lat,
      lng: long
    };
    if (locations.length === 0) {
      locations.push(data);
    } else {
      locations[0] = data;
    }
    setLocations(locations);
  }

  const isNextDisabled = () => {
    switch (activeStep) {
      case 0:
        if (startDate === undefined || endDate === undefined) {
          return true; //todo make true
        }
        return false;
      case 1:
        if (locations.length == 1) {
          return false;
        }
        return true; //todo make true
      case 2:
        if (cargoDetails.shipmentValue >= 0) {
          return false;
        }
        return true;
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
    setClaimPayout(undefined);
    clearMetamaskTask();
  };

  const getTimeForSmartContract = (t) => {
    return Math.floor(new Date(t).getTime() / 1000);
  }

  const getLocationForSmartContract = (l) => {
    return {
      lat: l.lat.toString(),
      lng: l.lng.toString()
    }
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
              <StyledTypography>{success ?
                <ToastMessage.Success
                  my={3}
                  message={"Success"}
                  secondaryMessage={success}
                />
                : getStepContent(activeStep)}</StyledTypography>
              <br />
              <br />
              {!success ? <div>
                <StyledButton disabled={activeStep === 0 || transaction !== undefined} onClick={handleBack}>
                  Back
                  </StyledButton>

                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={activeStep === steps.length - 1 ? makePayment : handleNext}
                  disabled={isNextDisabled() || transaction !== undefined}
                >
                  {activeStep === steps.length - 1 ? 'Make Payment' : 'Next'}
                </StyledButton>
              </div> : null}
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
