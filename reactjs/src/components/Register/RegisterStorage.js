import {
    Button,
    Container,
    Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
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
    return <Container sx={{ width: '70%' }}>
        <Grid container spacing={1}>
            <Grid style={{padding: 10}} item md={8} xs={12}>
                <SmallOutlinedTextBox id="storage_name" label="Name" value={storageName} onInput={(e)=>setStorageName(e.target.value)}/>

            </Grid>
        </Grid>
        <Grid container spacing={1}>
            <Grid style={{padding: 10}} item md={4} xs={12}>
                <SmallOutlinedTextBox id="storage_amount" label="Amount" value={storageAmount} onInput={(e)=>setStorageAmount(e.target.value)}/>
            </Grid>
        </Grid>
        <Grid container spacing={1}>
            <Grid style={{padding: 10}} item md={4} xs={12}>
                <Button onClick={handleAddStorage}>Add Storage</Button>
            </Grid>
        </Grid>
        <Grid container spacing={1}>
            <Grid style={{padding: 10}} item md={4} xs={12}>
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell align="right">Reason</TableCell>
                                <TableCell align="right">Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {storages.map((storage,i) => (
                                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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