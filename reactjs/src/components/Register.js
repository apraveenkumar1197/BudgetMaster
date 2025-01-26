
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {RegisterProfile} from "./Register/RegisterProfile";
import {RegisterInvestments} from "./Register/RegisterInvestments";
import {RegisterLoans} from "./Register/RegisterLoans";
import {RegisterStorage} from "./Register/RegisterStorage";
import {useNavigate} from "react-router-dom";
import Register from "../repo/Register";
import LocalStorage from "../providers/LocalStorage";


export const Registration = (props) => {
    const [activeStep, setActiveStep] = React.useState(0);

    const steps = ['Profile', 'Investments', 'Loans', 'Storage'];
    const ui = [
        <RegisterProfile  setSnackbarMessage={props.setSnackbarMessage} setOpenSnackbar={props.setOpenSnackbar}/>,
        <RegisterInvestments setSnackbarMessage={props.setSnackbarMessage} setOpenSnackbar={props.setOpenSnackbar}/>,
        <RegisterLoans setSnackbarMessage={props.setSnackbarMessage} setOpenSnackbar={props.setOpenSnackbar}/>,
        <RegisterStorage setSnackbarMessage={props.setSnackbarMessage} setOpenSnackbar={props.setOpenSnackbar}/>
    ];
    const navigate = useNavigate()



    const handleNext = () => {
        if(activeStep >= steps.length - 1){
            updateRegisterStatus();
        }
        else{
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const updateRegisterStatus = () => {
        Register.updateRegisterStatus()
            .then((res) => {
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)

                LocalStorage.set('is_registration_completed', true)

                navigate('/dashi', {replace: true})

            }).catch((err) => {
                console.log(err);
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });


    }

    return (
        <Box>
            <React.Fragment>
                <Typography component={'span'} sx={{ mt: 2, mb: 1 }}>{ui[activeStep]}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}>
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {activeStep === steps.length - 1 ? (
                        <Button onClick={handleNext}>Finish</Button>
                    ): (
                        <Button onClick={handleNext}>Next</Button>
                    )}

                </Box>
            </React.Fragment>
        </Box>
    );
}
