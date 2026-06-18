import {
    Autocomplete,
    Button,
    Grid,
    TextField,
    Box,
    IconButton
} from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SmallOutlinedTextBox } from "../../ui/SmallOutlinedTextBox";
import React from "react";
import Expense from "../../repo/Expense";
import DateUtil from "../../functionalities/DateUtil";
import { LoadingButton } from "../../ui/LoadingButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const ExpenseForm = ({ initialData, currentDate, onSubmitSuccess, onCancel, setSnackbarMessage, setOpenSnackbar, onDateChange }) => {
    const [expenseReasons, setExpenseReasons] = React.useState([]);
    const [expenseCategories, setExpenseCategories] = React.useState([]);
    const [expenseSubCategories, setExpenseSubCategories] = React.useState([]);
    const [expenseSubCategoryData, setExpenseSubCategoryData] = React.useState([]);
    const [expensePayModes, setExpensePayModes] = React.useState([]);

    const [expenseId, setExpenseId] = React.useState(null);
    const [expenseUpdate, setExpenseUpdate] = React.useState(false);
    const [expenseDate, setExpenseDate] = React.useState(new Date());
    const [expenseReason, setExpenseReason] = React.useState('');
    const [expenseCategory, setExpenseCategory] = React.useState('');
    const [expenseSubCategory, setExpenseSubCategory] = React.useState('');
    const [expenseDescription, setExpenseDescription] = React.useState('');
    const [expenseAmount, setExpenseAmount] = React.useState('');
    const [expensePayMode, setExpensePayMode] = React.useState('');

    const [loading, setLoading] = React.useState(false);

    const getExpenseInitData = () => {
        Expense.getExpenseInitData()
            .then((res) => {
                setExpenseReasons(res.data.data.reasons)
                setExpenseCategories(res.data.data.categories)
                setExpenseSubCategoryData(res.data.data.subCategories)
                setExpensePayModes(res.data.data.payModes)
            }).catch((err) => {
                setSnackbarMessage(err.response.data.msg)
                setOpenSnackbar(true)
            });
    }

    const loadSubCategories = (category, subCategoryData = expenseSubCategoryData) => {
        let selectedSubCategories = subCategoryData[category];
        if (selectedSubCategories !== undefined) {
            setExpenseSubCategories(selectedSubCategories);
        } else {
            setExpenseSubCategories([]);
        }
    }

    const getExpenseFillable = (reason) => {
        Expense.fillable(reason)
            .then((res) => {
                let data = res.data.data
                setExpenseCategory(data.category != null ? data.category.name : '')
                setExpenseSubCategory(data.subCategory != null ? data.subCategory.name : '')
                setExpensePayMode(data.payMode != null ? data.payMode.name : '')
                loadSubCategories(data.category != null ? data.category.name : '')
            }).catch((err) => {
                setSnackbarMessage(err.response.data.msg)
                setOpenSnackbar(true)
            });
    }

    const resetForm = () => {
        setExpenseId(null);
        setExpenseReason('');
        setExpenseCategory('');
        setExpenseDescription('');
        setExpenseAmount('');
        setExpensePayMode('');
        setExpenseSubCategory('');
        setExpenseUpdate(false);
        if (onCancel) onCancel();
    }

    const submitExpense = () => {
        if (loading) return;
        setLoading(true);
        const promise = expenseUpdate
            ? Expense.updateExpense(expenseId, (new DateUtil(expenseDate)).mySQLDate(), expenseReason, expenseCategory, expenseSubCategory, expenseDescription, expenseAmount, expensePayMode)
            : Expense.addExpense((new DateUtil(expenseDate)).mySQLDate(), expenseReason, expenseCategory, expenseSubCategory, expenseDescription, expenseAmount, expensePayMode);

        promise.then((res) => {
            setSnackbarMessage(res.data.msg)
            setOpenSnackbar(true)
            resetForm()
            setLoading(false)
            if (onSubmitSuccess) onSubmitSuccess();
        }).catch((err) => {
            setSnackbarMessage(err.response.data.msg)
            setOpenSnackbar(true)
            setLoading(false)
        });
    }

    const dateBackWard = () => {
        let date = new Date(expenseDate)
        date.setDate(date.getDate() - 1)
        handleDateChange(date)
    }

    const dateForward = () => {
        let date = new Date(expenseDate)
        date.setDate(date.getDate() + 1)
        handleDateChange(date)
    }

    const handleDateChange = (newDate) => {
        setExpenseDate(newDate);
        if (onDateChange) {
            onDateChange(newDate);
        }
    }

    React.useEffect(() => {
        getExpenseInitData()
    }, []);

    React.useEffect(() => {
        if (currentDate) {
            setExpenseDate(currentDate);
        }
    }, [currentDate]);

    React.useEffect(() => {
        if (initialData) {
            setExpenseId(initialData.id || null);
            setExpenseUpdate(!!initialData.id);
            if (initialData.date) {
                const newDate = new Date(initialData.date);
                setExpenseDate(newDate);
                if (onDateChange && (new DateUtil(newDate)).mySQLDate() !== (new DateUtil(expenseDate)).mySQLDate()) {
                    onDateChange(newDate);
                }
            }
            setExpenseReason(initialData.reason || '');
            if (!initialData.id && initialData.reason && !initialData.payMode) {
                Expense.fillable(initialData.reason)
                    .then((res) => {
                        let data = res.data.data;
                        if (data.payMode != null) {
                            setExpensePayMode(data.payMode.name);
                        }
                    }).catch(console.error);
            }

            console.log(`initialData :: ${initialData}`)

            setExpenseCategory(initialData.category || '');
            setExpenseSubCategory(initialData.subCategory || '');
            setExpenseDescription(initialData.description || '');
            setExpenseAmount(initialData.amount || '');
            setExpensePayMode(initialData.payMode || '');

            if (Object.keys(expenseSubCategoryData).length > 0 && initialData.category) {
                loadSubCategories(initialData.category);
            }
        } else {
            resetForm();
        }
    }, [initialData, expenseSubCategoryData]);

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton size="small" onClick={() => dateBackWard()}>
                    <ArrowBackIosIcon fontSize="small" />
                </IconButton>
                <Box sx={{ flex: 1, mx: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            label="Date"
                            inputFormat="DD/MM/YYYY"
                            onChange={(newValue) => handleDateChange(newValue.$d)}
                            renderInput={(params) => <TextField variant="outlined" size="small" fullWidth {...params} />}
                            value={expenseDate} />
                    </LocalizationProvider>
                </Box>
                <IconButton size="small" onClick={() => dateForward()}>
                    <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Autocomplete
                    value={expenseReason}
                    freeSolo
                    disableClearable
                    options={expenseReasons}
                    onChange={(e, v) => {
                        setExpenseReason(v)
                        console.log(`initialData :: ${initialData}`)
                        if(!initialData || !initialData.id) getExpenseFillable(v)
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Reason" size="small" fullWidth onInput={(e) => setExpenseReason(e.target.value)} />
                    )}
                />
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                    <Autocomplete
                        value={expenseCategory}
                        freeSolo
                        disableClearable
                        options={expenseCategories}
                        onChange={(e, v) => {
                            loadSubCategories(v)
                            setExpenseCategory(v)
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Category" size="small" fullWidth onInput={(e) => {
                                loadSubCategories(e.target.value)
                                setExpenseCategory(e.target.value);
                            }} />
                        )}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Autocomplete
                        value={expenseSubCategory}
                        freeSolo
                        disableClearable
                        options={expenseSubCategories}
                        onChange={(e, v) => setExpenseSubCategory(v)}
                        renderInput={(params) => (
                            <TextField {...params} label="Sub Category" size="small" fullWidth onInput={(e) => setExpenseSubCategory(e.target.value)} />
                        )}
                    />
                </Grid>
            </Grid>

            <Box sx={{ mb: 2 }}>
                <SmallOutlinedTextBox
                    label="Description"
                    value={expenseDescription}
                    onInput={(e) => setExpenseDescription(e.target.value)}
                    fullWidth
                />
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                    <SmallOutlinedTextBox
                        label="Amount"
                        value={expenseAmount}
                        onInput={(e) => setExpenseAmount(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <Autocomplete
                        value={expensePayMode}
                        freeSolo
                        disableClearable
                        options={expensePayModes}
                        onChange={(e, v) => setExpensePayMode(v)}
                        renderInput={(params) => (
                            <TextField {...params} label="Pay Mode" size="small" fullWidth onInput={(e) => setExpensePayMode(e.target.value)} />
                        )}
                    />
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button variant="text" onClick={resetForm} size="small">Reset</Button>
                <Box sx={{ position: 'relative', flex: 1 }}>
                    <LoadingButton
                        variant="contained"
                        disabled={loading}
                        onClick={submitExpense}
                        fullWidth
                        size="large"
                    >
                        {expenseUpdate ? "Save Expense" : "Add Expense"}
                    </LoadingButton>
                </Box>
            </Box>
        </Box>
    );
};
