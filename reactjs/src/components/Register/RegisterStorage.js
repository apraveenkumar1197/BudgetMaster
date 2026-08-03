import {
    Button,
    Container,
    Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import React from "react";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import Register from "../../repo/Register";

export const RegisterStorage = (props) => {

    const [storages, setStorages] = React.useState([]);

    const [storageName, setStorageName] = React.useState('');
    const [storageAmount, setStorageAmount] = React.useState('');
    const getStorageList = () => {
        Register.getStorageList()
            .then((res) => {
                setStorages(res.data)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    const handleAddStorage = () => {
        Register.addStorage(storageName, storageAmount)
            .then((res) => {
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)

                setStorageName('')
                setStorageAmount('')

                getStorageList();
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    React.useEffect(() => {
        getStorageList()
    },[]);
    return <Container disableGutters maxWidth={false} sx={{ width: '100%' }}>
        <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
                <SmallOutlinedTextBox id="storage_name" label="Name" value={storageName} onInput={(e)=>setStorageName(e.target.value)}/>
            </Grid>
            <Grid item xs={12} md={4}>
                <SmallOutlinedTextBox id="storage_amount" label="Amount" value={storageAmount} onInput={(e)=>setStorageAmount(e.target.value)}/>
            </Grid>
            <Grid item xs={12} md={4}>
                <Button variant="contained" onClick={handleAddStorage}>Add Storage</Button>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell align="right">Reason</TableCell>
                                <TableCell align="right">Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {storages.map((storage,i) => (
                                <TableRow key={i} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="right">{i+1}</TableCell>
                                    <TableCell align="right">{storage.name}</TableCell>
                                    <TableCell align="right">{storage.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    </Container>
}