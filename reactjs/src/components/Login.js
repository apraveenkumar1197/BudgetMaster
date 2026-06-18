import React from "react";
import {useNavigate} from "react-router-dom";
import { MuiOtpInput } from 'mui-one-time-password-input'
import  LoginAPI  from '../repo/Login'

import {
    Box,
    Button, CircularProgress,
    Container,
    createTheme,
    CssBaseline,
    TextField,
    Typography
} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import * as PropTypes from "prop-types";
import LocalStorage from "../providers/LocalStorage";

import {RoutePath} from "../functionalities/RoutePath";

function Copyright() {
    return null;
}

Copyright.propTypes = {sx: PropTypes.shape({mb: PropTypes.number, mt: PropTypes.number})};
export const Login = (props) => {
    const theme = createTheme();
    const navigate = useNavigate()

    const [email, setEmail] = React.useState('')
    const [otp, setOtp] = React.useState('')
    const [otpSectionDisplay, setOtpSectionDisplay] = React.useState('none')
    const [getOtpButtonDisplay, setGetOtpButtonDisplay] = React.useState('display')

    const [sendOtpLoading, setSendOtpLoading] = React.useState(false);
    const [verifyOtpLoading, setVerifyOtpLoading] = React.useState(false);
    const [reSendOtpLoading, setReSendOtpLoading] = React.useState(false);

    const handleChange = (newValue) => {
        setOtp(newValue)
    }

    const handleGetOtp = () => {
        setSendOtpLoading(true)
        LoginAPI.getOtp(email)
            .then((res) => {
                setOtpSectionDisplay('block')
                setGetOtpButtonDisplay('none')
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)
                setSendOtpLoading(false)
            })
            .catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
                setSendOtpLoading(false)
            });

    }

    const handleResendOTP = () => {

    }

    const handleVerifyOtp = () => {
        setVerifyOtpLoading(true)
        LoginAPI.verifyOtp(email,otp)
            .then((res) => {
                LocalStorage.accessToken(res.data.access_token)
                LocalStorage.refreshToken(res.data.refresh_token)
                LocalStorage.set('is_registration_completed', res.data.is_registration_completed)
                props.setSnackbarMessage("Logged in Successfully")
                props.setOpenSnackbar(true)
                setVerifyOtpLoading(false)
                navigate(RoutePath.RootPath, {replace: true})
            })
            .catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
                setVerifyOtpLoading(false)
            });

    }

    return <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" noValidate>
                    <TextField
                        value={email}
                        onInput={(e)=>setEmail(e.target.value)}
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus/>
                    <Box mx={{ position: 'relative' }}>
                        <Button
                            disabled={sendOtpLoading}
                            style={{display: getOtpButtonDisplay}}
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                            variant="contained"
                            onClick={handleGetOtp}>
                            Get OTP
                        </Button>
                        {sendOtpLoading && (
                            <CircularProgress
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                                size={24}/>
                        )}
                    </Box>
                    <div key={'otp_section'} style={{display: otpSectionDisplay}}>
                        <MuiOtpInput
                            length={6}
                            value={otp}
                            onChange={handleChange}
                            TextFieldsProps={{
                                type: 'tel',
                                inputProps: {
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                },
                            }}
                        />
                        {/*<Box mx={{ position: 'relative' }}>
                            <Button
                                disabled={reSendOtpLoading}
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleResendOTP}>
                                Resend OTP
                            </Button>
                            {reSendOtpLoading && (
                                <CircularProgress
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                    size={24}/>
                            )}
                        </Box>*/}
                        <Box mx={{ position: 'relative' }}>
                            <Button
                                disabled={verifyOtpLoading}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleVerifyOtp}>
                                Sign In
                            </Button>
                            {verifyOtpLoading && (
                                <CircularProgress
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                    size={24}/>
                            )}
                        </Box>
                    </div>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    </ThemeProvider>
}