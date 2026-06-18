import {Autocomplete, Button, CircularProgress, Grid, TextField} from "@mui/material";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import Box from "@mui/material/Box";
import {ExpenseList} from "../Expense/ExpenseList";
import React from "react";
import CreditCard from "../../repo/CreditCard";
import Budget from "../../repo/Budget";
import DateUtil from "../../functionalities/DateUtil";
import {GetCreditCard} from "./GetCreditCard";

export const AddCreditCard = (props) => {

    const [creditCardName, setCreditCardName] = React.useState('');
    const [creditCardHolderName, setCreditCardHolderName] = React.useState('');

    const [creditCardList, setCreditCardList] = React.useState([]);

    const getCreditCard = () => {
        CreditCard.list().then((res) => {
            setCreditCardList(res.data.data)
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const addCreditCard = () => {
        CreditCard.add(creditCardName, creditCardHolderName).then((res) => {
            getCreditCard()
            props.setSnackbarMessage(res.data.msg)
            props.setOpenSnackbar(true)
            resetForm();
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    const resetForm = () => {
        setCreditCardName('');
        setCreditCardHolderName('');
    }

    React.useEffect(() => {
        getCreditCard()
    },[]);

    return <Grid item xs={12} md={9}>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item xs={12} md={8}>
                <SmallOutlinedTextBox id="test-text-field" label="Name" value={creditCardName}
                                      onInput={(e) => setCreditCardName(e.target.value)}/>
            </Grid>
        </Grid>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item xs={12} md={8}>
                <SmallOutlinedTextBox id="test-text-field" label="Holder" value={creditCardHolderName}
                                      onInput={(e) => setCreditCardHolderName(e.target.value)}/>
            </Grid>
        </Grid>
        <Grid
            container
            spacing={0}>
            <Grid item style={{padding: 10}}>
                <Box sx={{m: 1, position: 'relative'}}>
                    <Button va riant="contained" onClick={resetForm}>Reset</Button>
                </Box>
            </Grid>
            <Grid item style={{padding: 10}}>
                <Box sx={{m: 1, position: 'relative'}}>
                    <Button variant="contained" onClick={addCreditCard}>Add credit card</Button>
                </Box>
            </Grid>
        </Grid>
        <GetCreditCard creditCardList={creditCardList} />
    </Grid>
}