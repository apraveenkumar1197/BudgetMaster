import {Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import React, {Component} from "react";
import Expense from "../../repo/Expense";
import Util from "../../functionalities/Util";
import DeleteIcon from "@mui/icons-material/Delete";
import DuesReturns from "../../repo/DuesReturns";
import Budget from "../../repo/Budget";


export const DueList = (props) => {
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
                        {'deleteDue' in props ? <TableCell></TableCell> : ''}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.dueList.map((due, i) => (
                        <TableRow style={{backgroundColor: due.colorFlag}} key={'dues-' + i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{due.date}</TableCell
                            ><TableCell>{due.reason.name}</TableCell>
                            <TableCell>{(due.category == null ? '' : due.category.name) + (due.subCategory == null ? '' : ("(" + due.subCategory.name + ")"))}</TableCell>
                            <TableCell>{formatter.format(due.amount)}</TableCell>
                            {'deleteDue' in props ? <TableCell>
                                <IconButton color="black" size="medium"
                                            onClick={() => props.deleteDue(due.id)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </TableCell> : ''}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Grid>
    </Grid>
}