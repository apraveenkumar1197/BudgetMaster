import {Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";
import React from "react";

export const GetCreditCard = (props) => {
    return <Grid
        container spacing={0}>
        <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ minWidth: 0 }}>
                <Table>
                    <TableHead sx={{backgroundColor: 'primary.main'}}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>S.No</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Holder Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.creditCardList.map((creditCard, i) => (
                            <TableRow key={'credit-card-' + i} hover>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{creditCard.name}</TableCell>
                                <TableCell>{creditCard.holder}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </Grid>
}
