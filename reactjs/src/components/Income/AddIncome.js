import { Autocomplete, Button, CircularProgress, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SmallOutlinedTextBox } from "../../ui/SmallOutlinedTextBox";
import { IncomeList } from "./IncomeList";
import Income from "../../repo/Income";
import React from "react";
import Util from "../../functionalities/Util";
import Expense from "../../repo/Expense";
import DateUtil from "../../functionalities/DateUtil";
import Box from "@mui/material/Box";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { LoadingButton } from "../../ui/LoadingButton";

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
    const [listLoading, setListLoading] = React.useState(false);
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
        setListLoading(true);
        Income.getIncomeList(new DateUtil(incomeDate).mySQLMonth())
            .then((res) => {
                setIncomeList(res.data.data.list)
                setIncomeAmountTotal(res.data.data.amount)
                setListLoading(false);
            }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
                setListLoading(false);
            });
    }
    const addIncome = () => {
        if (loading) return;

        setLoading(true)
        Income.addIncome((new DateUtil(incomeDate)).mySQLDate(), incomeReason, incomeCategory, incomeSubCategory, incomeDescription, incomeAmount, incomePayMode)
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
        if (loading) return;

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
        return Income.deleteIncome(id)
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
        if (selectedSubCategories !== undefined) {
            setIncomeSubCategories(selectedSubCategories);
        }
        else {
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
    }, [incomeDate]);

    return <Grid container spacing={2} sx={{ p: 2, height: { xs: 'auto', md: 'calc(100vh - 100px)' }, overflow: 'hidden' }}>
        {/* Left Column - Form */}
        <Grid item xs={12} md={4} sx={{ height: { xs: 'auto', md: '100%' }, overflow: 'auto' }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                    Add Income
                </Typography>

                {/* Date Picker with Navigation */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton size="small" onClick={() => {
                        let date = new Date(incomeDate);
                        date.setMonth(date.getMonth() - 1);
                        setIncomeDate(date);
                    }}>
                        <KeyboardDoubleArrowLeftIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => {
                        let date = new Date(incomeDate);
                        date.setDate(date.getDate() - 1);
                        setIncomeDate(date);
                    }}>
                        <ArrowBackIosIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ flex: 1, mx: 1 }}>
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
                                value={incomeDate} />
                        </LocalizationProvider>
                    </Box>
                    <IconButton size="small" onClick={() => {
                        let date = new Date(incomeDate);
                        date.setDate(date.getDate() + 1);
                        setIncomeDate(date);
                    }}>
                        <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => {
                        let date = new Date(incomeDate);
                        date.setMonth(date.getMonth() + 1);
                        setIncomeDate(date);
                    }}>
                        <KeyboardDoubleArrowRightIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Reason */}
                <Box sx={{ mb: 2 }}>
                    <Autocomplete
                        value={incomeReason}
                        freeSolo
                        id="income_reason_autocomplete"
                        disableClearable
                        onChange={(e, v) => {
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
                                fullWidth
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                }}
                                onInput={(e) => setIncomeReason(e.target.value)} />
                        )}
                    />
                </Box>

                {/* Category and Sub Category */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <Autocomplete
                            value={incomeCategory}
                            freeSolo
                            id="income_category_autocomplete"
                            disableClearable
                            options={incomeCategories}
                            onChange={(e, v) => {
                                loadSubCategories(v)
                                setIncomeCategory(v)
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id="income_category"
                                    label="Category"
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                    }}
                                    onInput={(e) => {
                                        var selectedCategory = e.target.value;
                                        loadSubCategories(selectedCategory)
                                        setIncomeCategory(selectedCategory);
                                    }} />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            value={incomeSubCategory}
                            freeSolo
                            id="income_sub_category_autocomplete"
                            disableClearable
                            options={incomeSubCategories}
                            onChange={(e, v) => setIncomeSubCategory(v)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id="income_sub_category"
                                    label="Sub Category"
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                    }}
                                    onInput={(e) => setIncomeSubCategory(e.target.value)} />
                            )}
                        />
                    </Grid>
                </Grid>

                {/* Description */}
                <Box sx={{ mb: 2 }}>
                    <SmallOutlinedTextBox
                        id="income_description"
                        label="Description"
                        value={incomeDescription}
                        onInput={(e) => setIncomeDescription(e.target.value)}
                        fullWidth
                    />
                </Box>

                {/* Amount and Pay Mode */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                        <SmallOutlinedTextBox
                            id="income_amount"
                            label="Amount"
                            value={incomeAmount}
                            onInput={(e) => setIncomeAmount(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            value={incomePayMode}
                            freeSolo
                            id="income_pay_mode_autocomplete"
                            disableClearable
                            options={incomePayModes}
                            onChange={(e, v) => setIncomePayMode(v)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id="income_pay_mode"
                                    label="Pay Mode"
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                    }}
                                    onInput={(e) => setIncomePayMode(e.target.value)} />
                            )}
                        />
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button
                        variant="text"
                        onClick={resetForm}
                        size="small"
                    >
                        Reset
                    </Button>
                    {
                        incomeUpdate ?
                            <Box sx={{ position: 'relative', flex: 1 }}>
                                <Button
                                    variant="contained"
                                    disabled={loading}
                                    onClick={updateIncome}
                                    fullWidth
                                    size="large"
                                >
                                    Save Income
                                </Button>
                                {loading && (
                                    <CircularProgress
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                        size={24} />
                                )}
                            </Box> :
                            <LoadingButton
                                variant="contained"
                                disabled={loading}
                                onClick={addIncome}
                                size="large"
                                sx={{ flex: 1 }}
                            >
                                Add Income
                            </LoadingButton>
                    }
                </Box>
            </Paper>
        </Grid>

        {/* Right Column - Income List */}
        <Grid item xs={12} md={8} sx={{ height: { xs: 'auto', md: '100%' }, display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                    Income List
                </Typography>
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <IncomeList
                        editIncome={editIncome}
                        deleteIncome={deleteIncome}
                        incomeList={incomeList}
                        incomeAmountTotal={incomeAmountTotal}
                        listLoading={listLoading}
                    />
                </Box>
            </Paper>
        </Grid>
    </Grid>
}