import React, { Component, useState, useEffect, createContext } from 'react'
import PropTypes from 'prop-types'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styled from "styled-components";
import { EthAddress } from "rimble-ui";
import { MetaMaskButton } from 'rimble-ui';
import { Field, Input, Form, Flex, Box, Heading, Select } from 'rimble-ui';
import Map from 'pigeon-maps'
import Marker from 'pigeon-marker'
import Overlay from 'pigeon-overlay'

const StyledButton = styled(Button)`
    margin-right: 1rem;
`;

const StyledTypography = styled(Typography)`
margin-top: 1rem;
marginBottom: 1rem;
`;

function getSteps() {
  return ['Dates', 'Locations', 'Cargo Details', 'Coverage & Payout', 'Review & Purchase'];
}


function  Policy({ accounts }, context) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [dateValidated, setDateValidated] = useState(false);
  const contract = context.drizzle.contracts.MarineInsurance;
  const steps = getSteps();

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (<div className="box-left">
          <br />
          <br />
          <Form validated={dateValidated}>
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box px={3}>
                <Heading.h2>Protect your business with additional named peril insurance</Heading.h2>
                <Heading.h5 color="#666">Insurance is a life preserver you can always count on when you are sailing through uncharted waters.</Heading.h5>
              </Box>
            </Flex>
            <br />
            <Flex mx={-3} flexWrap={"wrap"}>
              <Box width={[1, 1, 1 / 2]} px={3}>
                <Field label="From">
                  <Input type="date" required validated={false} min={new Date().toISOString().split('T')[0]} />
                </Field>
              </Box>
              <Field label="To">
                <Input type="date" required validated={false} min={new Date().toISOString().split('T')[0]} />
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
            <Form validated={dateValidated}>
              <Flex mx={-3} flexWrap={"wrap"}>
                <Box px={3}>
                  <Heading.h2>Select a Coverage Location</Heading.h2>
                </Box>
              </Flex>
              <br />
              <Flex mx={-3} flexWrap={"wrap"}>
            <Box width={[1, 1, 1/2]} px={3}>
            <Map center={[50.879, 4.6997]} zoom={12} width={400} height={400}>
                    <Marker anchor={[50.874, 4.6947]} payload={1} onClick={({ event, anchor, payload }) => { }} />
                    <Marker anchor={[50.874, 4.7947]} payload={1} onClick={({ event, anchor, payload }) => { }} />
                  </Map>
            </Box>
            <Box width={[1, 1, 1/2]} px={3}>
            <Flex mx={-3} flexWrap={"wrap"}>
                <Box width={[1, 1, 1 / 2]} px={3}>
                  <Field label="Starting location of voyage">
                    <Input type="text" required={true} placeholder="Coordinates" />
                  </Field>
                </Box>
              </Flex>
              
              <Flex mx={-3} flexWrap={"wrap"}>
                <Box width={[1, 1, 1 / 2]} px={3}>
                  <Field label="Ending location of voyage">
                    <Input type="text" required={true} placeholder="Coordinates" />
                  </Field>
                </Box>
              </Flex>
            </Box>
          </Flex>

            </Form>
          </div>
        ); case 2:
        return (<div>
        <Form>
          <Flex mx={-3} flexWrap={"wrap"}>
            <Box width={[1, 1, 1/2]} px={3}>
              <Field label="Plain Input"  width={1}>
                <Input
                  type="text"
                  required // set required attribute to use brower's HTML5 input validation
                  width={1}
                />
              </Field>
            </Box>
            <Box width={[1, 1, 1/2]} px={3}>
              <Field label="Form Email Input"  width={1}>
                <Form.Input
                  type="email"
                  required // set required attribute to use brower's HTML5 input validation
                  width={1}
                />
              </Field>
            </Box>
          </Flex>
          <Flex mx={-3} flexWrap={"wrap"}>
            <Box width={[1, 1, 1/2]} px={3}>
              <Field label="Plain Input"  width={1}>
                <Input
                  type="text"
                  required // set required attribute to use brower's HTML5 input validation
                  width={1}
                />
              </Field>
            </Box>
            <Box width={[1, 1, 1/2]} px={3}>
              <Field label="Form Email Input"  width={1}>
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
            <Box width={[1, 1, 1/2]} px={3}>
              <Field label="Plain Input"  width={1}>
                <Input
                  type="text"
                  required // set required attribute to use brower's HTML5 input validation
                  width={1}
                />
              </Field>
            </Box>
            <Box width={[1, 1, 1/2]} px={3}>
              <Field label="Form Email Input"  width={1}>
                <Form.Input
                  type="email"
                  required // set required attribute to use brower's HTML5 input validation
                  width={1}
                />
              </Field>
            </Box>
          </Flex>
          <Flex mx={-3} flexWrap={"wrap"}>
            <Box width={[1, 1, 1/2]} px={3}>
              <Field label="Plain Input"  width={1}>
                <Input
                  type="text"
                  required // set required attribute to use brower's HTML5 input validation
                  width={1}
                />
              </Field>
            </Box>
            <Box width={[1, 1, 1/2]} px={3}>
              <Field label="Form Email Input"  width={1}>
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
        return (<div>
          <br />
          <EthAddress address="0x9505C8Fc1aD98b0aC651b91245d02D055fEc8E49" />
          <br />
          <MetaMaskButton.Outline>Pay with MetaMask</MetaMaskButton.Outline>
        </div>
        );
      default:
        return 'Unknown step';
    }
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
  };

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
