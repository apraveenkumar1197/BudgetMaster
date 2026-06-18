import {Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableFooter, TableRow} from "@mui/material";
import React, {Component} from "react";

export const GetCreditCard = (props) => {
    return <Grid
        container spacing={0}>
        <Grid item>
            <Table flex={1}>
                <TableHead style={{backgroundColor: '#1976d2'}}>
                    <TableRow>
                        <TableCell>S.No</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Holder Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.creditCardList.map((creditCard, i) => (
                        <TableRow>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{creditCard.name}</TableCell>
                            <TableCell>{creditCard.holder}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Grid>
    </Grid>
}