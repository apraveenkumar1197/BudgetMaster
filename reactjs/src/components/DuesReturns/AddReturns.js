import {Autocomplete, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@mui/material";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import {ReturnsList} from "./ReturnsList";
import React from "react";
import DuesReturns from "../../repo/DuesReturns";
import Util from "../../functionalities/Util";
import Expense from "../../repo/Expense";
import DateUtil from "../../functionalities/DateUtil";


export const AddReturns = (props) => {
    const [returnsReasons, setReturnsReasons] = React.useState([]);
    const [returnsCategories, setReturnsCategories] = React.useState([]);
    const [returnsSubCategories, setReturnsSubCategories] = React.useState([]);
    const [returnsSubCategoryData, setReturnsSubCategoryData] = React.useState([]);

    const [returnsDate, setReturnsDate] = React.useState(new Date());
    const [returnsReason, setReturnsReason] = React.useState('');
    const [returnsCategory, setReturnsCategory] = React.useState('');
    const [returnsSubCategory, setReturnsSubCategory] = React.useState('');
    const [returnsAmount, setReturnsAmount] = React.useState('');

    const [returnsList, setReturnsList] = React.useState([]);

    const addReturns = () => {
        DuesReturns.addReturns(returnsDate, returnsReason, returnsCategory, returnsSubCategory, returnsAmount)
            .then((res) => {
                getReturnsList()
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)
                resetForm();
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const getReturnsInitData = () => {
        Expense.getExpenseInitData()
            .then((res) => {
                setReturnsReasons(res.data.data.reasons)
                setReturnsCategories(res.data.data.categories)
                setReturnsSubCategoryData(res.data.data.subCategories)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const getReturnsList = () => {
        DuesReturns.getReturns(new DateUtil().mySQLMonth())
            .then((res) => {
                setReturnsList(res.data.data)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    const deleteReturns = (id) => {
        DuesReturns.deleteReturns(id).then((res) => {
            getReturnsList();
            props.setSnackbarMessage(res.data.msg)
            props.setOpenSnackbar(true)
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const resetForm = () => {
        setReturnsReason('');
        setReturnsCategory('');
        setReturnsAmount('');
        setReturnsDate(new Date());
        setReturnsSubCategory([]);
    }

    React.useEffect(() => {
        getReturnsInitData()
        getReturnsList()
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
                            setReturnsDate(newValue);
                        }}
                        renderInput={(params) =>
                            <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                {...params} />
                        }
                        value={returnsDate}/>
                </LocalizationProvider>
            </Grid>
        </Grid>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item xs={12} md={8}>
                <Autocomplete
                    value={returnsReason}
                    freeSolo
                    id="returns_reason_autocomplete"
                    disableClearable
                    options={returnsReasons}
                    onChange={(e, v) => setReturnsReason(v)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="returns_reason"
                            label="Reason"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e) => setReturnsReason(e.target.value)}/>
                    )}
                />
            </Grid>
        </Grid>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item xs={12} md={4}>
                <Autocomplete
                    value={returnsCategory}
                    freeSolo
                    id="returns_category_autocomplete"
                    disableClearable
                    options={returnsCategories}
                    onChange={(e, v) => {
                        let selectedSubCategories = returnsSubCategoryData[v];
                        if (selectedSubCategories !== undefined) {
                            setReturnsSubCategories(selectedSubCategories);
                        } else {
                            setReturnsSubCategories([]);
                        }
                        setReturnsCategory(v)
                    }}
                    sx={{width: 300}}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="returns_category"
                            label="Category"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e) => {
                                var selectedCategory = e.target.value;
                                let selectedSubCategories1 = returnsSubCategoryData[selectedCategory];
                                if (selectedSubCategories1 !== undefined) {
                                    setReturnsSubCategories(selectedSubCategories1);
                                } else {
                                    setReturnsSubCategories([]);
                                }

                                setReturnsCategory(selectedCategory);
                            }}/>
                    )}
                />
            </Grid>
            <Grid style={{padding: 10}} item xs={12} md={4}>
                <Autocomplete
                    value={returnsSubCategory}
                    freeSolo
                    id="returns_sub_category_autocomplete"
                    disableClearable
                    options={returnsSubCategories}
                    onChange={(e, v) => setReturnsSubCategory(v)}
                    sx={{width: 300}}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="returns_sub_category"
                            label="Sub Category"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e) => setReturnsSubCategory(e.target.value)}/>
                    )}
                />
            </Grid>
        </Grid>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item xs={8} md={4}>
                <SmallOutlinedTextBox id="test-text-field" label="Amount" value={returnsAmount}
                                      onInput={(e) => setReturnsAmount(e.target.value)}/>
            </Grid>
        </Grid>
        <Grid
            container
            spacing={0}>
            <Grid item style={{padding: 10}}>
                <Button variant="contained">Reset</Button>
            </Grid>
            <Grid item style={{padding: 10}}>
                <Button variant="contained" onClick={addReturns}>Add Returns</Button>
            </Grid>
        </Grid>
        <ReturnsList deleteReturns={deleteReturns} returnsList={returnsList}/>
    </Grid>
}