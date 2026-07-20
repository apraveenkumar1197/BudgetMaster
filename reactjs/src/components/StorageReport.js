import Util from "../functionalities/Util";
import React from "react";
import Storage from "../repo/Storage";
import {
    Autocomplete,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DateUtil from "../functionalities/DateUtil";
import CreditCard from "../repo/CreditCard";
import { Storage as StorageList } from "./Dashi/Storage";
import { StorageUi } from "./Storage/StorageUi";

export const StorageReport = (props) => {
    const formatter = Util.numberFormatter()

    const [storageTransferList, setStorageTransferList] = React.useState([]);

    const [storageList, setStorageList] = React.useState([]);
    const [totalAmount, setTotalAmount] = React.useState('');

    const [fromDate, setFromDate] = React.useState(new DateUtil().monthBeginning());
    const [toDate, setToDate] = React.useState(new Date());
    const [fromStorage, setFromStorage] = React.useState(null);
    const [toStorage, setToStorage] = React.useState(null);

    const getTransactionReport = () => {
        Storage.transactionReport((new DateUtil(fromDate)).mySQLDate(), (new DateUtil(toDate)).mySQLDate(), fromStorage, toStorage).then((res) => {
            setStorageTransferList(res.data.data.transfers)
            setStorageList(res.data.data.storage.list)
            setTotalAmount(res.data.data.storage.total)
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    React.useEffect(() => {
        getTransactionReport()
    }, [fromStorage, toStorage, fromDate, toDate]);

    return <Grid
        container spacing={0}>
        <Grid style={{ padding: 10 }} item md={3} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                    label="From Date"
                    inputFormat="DD/MM/YYYY"
                    onChange={(newValue) => {
                        setFromDate(newValue.$d);
                    }}
                    renderInput={(params) =>
                        <TextField
                            variant="outlined"
                            size="small"
                            fullWidth
                            {...params} />
                    }
                    value={fromDate} />
            </LocalizationProvider>
        </Grid>
        <Grid style={{ padding: 10 }} item md={3} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                    label="To Date"
                    inputFormat="DD/MM/YYYY"
                    onChange={(newValue) => {
                        setToDate(newValue.$d);
                    }}
                    renderInput={(params) =>
                        <TextField
                            variant="outlined"
                            size="small"
                            fullWidth
                            {...params} />
                    }
                    value={toDate} />
            </LocalizationProvider>
        </Grid>
        <Grid style={{ padding: 10 }} item md={3} xs={12}>
            <Autocomplete
                value={fromStorage}
                freeSolo
                id="from_storage_autocomplete"
                disableClearable
                options={storageList}
                getOptionLabel={(option) => option.name}
                onChange={(e, v) => {
                    console.log(v)
                    setFromStorage(v);
                }}
                fullWidth
                sx={{ width: { xs: '100%', sm: 300 } }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        id="from_storage"
                        label="From Storage"
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        onInput={(e) => {
                            setFromStorage(e.nativeEvent.value)
                        }}
                    />
                )}
            />
        </Grid>
        <Grid style={{ padding: 10 }} item md={3} xs={12}>
            <Autocomplete
                value={toStorage}
                freeSolo
                id="to_storage_autocomplete"
                disableClearable
                options={storageList}
                onChange={(e, v) => {
                    setToStorage(v);
                }}
                getOptionLabel={(option) => option.name}
                fullWidth
                sx={{ width: { xs: '100%', sm: 300 } }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        id="to_storage"
                        label="To Storage"
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        onInput={(e) => {
                            setToStorage(e.nativeEvent.value)
                        }}
                    />
                )}
            />
        </Grid>
        <Grid style={{ padding: 10 }} item md={8} xs={12}>
            <TableContainer component={Paper} sx={{ maxHeight: { xs: '60vh', md: '65vh' } }}>
                <Table size="small" stickyHeader>
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', backgroundColor: 'primary.main' }}>S.No</TableCell>
                            <TableCell sx={{ color: 'white', backgroundColor: 'primary.main' }}>Date</TableCell>
                            <TableCell sx={{ color: 'white', backgroundColor: 'primary.main' }}>From</TableCell>
                            <TableCell sx={{ color: 'white', backgroundColor: 'primary.main' }}>To</TableCell>
                            <TableCell sx={{ color: 'white', backgroundColor: 'primary.main' }}>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {storageTransferList.map((transfer, i) => (
                            <TableRow key={i} hover>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{transfer.date}</TableCell>
                                <TableCell>{transfer.from}</TableCell>
                                <TableCell>{transfer.to}</TableCell>
                                <TableCell>{formatter.format(transfer.amount)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        <Grid style={{ padding: 10 }} item md={4} xs={12}>
            <StorageUi
                storageTransfer={false}
                setSnackbarMessage={props.setSnackbarMessage}
                setOpenSnackbar={props.setOpenSnackbar}
                storageList={storageList}
                totalAmount={totalAmount} />
        </Grid>
    </Grid>
}