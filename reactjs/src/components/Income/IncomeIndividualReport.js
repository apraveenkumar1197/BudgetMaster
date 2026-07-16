import {
    Autocomplete,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import React from "react";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import Income from "../../repo/Income";
import Util from "../../functionalities/Util";
import UtilRepo from "../../repo/Util";
import DateUtil from "../../functionalities/DateUtil";

export const IncomeIndividualReport = (props) => {
    const formatter = Util.numberFormatter()

    const [incomeReportReasons, setIncomeReportReasons] = React.useState([]);
    const [incomeReportCategories, setIncomeReportCategories] = React.useState([]);
    const [incomeReportSubCategories, setIncomeReportSubCategories] = React.useState([]);
    const [incomeReportPayModes, setIncomeReportPayModes] = React.useState([]);

    const [incomeList, setIncomeList] = React.useState([]);
    const [incomeListTotal, setIncomeListTotal] = React.useState(0);
    const [fromDate, setFromDate] = React.useState(new DateUtil().monthBeginning());
    const [toDate, setToDate] = React.useState(new Date());
    const [reason, setReason] = React.useState(null);
    const [category, setCategory] = React.useState(null);
    const [subCategory, setSubCategory] = React.useState(null);
    const [payMode, setPayMode] = React.useState(null);


    const getIncomeIndividualReport = () => {
        Income.getIncomeIndividualReport(new DateUtil(fromDate).mySQLDate(), new DateUtil(toDate).mySQLDate(), reason, category, subCategory, payMode)
            .then((res) => {
                setIncomeList(res.data.data.list.list);
                setIncomeListTotal(res.data.data.total)
                let initData = res.data.data.init;
                setIncomeReportReasons(initData.reasons);
                setIncomeReportCategories(initData.categories);
                setIncomeReportPayModes(initData.payModes);
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    const getSubcategoriesByCategoryId = () => {
        if(category == null) return;
        UtilRepo.getSubcategoriesByCategoryId('income', category.id, Util.mySQLDate(fromDate), Util.mySQLDate(toDate))
            .then((res) => {
                setIncomeReportSubCategories(res.data.data);
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    React.useEffect(() => {
        getIncomeIndividualReport()
    }, [fromDate, toDate, reason, category, subCategory, payMode]);

    return <Grid
        container spacing={0}>
        <Grid style={{padding: 10}} item md={3} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                    label="Date"
                    inputFormat="DD/MM/YYYY"
                    onChange={(newValue) => {setFromDate(newValue.$d);}}
                    renderInput={(params) =>
                        <TextField
                            variant="outlined"
                            size="small"
                            fullWidth
                            {...params} />
                    }
                    value={fromDate}/>
            </LocalizationProvider>
        </Grid>
        <Grid style={{padding: 10}} item md={3} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                    label="Date"
                    inputFormat="DD/MM/YYYY"
                    onChange={(newValue) => {setToDate(newValue.$d);}}
                    renderInput={(params) =>
                        <TextField
                            variant="outlined"
                            size="small"
                            fullWidth
                            {...params} />
                    }
                    value={toDate}/>
            </LocalizationProvider>
        </Grid>
        <Grid style={{padding: 10}} item md={3} xs={12}>
            <Autocomplete
                value={reason}
                freeSolo
                id="reason_autocomplete"
                disableClearable
                options={incomeReportReasons}
                getOptionLabel={(option) => option.reason}
                onChange={(e, v) => {setReason(v);}}
                sx={{width: {xs: '100%', sm: 300}}}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        id="reason"
                        label="Reason"
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        onInput={(e) => {setReason(e.nativeEvent.value)}}
                    />
                )}
            />
        </Grid>
        <Grid style={{padding: 10}} item md={3} xs={12}>
            <Autocomplete
                value={category}
                freeSolo
                id="category_autocomplete"
                disableClearable
                options={incomeReportCategories}
                onChange={(e, v) => {setCategory(v); getSubcategoriesByCategoryId();}}
                getOptionLabel={(option) => option.category}
                sx={{width: {xs: '100%', sm: 300}}}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        id="category"
                        label="Category"
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        onInput={(e) => {setCategory(e.nativeEvent.value)}}
                    />
                )}
            />
        </Grid>
        <Grid style={{padding: 10}} item md={3} xs={12}>
            <Autocomplete
                value={subCategory}
                freeSolo
                id="sub_category_autocomplete"
                disableClearable
                options={incomeReportSubCategories}
                onChange={(e, v) => {
                    setSubCategory(v)
                }}
                getOptionLabel={(option) => option.name}
                sx={{width: {xs: '100%', sm: 300}}}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        id="sub_category"
                        label="Sub Category"
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        onInput={(e) => {setSubCategory(e.nativeEvent.value)}}
                    />
                )}
            />
        </Grid>
        <Grid style={{padding: 10}} item md={3} xs={12}>
            <Autocomplete
                value={payMode}
                freeSolo
                id="pay_mode_autocomplete"
                disableClearable
                options={incomeReportPayModes}
                onChange={(e, v) => {setPayMode(v)}}
                getOptionLabel={(option) => option.pay_mode}
                sx={{width: {xs: '100%', sm: 300}}}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        id="pay_mode"
                        label="Pay mode"
                        size="small"
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                        }}
                        onInput={(e) => {setPayMode(e.nativeEvent.value)}}
                    />
                )}
            />
        </Grid>
        <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ minWidth: 0, maxHeight: { xs: '60vh', md: '65vh' } }}>
                <Table size="small" stickyHeader>
                    <TableHead sx={{backgroundColor: 'primary.main'}}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', backgroundColor: 'primary.main' }}>S.No</TableCell>
                            <TableCell sx={{ color: 'white', backgroundColor: 'primary.main' }}>Reason</TableCell>
                            <TableCell sx={{ color: 'white', backgroundColor: 'primary.main' }}>Date</TableCell>
                            <TableCell sx={{ color: 'white', backgroundColor: 'primary.main' }}>Category</TableCell>
                            <TableCell sx={{ color: 'white', backgroundColor: 'primary.main' }}>Sub category</TableCell>
                            <TableCell sx={{ color: 'white', backgroundColor: 'primary.main' }}>Amount</TableCell>
                            <TableCell sx={{ color: 'white', backgroundColor: 'primary.main' }}>Pay mode</TableCell>
                            <TableCell sx={{ color: 'white', backgroundColor: 'primary.main' }}>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell><b>{formatter.format(incomeListTotal)} ({incomeList.length})</b></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        {incomeList.map((income, i) => (
                            <TableRow key={'income-report-' + i}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{income.reason.name}</TableCell>
                                <TableCell>{income.date}</TableCell>
                                <TableCell>{income.category == null ? '' : income.category.name}</TableCell>
                                <TableCell>{income.subCategory == null ? '' :  income.subCategory.name}</TableCell>
                                <TableCell>{formatter.format(income.amount)}</TableCell>
                                <TableCell>{income.payMode.name}</TableCell>
                                <TableCell>{income.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Grid>
    </Grid>
}