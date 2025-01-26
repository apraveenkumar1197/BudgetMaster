import {
    Autocomplete,
    Button,
    CircularProgress,
    Grid, IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import {ExpenseList} from "./ExpenseList";
import React from "react";
import Expense from "../../repo/Expense";
import DateUtil from "../../functionalities/DateUtil";
import Box from "@mui/material/Box";
import {LoadingButton} from "../../ui/LoadingButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


export const AddExpense = (props) => {

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

    const [expenseList, setExpenseList] = React.useState([]);
    const [expenseListTotal, setExpenseListTotal] = React.useState('');

    const [loading, setLoading] = React.useState(false);

    const addExpense = () => {
        if (loading) return;

        setLoading(true);
        Expense.addExpense(expenseDate, expenseReason, expenseCategory, expenseSubCategory, expenseDescription, expenseAmount, expensePayMode)
            .then((res) => {
                getExpensesList()
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
    const editExpense = (expense) => {
        setExpenseId(expense.id)
        let selectedSubcategoriesData = expenseSubCategoryData[expense.category.name];
        setExpenseReason(expense.reason != null ? expense.reason.name : '');
        setExpenseCategory(expense.category != null ? expense.category.name : '');
        setExpenseSubCategory(expense.subCategory != null ? expense.subCategory.name : '');
        setExpensePayMode(expense.payMode != null ? expense.payMode.name : '');
        setExpenseDescription(expense.description != null ? expense.description : '');
        setExpenseAmount(expense.amount);
        setExpenseSubCategories(selectedSubcategoriesData == null ? [] : selectedSubcategoriesData);
        setExpenseUpdate(true);
    }
    const updateExpense = () => {
        if (loading) return;

        setLoading(true);
        Expense.updateExpense(expenseId, expenseDate, expenseReason, expenseCategory, expenseSubCategory, expenseDescription, expenseAmount, expensePayMode)
            .then((res) => {
                getExpensesList()
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

    const dateBackWard = () => {
        let date = expenseDate
        date.setDate(date.getDate() - 1)
        setExpenseDate(date)
        getExpensesList()
    }

    const dateForward = () => {
        let date = expenseDate
        date.setDate(date.getDate() + 1)
        setExpenseDate(date)
        getExpensesList()
    }

    const getExpenseInitData = () => {
        Expense.getExpenseInitData()
            .then((res) => {
                setExpenseReasons(res.data.data.reasons)
                setExpenseCategories(res.data.data.categories)
                setExpenseSubCategoryData(res.data.data.subCategories)
                setExpensePayModes(res.data.data.payModes)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
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
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const getExpensesList = () => {
        Expense.getExpenseList(new DateUtil(expenseDate).mySQLDate())
            .then((res) => {
                setExpenseList(res.data.data.list)
                setExpenseListTotal(res.data.data.total)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const deleteExpense = (id) => {
        Expense.deleteExpense(id)
            .then((res) => {
                getExpensesList()
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }


    const loadSubCategories = (category) => {
        let selectedSubCategories = expenseSubCategoryData[category];
        if (selectedSubCategories !== undefined) {
            setExpenseSubCategories(selectedSubCategories);
        } else {
            setExpenseSubCategories([]);
        }
    }
    const resetForm = () => {
        setExpenseId(null);
        setExpenseReason('');
        setExpenseCategory('');
        setExpenseDescription('');
        setExpenseAmount('');
        setExpensePayMode('');
        //setExpenseDate(new Date());
        setExpenseSubCategory([]);
        setExpenseUpdate(false);
    }

    React.useEffect(() => {
        getExpenseInitData()
    }, []);

    React.useEffect(() => {
        getExpensesList()
    }, [expenseDate]);

    return <Grid item xs={12} md={9}>
        <Grid
            container spacing={1}>
            <Grid item>
                <IconButton aria-label="delete" size="small" onClick={() => dateBackWard()}>
                    <ArrowBackIosIcon fontSize="inherit"/>
                </IconButton>
            </Grid>
            <Grid style={{padding: 10}} item md={2} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                        label="Date"
                        inputFormat="DD/MM/YYYY"
                        onChange={(newValue) => {
                            setExpenseDate(newValue.$d);
                        }}
                        renderInput={(params) =>
                            <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                {...params} />
                        }
                        value={expenseDate}/>
                </LocalizationProvider>
            </Grid>
        <Grid item>
            <IconButton aria-label="delete" size="small" onClick={() => dateForward()}>
                <ArrowForwardIosIcon fontSize="inherit"/>
            </IconButton>
        </Grid>
    </Grid>
    <Grid
        container spacing={0}>
        <Grid style={{padding: 10}} item xs={12} md={8}>
            <Autocomplete
                value={expenseReason}
                freeSolo
                id="expense_reason_autocomplete"
                disableClearable
                options={expenseReasons}
                onChange={(e, v) => {
                    setExpenseReason(v)
                    getExpenseFillable(v)
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        id="expense_reason"
                        label="Reason"
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        onInput={(e) => setExpenseReason(e.target.value)}/>
                )}
            />
        </Grid>
    </Grid>
    <Grid
        container spacing={0}>
        <Grid style={{padding: 10}} item xs={12} md={4}>
            <Autocomplete
                value={expenseCategory}
                freeSolo
                id="expense_category_autocomplete"
                disableClearable
                options={expenseCategories}
                onChange={(e, v) => {
                    loadSubCategories(v)
                    setExpenseCategory(v)
                }}
                sx={{width: 300}}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        id="expense_category"
                        label="Category"
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        onInput={(e) => {
                            var selectedCategory = e.target.value;
                            loadSubCategories(selectedCategory)
                            setExpenseCategory(selectedCategory);
                        }}/>
                )}
            />
        </Grid>
        <Grid style={{padding: 10}} item xs={12} md={4}>
            <Autocomplete
                value={expenseSubCategory}
                freeSolo
                id="expense_sub_category_autocomplete"
                disableClearable
                options={expenseSubCategories}
                onChange={(e, v) => setExpenseSubCategory(v)}
                sx={{width: 300}}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        id="expense_sub_category"
                        label="Sub Category"
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        onInput={(e) => setExpenseSubCategory(e.target.value)}/>
                )}
            />
        </Grid>
    </Grid>
    <Grid
        container spacing={0}>
        <Grid style={{padding: 10}} item xs={12} md={8}>
            <SmallOutlinedTextBox id="test-text-field" label="Description" value={expenseDescription}
                                  onInput={(e) => setExpenseDescription(e.target.value)}/>
        </Grid>
    </Grid>
    <Grid
        container spacing={0}>
        <Grid style={{padding: 10}} item xs={8} md={4}>
            <SmallOutlinedTextBox id="test-text-field" label="Amount" value={expenseAmount}
                                  onInput={(e) => setExpenseAmount(e.target.value)}/>
        </Grid>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item xs={12} md={4}>
                <Autocomplete
                    value={expensePayMode}
                    freeSolo
                    id="expense_pay_mode_autocomplete"
                    disableClearable
                    options={expensePayModes}
                    onChange={(e, v) => setExpensePayMode(v)}
                    sx={{width: 300}}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="expense_pay_mode"
                            label="Pay Mode"
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                            onInput={(e) => setExpensePayMode(e.target.value)}/>
                    )}
                />
            </Grid>
        </Grid>
    </Grid>
    <Grid
        container
        spacing={0}>
        <Grid item style={{padding: 10}}>
            <Box sx={{m: 1, position: 'relative'}}>
                <Button variant="contained">Reset</Button>
            </Box>
        </Grid>
        <Grid item style={{padding: 10}}>
            {
                expenseUpdate ?

                    <Box sx={{m: 1, position: 'relative'}}>
                        <Button variant="contained" disabled={loading} onClick={updateExpense}>Save Expense</Button>
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
                    /*<Box sx={{ m: 1, position: 'relative' }}>
                        <Button variant="contained" disabled={loading} onClick={addExpense}>Add Expense</Button>
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
                    </Box>*/
                    <LoadingButton variant="contained" disabled={loading} onClick={addExpense}>Add
                        Expense</LoadingButton>
            }
        </Grid>
    </Grid>
    <ExpenseList editExpense={editExpense} deleteExpense={deleteExpense} expenseListTotal={expenseListTotal}
                 expenseList={expenseList}/>
</Grid>
}