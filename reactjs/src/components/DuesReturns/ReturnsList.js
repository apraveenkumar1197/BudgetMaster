import {Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import React, {Component} from "react";
import Expense from "../../repo/Expense";
import Util from "../../functionalities/Util";
import DeleteIcon from "@mui/icons-material/Delete";


export const ReturnsList = (props) => {
    const formatter = Util.numberFormatter()

    return <Grid
        container spacing={0}>
        <Grid item>
            <Table flex={1}>
                <TableHead style={{backgroundColor: '#1976d2'}}>
                    <TableRow>
                        <TableCell>S.No</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.returnsList.map((returns, i) => (
                        <TableRow key={'returns-'+i}>
                            <TableCell>{i+1}</TableCell>
                            <TableCell>{returns.date}</TableCell>
                            <TableCell>{returns.reason.name}</TableCell>
                            <TableCell>{(returns.category == null ? '' : returns.category.name) + (returns.subCategory == null ? '' :  ("(" + returns.subCategory.name + ")"))}</TableCell>
                            <TableCell>{formatter.format(returns.amount)}</TableCell>
                            <TableCell>
                                <IconButton color="black" size="medium"
                                            onClick={() => props.deleteReturns(returns.id)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Grid>
    </Grid>
}