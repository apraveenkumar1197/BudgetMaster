import {
    Icon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
    Modal, TableFooter
} from "@mui/material";
import React from "react";
import Investment from "../../repo/Investment";
import Util from "../../functionalities/Util";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";


const style = {
    position: 'absolute',
    overflow: 'scroll',
    top: '50%',
    left: '50%',
    height:'100%',
    maxHeight: 500,
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export const MyInvestments = (props) => {
    const formatter = Util.numberFormatter()

    const [investmentList, setInvestmentList] = React.useState([]);
    const [investmentListTotal, setInvestmentListTotal] = React.useState('');

    const getMyInvestments = () => {
        Investment.myInvestments()
            .then((res) => {
                setInvestmentList(res.data.data.list)
                setInvestmentListTotal(res.data.data.total)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    const hideOrUnHide = (reasonId, toShow) => {
        if(toShow){
            Investment.unhide(reasonId)
                .then((res) => {
                    props.setSnackbarMessage(res.data.msg)
                    props.setOpenSnackbar(true)
                    getMyInvestments()
                }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
            });
        }
        else{
            Investment.hide(reasonId)
                .then((res) => {
                    props.setSnackbarMessage(res.data.msg)
                    props.setOpenSnackbar(true)
                    getMyInvestments()
                }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
            });
        }
    }

    React.useEffect(() => {
        getMyInvestments()
    },[]);

    return (
        <div>
            <Modal
                open={props.myInvestments}
                onClose={!props.myInvestments}
                onBackdropClick={() => props.setMyInvestments(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Table>
                        <TableHead style={{backgroundColor: '#1976d2', color: '#ffffff'}}>
                            <TableRow>
                                <TableCell>Investment name</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {investmentList.map((investment, i) => (
                                <TableRow key={'investment-'+i}>
                                    <TableCell>{investment.reason}</TableCell>
                                    <TableCell>{formatter.format(investment.amount)}</TableCell>
                                    <TableCell>
                                        <FormControlLabel control={
                                            <Switch
                                                onClick={(e) => hideOrUnHide(investment.reason_id, e.target.checked)}
                                                defaultChecked/>
                                        }/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>
                                    <h2>
                                        {formatter.format(investmentListTotal)}
                                    </h2>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Box>
            </Modal>
        </div>
    );
}