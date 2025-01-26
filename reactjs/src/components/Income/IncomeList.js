import {Grid, IconButton, Stack, Table, TableBody, TableCell, TableFooter, TableHead, TableRow} from "@mui/material";
import React, {Component} from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Util from "../../functionalities/Util";


export const IncomeList = (props) => {
    const formatter = Util.numberFormatter()

    return <Grid
        container spacing={0}>
        <Grid item>
            <Table flex={1}>
                <TableHead style={{backgroundColor: '#1976d2'}}>
                    <TableRow><TableCell>S.No</TableCell><TableCell>Date</TableCell><TableCell>Reason</TableCell><TableCell>Category</TableCell><TableCell>Amount</TableCell><TableCell>Pay mode</TableCell><TableCell></TableCell><TableCell></TableCell></TableRow>
                </TableHead>
                <TableBody>
                    {props.incomeList.map((income, i) => (
                        <TableRow>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{income.date}</TableCell>
                            <TableCell>{income.reason.name}</TableCell>
                            <TableCell>{(income.category == null ? '' : income.category.name) + (income.subCategory == null ? '' :  ("(" + income.subCategory.name + ")"))}</TableCell>
                            <TableCell>{formatter.format(income.amount)}</TableCell>
                            <TableCell>{income.payMode.name}</TableCell>
                            <TableCell>
                                <IconButton color="black" size="medium" onClick={() => props.editIncome(income)}>
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                <IconButton color="black" size="medium" onClick={() => props.deleteIncome(income.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell><h2>{formatter.format(props.incomeAmountTotal)}</h2></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </Grid>
    </Grid>
}