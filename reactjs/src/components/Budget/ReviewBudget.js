import {
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import Budget from "../../repo/Budget";
import Util from "../../functionalities/Util";
import DateUtil from "../../functionalities/DateUtil";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export const ReviewBudget = (props) => {
    const formatter = Util.numberFormatter()

    const [budgetReviewList, setBudgetReviewList] = React.useState([]);
    const [budgetDate, setBudgetDate] = React.useState(new Date());
    const [savingsAndInvestment, setSavingsAndInvestment] = React.useState("Y");
    const [withoutCreditCardExpenses, setWithoutCreditCardExpenses] = React.useState("N");
    const [plannedTotal, setPlannedTotal] = React.useState("");
    const [actualTotal, setActualTotal] = React.useState("");

    const getBudgetReviewList = () => {
        Budget.review(new DateUtil(budgetDate).mySQLMonth(), savingsAndInvestment, withoutCreditCardExpenses).then((res) => {
            setBudgetReviewList(res.data.data.budget)
            setPlannedTotal(res.data.data.plannedTotal)
            setActualTotal(res.data.data.actualTotal)
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    React.useEffect(() => {
        getBudgetReviewList()
    }, [budgetDate, savingsAndInvestment, withoutCreditCardExpenses]);


    return <Grid container spacing={2} sx={{ p: { xs: 1, sm: 2 } }}>
        <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Review Budget</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                                label="Date"
                                inputFormat="MM/YYYY"
                                onChange={(newValue) => {
                                    setBudgetDate(newValue.$d);
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        {...params} />
                                }
                                value={budgetDate}/>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch defaultChecked
                                                           onChange={(e) => setSavingsAndInvestment(e.target.checked ? 'Y' : 'N')}/>}
                                          label="Savings & Investment"/>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch
                                                           onChange={(e) => setWithoutCreditCardExpenses(e.target.checked ? 'Y' : 'N')}/>}
                                          label="Without credit card expenses"/>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
            <TableContainer component={Paper} elevation={3}>
                <Table size="small">
                    <TableHead sx={{backgroundColor: 'primary.main'}}>
                        <TableRow>
                            <TableCell style={{color: 'white'}}>S.No</TableCell>
                            <TableCell style={{color: 'white'}}>Category</TableCell>
                            <TableCell style={{color: 'white'}}>Planned Amount</TableCell>
                            <TableCell style={{color: 'white'}}>Actual Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {budgetReviewList.map((budget, i) => (
                            <TableRow key={i} hover>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{budget.category}</TableCell>
                                <TableCell>{formatter.format(budget.planned)}</TableCell>
                                <TableCell>{formatter.format(budget.actual)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Total:</TableCell>
                            <TableCell><Typography variant="h6" sx={{ fontWeight: 600 }}>{formatter.format(plannedTotal)}</Typography></TableCell>
                            <TableCell><Typography variant="h6" sx={{ fontWeight: 600 }}>{formatter.format(actualTotal)}</Typography></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Grid>
    </Grid>
}