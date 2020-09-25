import React, { Component, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styled from "styled-components";
import { EthAddress } from "rimble-ui";
import { MetaMaskButton } from 'rimble-ui';

const StyledButton = styled(Button)`
    margin-right: 1rem;
`;

const StyledTypography = styled(Typography)`
margin-top: 1rem;
marginBottom: 1rem;
`;

function getSteps() {
    return ['Claims', 'Review Details', 'Payment'];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return 'Select campaign settings...';
        case 1:
            return 'What is an ad group anyways?';
        case 2:
            return (<div>
            </div>
            );
        default:
            return 'Unknown step';
    }
}

function Claims({ accounts }, context) {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const steps = getSteps();
    const contract = context.drizzle.contracts.MarineInsurance;

    const isStepOptional = (step) => {
        return step === 1;
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
                            <StyledTypography >{getStepContent(activeStep)}</StyledTypography>
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

Claims.contextTypes = {
    drizzle: PropTypes.object
  };

export default Claims
