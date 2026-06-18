import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import React, {Component} from "react";
import Util from "../../functionalities/Util";
import Investment from "../../repo/Investment";
import DateUtil from "../../functionalities/DateUtil";

export const InvestmentList = (props) => {
    const formatter = Util.numberFormatter()

    const [investmentList, setInvestmentList] = React.useState([]);

    const getInvestmentList = () => {
        Investment.getInvestmentMonthWise(new DateUtil().mySQLMonth())
            .then((res) => {
                setInvestmentList(res.data.data)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    React.useEffect(() => {
        getInvestmentList()
    },[]);

    return <Table>
        <TableHead style={{backgroundColor: '#1976d2'}}>
            <TableRow>
                <TableCell style={{color: 'white'}} align="center" colSpan={2} onClick={() => { props.setMyInvestments(true) }}>
                    <h2>Investments</h2>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{color: 'white'}} >Investment name</TableCell>
                <TableCell style={{color: 'white'}} >Amount</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {investmentList.map((investment, i) => (
                <TableRow key={'investment-'+i}>
                    <TableCell>{investment.name}</TableCell>
                    <TableCell>{formatter.format(investment.amount)}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}