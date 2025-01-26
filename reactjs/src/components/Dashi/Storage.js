import {
    Autocomplete,
    Button, Grid,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableFooter,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import React, {Component} from "react";
import Expense from "../../repo/Expense";
import Util from "../../functionalities/Util";
import Register from "../../repo/Register";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import Box from "@mui/material/Box";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {PageLoader} from "../../ui/PageLoader";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import DateUtil from "../../functionalities/DateUtil";
import {StorageUi} from "../Storage/StorageUi";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const Storage = (props) => {

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

    //setStorageList(props.storageList)
    //setTotalAmount(props.totalAmount)

    const getStorageList = () => {

        setLoading(true);
        Register.getStorageList()
            .then((res) => {
                setLoading(false);
                setStorageList(res.data.data.list)
                setAllStorageList(res.data.data.all)
                setTotalAmount(res.data.data.total)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    };

    const transferStorage = () => {
        console.log("Date ::", date)
        Register.transferStorage((new DateUtil(date)).mySQLDate(), fromStorage.id, toStorage.id, amount)
            .then((res) => {
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)
                handleClose();
                getStorageList();
                resetForm()
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    const resetForm = () => {
        setFromStorage(null);
        setToStorage(null);
        setAmount('');
    }

    React.useEffect(() => {
        getStorageList()
    }, []);

    return loading ? <PageLoader/> : <div>
       <StorageUi
           totalAmount={totalAmount}
           storageList={storageList}
           storageTransfer={props.storageTransfer}
           handleClickOpen={handleClickOpen} />

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Storage Transfer</DialogTitle>
            <DialogContent>
                <br></br>
                <Grid
                    container spacing={1}>
                    <Grid style={{padding: 10}} item md={6} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                                label="Date"
                                inputFormat="DD/MM/YYYY"
                                onChange={(newValue) => {
                                    setDate(newValue.$d);
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        {...params} />
                                }
                                value={date}/>
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid style={{padding: 10}} item xs={12} md={4}>
                        <Autocomplete
                            getOptionLabel={option => option.name}
                            value={fromStorage}
                            freeSolo
                            id="from_storage_id_autocomplete"
                            disableClearable
                            options={allStorageList}
                            onChange={(e, v) => setFromStorage(v)}
                            sx={{width: 300}}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id="from_storage_id_textbox"
                                    label="From Storage"
                                    size="small"
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                    }}/>
                            )}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid style={{padding: 10}} item xs={12} md={4}>
                        <Autocomplete
                            getOptionLabel={option => option.name}
                            value={toStorage}
                            freeSolo
                            id="to_storage_id_autocomplete"
                            disableClearable
                            options={allStorageList}
                            onChange={(e, v) => setToStorage(v)}
                            sx={{width: 300}}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id="to_storage_id_textbox"
                                    label="To Storage"
                                    size="small"
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                    }}/>
                            )}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid style={{padding: 10}} item xs={12} md={8}>
                        <SmallOutlinedTextBox label='Amount' value={amount}
                                              onInput={(e) => setAmount(e.target.value)}/>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={transferStorage}>Transfer</Button>
            </DialogActions>
        </Dialog>
    </div>
}