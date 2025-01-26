import {Autocomplete, Button, CircularProgress, Grid, TextField} from "@mui/material";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import {IncomeList} from "./IncomeList";
import Income from "../../repo/Income";
import React from "react";
import Util from "../../functionalities/Util";
import Expense from "../../repo/Expense";
import DateUtil from "../../functionalities/DateUtil";
import Box from "@mui/material/Box";

export const AddIncome = (props) => {

    const [incomeReasons, setIncomeReasons] = React.useState([]);
    const [incomeCategories, setIncomeCategories] = React.useState([]);
    const [incomeSubCategories, setIncomeSubCategories] = React.useState([]);
    const [incomeSubCategoryData, setIncomeSubCategoryData] = React.useState([]);
    const [incomePayModes, setIncomePayModes] = React.useState([]);


    const [incomeId, setIncomeId] = React.useState(null);
    const [incomeUpdate, setIncomeUpdate] = React.useState(false);
    const [incomeDate, setIncomeDate] = React.useState(new Date());
    const [incomeReason, setIncomeReason] = React.useState('');
    const [incomeCategory, setIncomeCategory] = React.useState('');
    const [incomeSubCategory, setIncomeSubCategory] = React.useState('');
    const [incomeDescription, setIncomeDescription] = React.useState('');
    const [incomeAmount, setIncomeAmount] = React.useState('');
    const [incomePayMode, setIncomePayMode] = React.useState('');

    const [incomeList, setIncomeList] = React.useState([]);
    const [incomeAmountTotal, setIncomeAmountTotal] = React.useState('');

    const [loading, setLoading] = React.useState(false);

    const getIncomeInitData = () => {
        Income.getIncomeInitData()
            .then((res) => {
                setIncomeReasons(res.data.data.reasons)
                setIncomeCategories(res.data.data.categories)
                setIncomeSubCategoryData(res.data.data.subCategories)
                setIncomePayModes(res.data.data.payModes)
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const getIncomeFillable = (reason) => {
        Income.fillable(reason)
            .then((res) => {
                let data = res.data.data

                setIncomeCategory(data.category != null ? data.category.name : '')
                setIncomeSubCategory(data.subCategory != null ? data.subCategory.name : '')
                setIncomePayMode(data.payMode != null ? data.payMode.name : '')

                loadSubCategories(data.category != null ? data.category.name : '')
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const getIncomeList = () => {
        Income.getIncomeList(new DateUtil(incomeDate).mySQLMonth())
            .then((res) => {
                setIncomeList(res.data.data.list)
                setIncomeAmountTotal(res.data.data.amount)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const addIncome = () => {
        if(loading) return;

        setLoading(true)
        Income.addIncome(incomeDate, incomeReason, incomeCategory, incomeSubCategory, incomeDescription, incomeAmount, incomePayMode)
            .then((res) => {
                getIncomeList();
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)
                resetForm()
                setLoading(false)
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
            setLoading(false)
        });
    }
    const editIncome = (income) => {
        setIncomeId(income.id)
        let selectedSubcategoriesData = incomeSubCategoryData[income.category.name];
        setIncomeReason(income.reason != null ? income.reason.name : '');
        setIncomeCategory(income.category != null ? income.category.name : '');
        setIncomeSubCategory(income.subCategory != null ? income.subCategory.name : '');
        setIncomePayMode(income.payMode != null ? income.payMode.name : '');
        setIncomeDescription(income.description != null ? income.description : '');
        setIncomeAmount(income.amount);
        setIncomeSubCategories(selectedSubcategoriesData == null ? [] : selectedSubcategoriesData);
        setIncomeUpdate(true);
    }
    const updateIncome = () => {
        if(loading) return;

        setLoading(true)
        Income.updateIncome(incomeId, incomeDate, incomeReason, incomeCategory, incomeSubCategory, incomeDescription, incomeAmount, incomePayMode)
            .then((res) => {
                getIncomeList()
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)
                resetForm();
                setLoading(false)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
            setLoading(false)
        });
    }
    const deleteIncome = (id) => {
        Income.deleteIncome(id)
            .then((res) => {
                getIncomeList()
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    const loadSubCategories = (category) => {
        let selectedSubCategories = incomeSubCategoryData[category];
        if(selectedSubCategories !== undefined) {
            setIncomeSubCategories(selectedSubCategories);
        }
        else{
            setIncomeSubCategories([]);
        }
    }
    const resetForm = () => {
        setIncomeId(null);
        setIncomeReason('');
        setIncomeCategory('');
        setIncomeDescription('');
        setIncomeAmount('');
        setIncomePayMode('');
        setIncomeSubCategory([]);
        setIncomeUpdate(false);
    }

    React.useEffect(() => {
        getIncomeInitData()
        getIncomeList();
    },[incomeDate]);

    return <Grid item xs={12} md={9}>
        <Grid
            container spacing={1}>
            <Grid style={{padding: 10}} item md={4} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                        label="Date"
                        inputFormat="DD/MM/YYYY"
                        onChange={(newValue) => { setIncomeDate(newValue.$d); }}
                        renderInput={(params) =>
                            <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                {...params} />
                        }
                        value={incomeDate}/>
                </LocalizationProvider>
            </Grid>
        </Grid>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item xs={12} md={8}>
                <Autocomplete
                    value={incomeReason}
                    freeSolo
                    id="income_reason_autocomplete"
                    disableClearable
                    onChange = {(e, v) => {
                        setIncomeReason(v)
                        getIncomeFillable(v)
                    }}
                    options={incomeReasons}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="income_reason"
                            label="Reason"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e) => setIncomeReason(e.target.value)}/>
                    )}
                />
            </Grid>
        </Grid>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item xs={12} md={4}>
                <Autocomplete
                    value={incomeCategory}
                    freeSolo
                    id="income_category_autocomplete"
                    disableClearable
                    options={incomeCategories}
                    onChange = {(e, v) => {
                        loadSubCategories(v)
                        setIncomeCategory(v)
                    }}
                    sx={{width: 300}}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="income_category"
                            label="Category"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e) => {
                                var selectedCategory = e.target.value;
                                loadSubCategories(selectedCategory)

                                setIncomeCategory(selectedCategory);
                            }}/>
                    )}
                />
            </Grid>
            <Grid style={{padding: 10}} item xs={12} md={4}>
                <Autocomplete
                    value={incomeSubCategory}
                    freeSolo
                    id="income_sub_category_autocomplete"
                    disableClearable
                    options={incomeSubCategories}
                    onChange = {(e, v) => setIncomeSubCategory(v)}
                    sx={{width: 300}}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="income_sub_category"
                            label="Sub Category"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e) => setIncomeSubCategory(e.target.value)}/>
                    )}
                />
            </Grid>
        </Grid>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item xs={12} md={8}>
                <SmallOutlinedTextBox id="test-text-field" label="Description" value={incomeDescription}
                                      onInput={(e) => setIncomeDescription(e.target.value)}/>
            </Grid>
        </Grid>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item xs={8} md={4}>
                <SmallOutlinedTextBox id="test-text-field" label="Amount" value={incomeAmount}
                                      onInput={(e) => setIncomeAmount(e.target.value)}/>
            </Grid>
            <Grid
                container spacing={0}>
                <Grid style={{padding: 10}} item xs={12} md={4}>
                    <Autocomplete
                        value={incomePayMode}
                        freeSolo
                        id="income_pay_mode_autocomplete"
                        disableClearable
                        options={incomePayModes}
                        onChange = {(e, v) => setIncomePayMode(v)}
                        sx={{width: 300}}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                id="income_pay_mode"
                                label="Pay Mode"
                                size="small"
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                }}
                                onInput={(e) => setIncomePayMode(e.target.value)}/>
                        )}
                    />
                </Grid>
            </Grid>
        </Grid>
        <Grid
            container
            spacing={0}>

            <Grid item style={{padding: 10}}>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <Button variant="contained">Reset</Button>
                </Box>
            </Grid>
            <Grid item style={{padding: 10}}>
                {
                    incomeUpdate ?
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <Button variant="contained" disabled={loading} onClick={updateIncome}>Save Income</Button>
                            {loading && (
                                <CircularProgress
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                    size={24}/>
                            )}
                        </Box> :
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <Button variant="contained" disabled={loading} onClick={addIncome}>Add Income</Button>
                            {loading && (
                                <CircularProgress
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                    size={24}/>
                            )}
                        </Box>
                }
            </Grid>
        </Grid>
        <IncomeList editIncome={editIncome} deleteIncome={deleteIncome} incomeList={incomeList} incomeAmountTotal={incomeAmountTotal}/>
    </Grid>
}