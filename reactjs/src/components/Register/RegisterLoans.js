import {
    Autocomplete,
    Button,
    Container,
    Grid,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import React from "react";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import Register from "../../repo/Register";



export const RegisterLoans = (props) => {
    const [loans, setLoans] = React.useState([]);
    const [reasons, setReasons] = React.useState([]);
    const [categories, setCategories] = React.useState([]);

    const [loanReason, setLoanReason] = React.useState('');
    const [loanCategory, setLoanCategory] = React.useState('');
    const [loanAmount, setLoanAmount] = React.useState('');

    const getLoansList = () => {
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
        Register.getLoans()
            .then((res) => {
                setLoans(res.data)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    const handleAddLoan = () => {
        Register.addLoan(loanReason, loanCategory, loanAmount)
            .then((res) => {
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)

                setLoanReason('')
                setLoanCategory('')
                setLoanAmount('')

                getLoansList();
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    React.useEffect(() => {
        getLoansList()
    },[]);

    return <Container disableGutters maxWidth={false} sx={{ width: '100%' }}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
                <Autocomplete
                    value={loanReason}
                    freeSolo
                    fullWidth
                    id="loan_reason_autocomplete"
                    disableClearable
                    options={reasons.map((option) => option.reason)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="loan_reason"
                            label="Reason"
                            size="small"
                            fullWidth
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e)=>setLoanReason(e.target.value)}/>
                    )}
                />
            </Grid>
            <Grid item xs={12} md={8}>
                <Autocomplete
                    value={loanCategory}
                    freeSolo
                    fullWidth
                    id="loan_category_autocomplete"
                    disableClearable
                    options={categories.map((option) => option.category)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="loan_category"
                            label="Category"
                            size="small"
                            fullWidth
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e)=>setLoanCategory(e.target.value)}/>
                    )}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <SmallOutlinedTextBox id="loan_amount" label="Amount" value={loanAmount} onInput={(e)=>setLoanAmount(e.target.value)}/>
            </Grid>
            <Grid item xs={12} md={4}>
                <Button variant="contained" onClick={handleAddLoan}>Add Loan</Button>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell align="right">Reason</TableCell>
                                <TableCell align="right">Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loans.map((loan,i) => (
                                <TableRow key={i} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="right">{i+1}</TableCell>
                                    <TableCell align="right">{loan.reason}</TableCell>
                                    <TableCell align="right">{loan.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    </Container>
}