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
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SmallOutlinedTextBox } from "../../ui/SmallOutlinedTextBox";
import { LoadingButton } from "../../ui/LoadingButton";
import { ReturnsList } from "./ReturnsList";
import React from "react";
import DuesReturns from "../../repo/DuesReturns";
import Util from "../../functionalities/Util";
import Expense from "../../repo/Expense";
import DateUtil from "../../functionalities/DateUtil";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Income from "../../repo/Income";


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

    const [returnsIsRecursive, setReturnsIsRecursive] = React.useState(false);
    const [returnsRecursiveFrequency, setReturnsRecursiveFrequency] = React.useState(null);
    const [returnsRecursiveTill, setReturnsRecursiveTill] = React.useState(null);

    const [returnsList, setReturnsList] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [listLoading, setListLoading] = React.useState(false);

    const addReturns = () => {
        if (loading) return;
        setLoading(true);
        DuesReturns.addReturns(returnsDate, returnsReason, returnsCategory, returnsSubCategory, returnsAmount, returnsIsRecursive, returnsRecursiveFrequency, (new DateUtil(returnsRecursiveTill)).mySQLDate())
            .then((res) => {
                getReturnsList()
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
        let selectedSubCategories = returnsSubCategoryData[category];
        if (selectedSubCategories !== undefined) {
            setReturnsSubCategories(selectedSubCategories);
        } else {
            setReturnsSubCategories([]);
        }
    }

    const getReturnsFillable = (reason) => {
        Income.fillable(reason)
            .then((res) => {
                let data = res.data.data

                setReturnsCategory(data.category != null ? data.category.name : '')
                setReturnsSubCategory(data.subCategory != null ? data.subCategory.name : '')

                loadSubCategories(data.category != null ? data.category.name : '')

            }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
            });
    }
    const getReturnsInitData = () => {
        Income.getIncomeInitData()
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
        setListLoading(true);
        DuesReturns.getReturns(new DateUtil().mySQLMonth())
            .then((res) => {
                setReturnsList(res.data.data)
                setListLoading(false);
            }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
                setListLoading(false);
            });
    }

    const deleteReturns = (id) => {
        return DuesReturns.deleteReturns(id).then((res) => {
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

        setReturnsIsRecursive(false);
        setReturnsRecursiveFrequency(null);
        setReturnsRecursiveTill(null);
    }

    React.useEffect(() => {
        getReturnsInitData()
        getReturnsList()
    }, []);

    return <Grid container spacing={2} sx={{ p: 2, height: { xs: 'auto', md: 'calc(100vh - 100px)' }, overflow: 'hidden' }}>
        {/* Left Column - Form */}
        <Grid item xs={12} md={4} sx={{ height: { xs: 'auto', md: '100%' }, overflow: 'auto' }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                    Add Returns
                </Typography>

                {/* Date Picker */}
                <Box sx={{ mb: 2 }}>
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
                            value={returnsDate} />
                    </LocalizationProvider>
                </Box>

                {/* Reason */}
                <Box sx={{ mb: 2 }}>
                    <Autocomplete
                        value={returnsReason}
                        freeSolo
                        id="returns_reason_autocomplete"
                        disableClearable
                        options={returnsReasons}
                        onChange={(e, v) => {
                            setReturnsReason(v)
                            getReturnsFillable(v)
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                id="returns_reason"
                                label="Reason"
                                size="small"
                                fullWidth
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                }}
                                onInput={(e) => setReturnsReason(e.target.value)} />
                        )}
                    />
                </Box>

                {/* Category and Sub Category */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            value={returnsCategory}
                            freeSolo
                            id="returns_category_autocomplete"
                            disableClearable
                            options={returnsCategories}
                            onChange={(e, v) => {
                                loadSubCategories(v)
                                setReturnsCategory(v)
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id="returns_category"
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
                                        setReturnsCategory(selectedCategory);
                                    }} />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            value={returnsSubCategory}
                            freeSolo
                            id="returns_sub_category_autocomplete"
                            disableClearable
                            options={returnsSubCategories}
                            onChange={(e, v) => setReturnsSubCategory(v)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id="returns_sub_category"
                                    label="Sub Category"
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                    }}
                                    onInput={(e) => setReturnsSubCategory(e.target.value)} />
                            )}
                        />
                    </Grid>
                </Grid>

                {/* Amount */}
                <Box sx={{ mb: 2 }}>
                    <SmallOutlinedTextBox
                        id="test-text-field"
                        label="Amount"
                        value={returnsAmount}
                        onInput={(e) => setReturnsAmount(e.target.value)}
                        fullWidth
                    />
                </Box>

                {/* Recursive Toggle */}
                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={<Switch checked={returnsIsRecursive} onChange={(e) => setReturnsIsRecursive(e.target.checked)} />}
                        label="Recursive" />
                </Box>

                {/* Recursive Options */}
                {returnsIsRecursive && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="due_frequency_select">Frequency</InputLabel>
                                <Select
                                    labelId="due_frequency_select"
                                    label="Frequency"
                                    value={returnsRecursiveFrequency}
                                    onChange={(e) => setReturnsRecursiveFrequency(e.target.value)}>
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
                                        setReturnsRecursiveTill(newValue.$d);
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            {...params} />
                                    }
                                    value={returnsRecursiveTill} />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                )}

                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button variant="text" onClick={resetForm} size="small">Reset</Button>
                    <LoadingButton variant="contained" onClick={addReturns} disabled={loading} size="large" sx={{ flex: 1 }}>Add Returns</LoadingButton>
                </Box>
            </Paper>
        </Grid>

        {/* Right Column - Returns List */}
        <Grid item xs={12} md={8} sx={{ height: { xs: 'auto', md: '100%' }, display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                    Returns List
                </Typography>
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <ReturnsList deleteReturns={deleteReturns} returnsList={returnsList} listLoading={listLoading} />
                </Box>
            </Paper>
        </Grid>
    </Grid>
}