import {Autocomplete, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@mui/material";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import {DueList} from "./DueList";
import React from "react";
import DuesReturns from "../../repo/DuesReturns";
import Util from "../../functionalities/Util";
import Expense from "../../repo/Expense";
import DateUtil from "../../functionalities/DateUtil";


export const AddDue = (props) => {
    const [dueReasons, setDueReasons] = React.useState([]);
    const [dueCategories, setDueCategories] = React.useState([]);
    const [dueSubCategories, setDueSubCategories] = React.useState([]);
    const [dueSubCategoryData, setDueSubCategoryData] = React.useState([]);

    const [dueDate, setDueDate] = React.useState(new Date());
    const [dueReason, setDueReason] = React.useState('');
    const [dueCategory, setDueCategory] = React.useState('');
    const [dueSubCategory, setDueSubCategory] = React.useState('');
    const [dueAmount, setDueAmount] = React.useState('');

    const [dueList, setDueList] = React.useState([]);

    const addDue = () => {
        DuesReturns.addDues(dueDate, dueReason, dueCategory, dueSubCategory, dueAmount)
            .then((res) => {
                getDuesList()
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)
                resetForm();
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const getDueInitData = () => {
        Expense.getExpenseInitData()
            .then((res) => {
                setDueReasons(res.data.data.reasons)
                setDueCategories(res.data.data.categories)
                setDueSubCategoryData(res.data.data.subCategories)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const getDuesList = () => {
        DuesReturns.getDues(new DateUtil().mySQLMonth())
            .then((res) => {
                setDueList(res.data.data)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const deleteDue = (id) => {
        DuesReturns.deleteDues(id).then((res) => {
            getDuesList();
            props.setSnackbarMessage(res.data.msg)
            props.setOpenSnackbar(true)
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const resetForm = () => {
        setDueReason('');
        setDueCategory('');
        setDueAmount('');
        setDueDate(new Date());
        setDueSubCategory([]);
    }

    React.useEffect(() => {
        getDueInitData()
        getDuesList()
    }, []);

    return <Grid item xs={12} md={9}>
        <Grid
            container spacing={1}>
            <Grid style={{padding: 10}} item md={4} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                        label="Date"
                        inputFormat="DD/MM/YYYY"
                        onChange={(newValue) => {
                            setDueDate(newValue);
                        }}
                        renderInput={(params) =>
                            <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                {...params} />
                        }
                        value={dueDate}/>
                </LocalizationProvider>
            </Grid>
        </Grid>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item xs={12} md={8}>
                <Autocomplete
                    value={dueReason}
                    freeSolo
                    id="due_reason_autocomplete"
                    disableClearable
                    options={dueReasons}
                    onChange={(e, v) => setDueReason(v)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="due_reason"
                            label="Reason"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e) => setDueReason(e.target.value)}/>
                    )}
                />
            </Grid>
        </Grid>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item>
                <Autocomplete
                    value={dueCategory}
                    freeSolo
                    id="due_category_autocomplete"
                    disableClearable
                    options={dueCategories}
                    onChange={(e, v) => {
                        let selectedSubCategories = dueSubCategoryData[v];
                        if (selectedSubCategories !== undefined) {
                            setDueSubCategories(selectedSubCategories);
                        } else {
                            setDueSubCategories([]);
                        }
                        setDueCategory(v)
                    }}
                    sx={{width: 300}}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="due_category"
                            label="Category"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e) => {
                                var selectedCategory = e.target.value;
                                let selectedSubCategories1 = dueSubCategoryData[selectedCategory];
                                if (selectedSubCategories1 !== undefined) {
                                    setDueSubCategories(selectedSubCategories1);
                                } else {
                                    setDueSubCategories([]);
                                }

                                setDueCategory(selectedCategory);
                            }}/>
                    )}
                />
            </Grid>
            <Grid style={{padding: 10}} item>
                <Autocomplete
                    value={dueSubCategory}
                    freeSolo
                    id="due_sub_category_autocomplete"
                    disableClearable
                    options={dueSubCategories}
                    onChange={(e, v) => setDueSubCategory(v)}
                    sx={{width: 300}}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="due_sub_category"
                            label="Sub Category"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e) => setDueSubCategory(e.target.value)}/>
                    )}
                />
            </Grid>
        </Grid>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item xs={8} md={4}>
                <SmallOutlinedTextBox id="test-text-field" label="Amount" value={dueAmount}
                                      onInput={(e) => setDueAmount(e.target.value)}/>
            </Grid>
        </Grid>
        <Grid
            container
            spacing={0}>
            <Grid item style={{padding: 10}}>
                <Button variant="contained">Reset</Button>
            </Grid>
            <Grid item style={{padding: 10}}>
                <Button variant="contained" onClick={addDue}>Add Due</Button>
            </Grid>
        </Grid>
        <DueList deleteDue={deleteDue} dueList={dueList}/>
    </Grid>
}