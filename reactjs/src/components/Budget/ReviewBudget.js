import {
    Autocomplete,
    Button,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    TextField
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
    const [plannedTotal, setPlannedTotal] = React.useState("");
    const [actualTotal, setActualTotal] = React.useState("");

    const getBudgetReviewList = () => {
        Budget.review(new DateUtil(budgetDate).mySQLMonth(), savingsAndInvestment).then((res) => {
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
    }, [budgetDate, savingsAndInvestment]);


    return <Grid container>
        <Grid item xs={12} md={4}>
            <Grid container style={{padding: 10}} spacing={0}>
                <Grid item>
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
            </Grid>
            <Grid container style={{padding: 10}} spacing={0}>
                <Grid item>
                    <FormControlLabel control={<Switch defaultChecked
                                                       onChange={(e) => setSavingsAndInvestment(e.target.checked ? 'Y' : 'N')}/>}
                                      label="Savings & Investment"/>
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
            <Table flex={1}>
                <TableHead style={{backgroundColor: '#1976d2'}}>
                    <TableRow><TableCell>S.No</TableCell><TableCell>Category</TableCell><TableCell>Planned
                        Amount</TableCell><TableCell>Actual Amount</TableCell></TableRow>
                </TableHead>
                <TableBody>
                    {budgetReviewList.map((budget, i) => (
                        <TableRow>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{budget.category}</TableCell>
                            <TableCell>{formatter.format(budget.planned)}</TableCell>
                            <TableCell>{formatter.format(budget.actual)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow><TableCell></TableCell><TableCell></TableCell><TableCell>
                        <h2>{formatter.format(plannedTotal)}</h2></TableCell><TableCell>
                        <h2>{formatter.format(actualTotal)}</h2></TableCell></TableRow>
                </TableFooter>
            </Table>
        </Grid>
    </Grid>
}