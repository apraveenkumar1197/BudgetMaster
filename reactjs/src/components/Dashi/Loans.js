import React from "react";
import LoansRepo from "../../repo/LoansRepo";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography} from "@mui/material";
import Util from "../../functionalities/Util";


export const Loans = (props) => {
    const formatter = Util.numberFormatter()

    const [loansList, setLoansList] = React.useState([]);
    const [isLoansVisible, setIsLoansVisible] = React.useState(false);

    const getLoansList = () => {
        LoansRepo.getLoans()
            .then((res) => {
                setLoansList(res.data.data.list)
                setIsLoansVisible(res.data.data.list.length > 0)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    React.useEffect(() => {
        getLoansList()
    },[]);

    return isLoansVisible ? <TableContainer component={Paper} sx={{ minWidth: 0 }}>
    <Table>
        <TableHead style={{backgroundColor: '#d80404'}}>
            <TableRow>
                <TableCell style={{color: 'white'}} align="center" colSpan={2}>
                    <Typography variant="h6" component="span" sx={{color: 'inherit'}}>Loans</Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{color: 'white'}} >Name</TableCell>
                <TableCell style={{color: 'white'}} >Amount</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {loansList.map((loan, i) => (
                <TableRow key={'investment-'+i}>
                    <TableCell>{loan.reason}</TableCell>
                    <TableCell>{formatter.format(loan.amount)}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    </TableContainer> :
        <div></div>
}