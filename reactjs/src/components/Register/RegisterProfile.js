import {Button, Container, Grid} from "@mui/material";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import React from "react";
import Register from "../../repo/Register";

export const RegisterProfile = (props) => {
    const [name, setName] = React.useState('');
    const [mobileNo, setMobileNo] = React.useState('');


    React.useEffect(() => {
        Register.getProfileDetails()
            .then((res) => {
                let data = res.data
                setName(data.name)
                setMobileNo(data.mobileNo)
            })
            .catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
            });
    },[]);

    const handleSubmit = () => {
        Register.updateProfileDetails(name, mobileNo)
            .then((res) => {
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)
            })
            .catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
            });
    }


    return <Container sx={{width: '70%'}}>
        <Grid container spacing={1}>
            <Grid style={{padding: 10}} item md={4} xs={12}>
                <SmallOutlinedTextBox id="profile_name"
                                      label="Name"
                                      value={name ? name : ''}
                                      onInput={(e) => setName(e.target.value)}/>
            </Grid>
        </Grid>
        <Grid container spacing={1}>
            <Grid style={{padding: 10}} item md={4} xs={12}>
                <SmallOutlinedTextBox id="profile_mobile_no"
                                      label="Mobile No"
                                      value={mobileNo ? mobileNo : ''}
                                      onInput={(e) => setMobileNo(e.target.value)}/>
            </Grid>
        </Grid>
        <Grid container spacing={1}>
            <Grid style={{padding: 10}} item md={4} xs={12}>
                <Button onClick={handleSubmit}>
                    Update
                </Button>
            </Grid>
        </Grid>
    </Container>
}