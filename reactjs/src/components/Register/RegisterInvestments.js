import {
    Autocomplete,
    Button,
    Container,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField
} from "@mui/material";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import React from "react";
import Register from "../../repo/Register";

export const RegisterInvestments = (props) => {

    const [investments, setInvestments] = React.useState([]);
    const [reasons, setReasons] = React.useState([]);
    const [categories, setCategories] = React.useState([]);

    const [investmentReason, setInvestmentReason] = React.useState('');
    const [investmentCategory, setInvestmentCategory] = React.useState('');
    const [investmentAmount, setInvestmentAmount] = React.useState('');

    const getInvestmentsList = () => {
        Register.getReasons()
            .then((res) => {
                setReasons(res.data)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
        Register.getCategories()
            .then((res) => {
                setCategories(res.data)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
        Register.getInvestments()
            .then((res) => {
                setInvestments(res.data)
            }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
        });
    }
    const handleAddInvestment = () => {
        Register.addInvestment(investmentReason, investmentCategory, investmentAmount)
            .then((res) => {
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)

                setInvestmentReason('')
                setInvestmentCategory('')
                setInvestmentAmount('')

                getInvestmentsList();
            }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
            });
    }

    React.useEffect(() => {
        getInvestmentsList()
    },[]);

    return <Container sx={{ width: '70%' }}>
        <Grid container spacing={1}>
            <Grid style={{padding: 10}} item md={8} xs={12}>
                <Autocomplete
                    value={investmentReason}
                    freeSolo
                    id="investment_reason_autocomplete"
                    disableClearable
                    options={reasons.map((option) => option.reason)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="investment_reason"
                            label="Reason"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e)=>setInvestmentReason(e.target.value)}/>
                    )}
                />
            </Grid>
        </Grid>
        <Grid container spacing={1}>
            <Grid style={{padding: 10}} item md={8} xs={12}>
                <Autocomplete
                    value={investmentCategory}
                    freeSolo
                    id="investment_category_autocomplete"
                    disableClearable
                    options={categories.map((option) => option.category)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="investment_category"
                            label="Category"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e)=>setInvestmentCategory(e.target.value)}/>
                    )}
                />
            </Grid>
        </Grid>
        <Grid container spacing={1}>
            <Grid style={{padding: 10}} item md={4} xs={12}>
                <SmallOutlinedTextBox id="investment_amount" label="Amount" value={investmentAmount} onInput={(e)=>setInvestmentAmount(e.target.value)}/>
            </Grid>
        </Grid>
        <Grid container spacing={1}>
            <Grid style={{padding: 10}} item md={4} xs={12}>
                <Button onClick={handleAddInvestment}>Add Investment</Button>
            </Grid>
        </Grid>
        <Grid container spacing={1}>
            <Grid style={{padding: 10}} item md={4} xs={12}>
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell align="right">Reason</TableCell>
                                <TableCell align="right">Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {investments.map((investment,i) => (
                                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="right">{i+1}</TableCell>
                                    <TableCell align="right">{investment.reason}</TableCell>
                                    <TableCell align="right">{investment.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    </Container>
}