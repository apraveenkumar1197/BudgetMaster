import {
    Autocomplete,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import { DatePicker, LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SmallOutlinedTextBox } from "../../ui/SmallOutlinedTextBox";
import { LoadingButton } from "../../ui/LoadingButton";
import { DueList } from "./DueList";
import React from "react";
import DuesReturns from "../../repo/DuesReturns";
import Util from "../../functionalities/Util";
import Expense from "../../repo/Expense";
import DateUtil from "../../functionalities/DateUtil";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


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

    const [dueIsRecursive, setDueIsRecursive] = React.useState(false);
    const [dueRecursiveFrequency, setDueRecursiveFrequency] = React.useState(null);
    const [dueRecursiveTill, setDueRecursiveTill] = React.useState(null);

    const [dueList, setDueList] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [listLoading, setListLoading] = React.useState(false);

    const addDue = () => {
        if (loading) return;
        setLoading(true);
        DuesReturns.addDues(dueDate, dueReason, dueCategory, dueSubCategory, dueAmount, dueIsRecursive, dueRecursiveFrequency, (new DateUtil(dueRecursiveTill)).mySQLDate())
            .then((res) => {
                getDuesList()
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)
                resetForm();
                setLoading(false);
            }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
                setLoading(false);
            });
    }

    const loadSubCategories = (category) => {
        let selectedSubCategories = dueSubCategoryData[category];
        if (selectedSubCategories !== undefined) {
            setDueSubCategories(selectedSubCategories);
        } else {
            setDueSubCategories([]);
        }
    }

    const getDueFillable = (reason) => {
        Expense.fillable(reason)
            .then((res) => {
                let data = res.data.data

                setDueCategory(data.category != null ? data.category.name : '')
                setDueSubCategory(data.subCategory != null ? data.subCategory.name : '')

                loadSubCategories(data.category != null ? data.category.name : '')

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
        setListLoading(true);
        DuesReturns.getDues(new DateUtil().mySQLMonth())
            .then((res) => {
                setDueList(res.data.data)
                setListLoading(false);
            }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
                setListLoading(false);
            });
    }
    const deleteDue = (id) => {
        return DuesReturns.deleteDues(id).then((res) => {
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
        setDueIsRecursive(false);
        setDueRecursiveFrequency(null);
        setDueRecursiveTill(null);
    }

    React.useEffect(() => {
        getDueInitData()
        getDuesList()
    }, []);

    return <Grid container spacing={2} sx={{ p: 2, height: { xs: 'auto', md: 'calc(100vh - 100px)' }, overflow: 'hidden' }}>
        {/* Left Column - Form */}
        <Grid item xs={12} md={4} sx={{ height: { xs: 'auto', md: '100%' }, overflow: 'auto' }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                    Add Due
                </Typography>

                {/* Date Picker */}
                <Box sx={{ mb: 2 }}>
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
                            value={dueDate} />
                    </LocalizationProvider>
                </Box>

                {/* Reason */}
                <Box sx={{ mb: 2 }}>
                    <Autocomplete
                        value={dueReason}
                        freeSolo
                        id="due_reason_autocomplete"
                        disableClearable
                        options={dueReasons}
                        onChange={(e, v) => {
                            setDueReason(v)
                            getDueFillable(v)
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                id="due_reason"
                                label="Reason"
                                size="small"
                                fullWidth
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                }}
                                onInput={(e) => setDueReason(e.target.value)} />
                        )}
                    />
                </Box>

                {/* Category and Sub Category */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            value={dueCategory}
                            freeSolo
                            id="due_category_autocomplete"
                            disableClearable
                            options={dueCategories}
                            onChange={(e, v) => {
                                loadSubCategories(v)
                                setDueCategory(v)
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id="due_category"
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
                                        setDueCategory(selectedCategory);
                                    }} />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            value={dueSubCategory}
                            freeSolo
                            id="due_sub_category_autocomplete"
                            disableClearable
                            options={dueSubCategories}
                            onChange={(e, v) => setDueSubCategory(v)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id="due_sub_category"
                                    label="Sub Category"
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                    }}
                                    onInput={(e) => setDueSubCategory(e.target.value)} />
                            )}
                        />
                    </Grid>
                </Grid>

                {/* Amount */}
                <Box sx={{ mb: 2 }}>
                    <SmallOutlinedTextBox
                        id="test-text-field"
                        label="Amount"
                        value={dueAmount}
                        onInput={(e) => setDueAmount(e.target.value)}
                        fullWidth
                    />
                </Box>

                {/* Recursive Toggle */}
                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={<Switch checked={dueIsRecursive}
                            onChange={(e) => setDueIsRecursive(e.target.checked)} />}
                        label="Recursive" />
                </Box>

                {/* Recursive Options */}
                {dueIsRecursive && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="due_frequency_select">Frequency</InputLabel>
                                <Select
                                    labelId="due_frequency_select"
                                    label="Frequency"
                                    value={dueRecursiveFrequency}
                                    onChange={(e) => setDueRecursiveFrequency(e.target.value)}>
                                    <MenuItem disabled={true} selected={true}>Select Frequency</MenuItem>
                                    <MenuItem value={1}>Every month</MenuItem>
                                    <MenuItem value={2}>2 Months</MenuItem>
                                    <MenuItem value={3}>3 Months</MenuItem>
                                    <MenuItem value={4}>4 Months</MenuItem>
                                    <MenuItem value={6}>6 Months</MenuItem>
                                    <MenuItem value={8}>8 Months</MenuItem>
                                    <MenuItem value={12}>Every Year</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDatePicker
                                    label="Till Month & year"
                                    inputFormat="MM/YYYY"
                                    onChange={(newValue) => {
                                        setDueRecursiveTill(newValue.$d);
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            {...params} />
                                    }
                                    value={dueRecursiveTill} />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                )}

                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button variant="text" onClick={resetForm} size="small">Reset</Button>
                    <LoadingButton variant="contained" onClick={addDue} disabled={loading} size="large" sx={{ flex: 1 }}>Add Due</LoadingButton>
                </Box>
            </Paper>
        </Grid>

        {/* Right Column - Due List */}
        <Grid item xs={12} md={8} sx={{ height: { xs: 'auto', md: '100%' }, display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                    Due List
                </Typography>
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <DueList deleteDue={deleteDue} dueList={dueList} listLoading={listLoading} />
                </Box>
            </Paper>
        </Grid>
    </Grid>
}