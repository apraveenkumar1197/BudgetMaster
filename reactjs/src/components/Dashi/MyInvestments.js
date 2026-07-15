import {
    Icon,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Fade,
    Modal, TableFooter, Button
} from "@mui/material";
import React from "react";
import Investment from "../../repo/Investment";
import Util from "../../functionalities/Util";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import * as Immutable from "@mui/material";


const style = {
    position: 'absolute',
    overflow: 'auto',
    top: '50%',
    left: '50%',
    maxHeight: '85vh',
    transform: 'translate(-50%, -50%)',
    width: {xs: '92%', sm: 420},
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    pt: 2,
    px: {xs: 2, sm: 4},
    pb: 3,
};

export const MyInvestments = (props) => {
    const formatter = Util.numberFormatter()

    const [investmentListOriginal, setInvestmentListOriginal] = React.useState([]);
    const [investmentList, setInvestmentList] = React.useState([]);
    const [investmentListTotal, setInvestmentListTotal] = React.useState('');
    const [investmentListTotalText, setInvestmentListTotalText] = React.useState('');
    const [investmentListTotalFlag, setInvestmentListTotalFlag] = React.useState(true);
    const [showZeroInvestments, setShowZeroInvestments] = React.useState(false);
    const [sortListMode, setSortListMode] = React.useState(0);
    const [sortListText, setSortListText] = React.useState("Sort - Default");

    const getMyInvestments = () => {
        Investment.myInvestments()
            .then((res) => {
                let list = []
                let total = 0

                if (showZeroInvestments) {
                    list = res.data.data.list
                } else {
                    list = res.data.data.list.filter(item => item.amount != 0)
                }
                total = res.data.data.total
                setInvestmentListOriginal(list)
                setInvestmentList(list)
                setInvestmentListTotal(total)
                setInvestmentListTotalText(numberToIndianText(total))


            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    const hideOrUnHide = (reasonId, toShow) => {
        if (toShow) {
            Investment.unhide(reasonId)
                .then((res) => {
                    props.setSnackbarMessage(res.data.msg)
                    props.setOpenSnackbar(true)
                    getMyInvestments()
                }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
            });
        } else {
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

    const numberToIndianText = (amount) => {
        amount = Math.round(amount);

        if (amount >= 10000000) {
            return (amount / 10000000).toFixed(2).replace(/\.00$/, '') + " Crore";
        } else if (amount >= 100000) {
            return (amount / 100000).toFixed(2).replace(/\.00$/, '') + " Lakh";
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(2).replace(/\.00$/, '') + " Thousand";
        } else {
            return amount.toString();
        }
    }

    const sortList = () => {
        console.log(investmentList, investmentListOriginal)
        // 0 - Default
        // 1 - Name
        // 2 - Amount
        let newMode = sortListMode + 1
        if (newMode > 2) {
            newMode = 1
        }
        if (newMode === 1) {
            setInvestmentList(investmentListOriginal.sort(function(a, b) {
                var keyA = a.reason,
                    keyB = b.reason;
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            }));
            setSortListText('Sort - Name')
        } else if (newMode === 2) {
            setInvestmentList(investmentListOriginal.sort(function(a, b) {
                var keyA = a.amount,
                    keyB = b.amount;
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            }));
            setSortListText('Sort - Amount')
        }


        setSortListMode(newMode)
    }


    React.useEffect(() => {
        getMyInvestments()
        setInvestmentListTotalText(investmentListTotal)
    }, []);

    React.useEffect(() => {
        getMyInvestments()
        setInvestmentListTotalText(investmentListTotal)
    }, [showZeroInvestments]);

    return (
        <div>
            <Modal
                open={props.myInvestments}
                onClose={!props.myInvestments}
                onBackdropClick={() => props.setMyInvestments(false)}
                closeAfterTransition
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Fade in={props.myInvestments}>
                <Box sx={style}>
                    <FormControlLabel
                        control={<Switch
                            value={showZeroInvestments}
                            onClick={(e) => setShowZeroInvestments(e.target.checked)}/>}
                        label="Zero investments"/>
                    <FormControlLabel
                        control={<Button onClick={sortList}>{sortListText}</Button>}/>

                    <TableContainer sx={{ maxHeight: '55vh' }}>
                    <Table>
                        <TableHead sx={{backgroundColor: 'primary.main'}}>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}>Investment name</TableCell>
                                <TableCell sx={{ color: 'white' }}>Amount</TableCell>
                                <TableCell sx={{ color: 'white' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {investmentList.map((investment, i) => (
                                <TableRow key={'investment-' + i}>
                                    <TableCell>{investment.reason}</TableCell>
                                    <TableCell>{formatter.format(investment.amount)}</TableCell>
                                    <TableCell style={{display: showZeroInvestments ? 'block ' : 'none'}}>
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
                                <TableCell colSpan={3} align={'center'} onClick={() => {
                                    setInvestmentListTotalFlag(!investmentListTotalFlag)
                                    if (investmentListTotalFlag) {
                                        setInvestmentListTotalText(formatter.format(investmentListTotal))
                                    } else {
                                        setInvestmentListTotalText(numberToIndianText(investmentListTotal))
                                    }
                                }}>
                                    <h2>
                                        {investmentListTotalText}
                                    </h2>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    </TableContainer>
                </Box>
                </Fade>
            </Modal>
        </div>
    );
}