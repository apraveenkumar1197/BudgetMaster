import {PageLoader} from "../../ui/PageLoader";
import {
    Autocomplete,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import DialogActions from "@mui/material/DialogActions";
import React from "react";
import Util from "../../functionalities/Util";


export const StorageUi = (props) => {

    const formatter = Util.numberFormatter()

    const [date, setDate] = React.useState(new Date());
    const [fromStorage, setFromStorage] = React.useState(null);
    const [toStorage, setToStorage] = React.useState(null);
    const [amount, setAmount] = React.useState('');

    const [allStorageList, setAllStorageList] = React.useState([]);
    const [storageList, setStorageList] = React.useState([]);
    const [totalAmount, setTotalAmount] = React.useState('');

    const [loading, setLoading] = React.useState(false);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return loading ? <PageLoader/> : <TableContainer component={Paper} sx={{ minWidth: 0 }}>
        <Table>
            <TableHead sx={{backgroundColor: 'primary.main'}}>
                <TableRow>
                    <TableCell style={{color: 'white'}} align="center" colSpan={2}>
                        <Typography variant="h6" component="span" sx={{color: 'inherit'}}>Storage</Typography>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{color: 'white'}}>Storage</TableCell>
                    <TableCell style={{color: 'white'}}>Amount</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.storageList.map((storage, i) => (
                    <TableRow key={'storage-' + i}>
                        <TableCell>{storage.name}</TableCell>
                        {
                            storage.credit_card && storage.amount > 0 ?
                                <TableCell style={{
                                    color: 'red',
                                    fontWeight: 'bold'
                                }}>{formatter.format(storage.amount)}</TableCell> :
                                <TableCell>{formatter.format(storage.amount)}</TableCell>
                        }
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    {
                        props.storageTransfer ?
                            <TableCell>
                                <Button
                                    variant="contained"
                                    onClick={props.handleClickOpen}>Storage Transfer
                                </Button>
                            </TableCell> :
                            <div></div>
                    }
                    <TableCell><Typography variant="h6">{formatter.format(props.totalAmount)}</Typography></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </TableContainer>
}