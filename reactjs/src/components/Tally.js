import {Container, Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {Chart} from "./Dashi/Chart";
import {Storage} from "./Dashi/Storage";
import {InvestmentList} from "./Dashi/InvestmentList";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tally from "../repo/Tally";
import Util from "../functionalities/Util";
import DateUtil from "../functionalities/DateUtil";

export const TallyReport = (props) => {
    const formatter = Util.numberFormatter()
    const [tallyList, setTallyList] = React.useState([]);

    const getReport = () => {
        let fromDate = new Date("2020-01-01");
        let toDate = new Date();
        Tally.getReport(new DateUtil(fromDate).mySQLMonth(), new DateUtil(toDate).mySQLMonth()).then((res) => {
            setTallyList(res.data.data)
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    React.useEffect(() => {
        getReport()
    },[]);

    return <Container maxWidth={false}>
        <Grid justifyContent="center" container spacing={1}>
            <Grid item xs={12} md={6}>
                <Stack direction='column' spacing={1}>
                    <Table flex={1}>
                        <TableHead style={{backgroundColor: '#1976d2'}}>
                            <TableRow><TableCell>Month</TableCell><TableCell>Opening</TableCell><TableCell>Income</TableCell><TableCell>Expense</TableCell><TableCell>Closing</TableCell></TableRow>
                        </TableHead>
                        <TableBody>
                            {tallyList.map((tally, i) => (
                                <TableRow>
                                    <TableCell>{tally.month}</TableCell>
                                    <TableCell>{formatter.format(tally.opening)}</TableCell>
                                    <TableCell>{formatter.format(tally.income)}</TableCell>
                                    <TableCell>{formatter.format(tally.expense)}</TableCell>
                                    <TableCell>{formatter.format(tally.closing)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </Stack>
            </Grid>
        </Grid>
    </Container>
}