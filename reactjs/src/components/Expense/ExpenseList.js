import {Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableFooter, TableRow} from "@mui/material";
import React, {Component} from "react";
import Expense from "../../repo/Expense";
import Util from "../../functionalities/Util";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


export const ExpenseList = (props) => {
    const formatter = Util.numberFormatter()

    return <Grid
        container spacing={0}>
        <Grid item>
            <Table flex={1}>
                <TableHead style={{backgroundColor: '#1976d2'}}>
                    <TableRow><TableCell>S.No</TableCell><TableCell>Reason</TableCell><TableCell>Category</TableCell><TableCell>Amount</TableCell><TableCell>Pay mode</TableCell><TableCell></TableCell><TableCell></TableCell></TableRow>
                </TableHead>
                <TableBody>
                    {props.expenseList.map((expense, i) => (
                        <TableRow>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{expense.reason.name}</TableCell>
                            <TableCell>{(expense.category == null ? '' : expense.category.name) + (expense.subCategory == null ? '' :  ("(" + expense.subCategory.name + ")"))}</TableCell>
                            <TableCell>{formatter.format(expense.amount)}</TableCell>
                            <TableCell>{expense.payMode.name}</TableCell>
                            <TableCell>
                                <IconButton color="black" size="medium" onClick={() => props.editExpense(expense)}>
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                <IconButton color="black" size="medium" onClick={() => props.deleteExpense(expense.id)}>
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
                        <TableCell><h2>{formatter.format(props.expenseListTotal)}</h2></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </Grid>
    </Grid>
}