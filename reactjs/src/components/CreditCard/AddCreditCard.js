import {Autocomplete, Button, CircularProgress, Grid, Paper, TextField, Typography} from "@mui/material";
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
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Add Credit Card
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                    <SmallOutlinedTextBox id="test-text-field" label="Name" value={creditCardName}
                                          onInput={(e) => setCreditCardName(e.target.value)}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <SmallOutlinedTextBox id="test-text-field-holder" label="Holder" value={creditCardHolderName}
                                          onInput={(e) => setCreditCardHolderName(e.target.value)}/>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button variant="text" onClick={resetForm} size="small">Reset</Button>
                <Button variant="contained" onClick={addCreditCard} size="large">Add credit card</Button>
            </Box>
        </Paper>
        <GetCreditCard creditCardList={creditCardList} />
    </Grid>
}