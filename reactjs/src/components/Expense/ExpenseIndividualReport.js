import {
    Autocomplete,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PieChartIcon from "@mui/icons-material/PieChart";
import React from "react";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import Expense from "../../repo/Expense";
import Util from "../../functionalities/Util";
import UtilRepo from "../../repo/Util";
import DateUtil from "../../functionalities/DateUtil";
import {PieChart} from "@mui/x-charts";

export const ExpenseIndividualReport = (props) => {
    const formatter = Util.numberFormatter()

    const [expenseReportReasons, setExpenseReportReasons] = React.useState([]);
    const [expenseReportCategories, setExpenseReportCategories] = React.useState([]);
    const [expenseReportSubCategories, setExpenseReportSubCategories] = React.useState([]);
    const [expenseReportPayModes, setExpenseReportPayModes] = React.useState([]);

    const [expenseList, setExpenseList] = React.useState([]);
    const [chartCategoryList, setChartCategoryList] = React.useState([]);
    const [expenseListTotal, setExpenseListTotal] = React.useState(0);
    const [fromDate, setFromDate] = React.useState(new DateUtil().monthBeginning());
    const [toDate, setToDate] = React.useState(new Date());
    const [reason, setReason] = React.useState(null);
    const [category, setCategory] = React.useState(null);
    const [subCategory, setSubCategory] = React.useState(null);
    const [payMode, setPayMode] = React.useState(null);
    const [pieChartOpen, setPieChartOpen] = React.useState(false);
    const [pieChartReady, setPieChartReady] = React.useState(false);


    const getExpenseIndividualReport = () => {
        Expense.getExpenseIndividualReport(new DateUtil(fromDate).mySQLDate(), new DateUtil(toDate).mySQLDate(), reason, category, subCategory, payMode)
            .then((res) => {
                let responseExpenseList = res.data.data.list.list
                setExpenseList(responseExpenseList);
                setExpenseListTotal(res.data.data.list.total)
                let initData = res.data.data.init;
                setExpenseReportReasons(initData.reasons);
                setExpenseReportCategories(initData.categories);
                setExpenseReportPayModes(initData.payModes);

                const grouped = responseExpenseList.reduce((acc, expense) => {
                    if (!acc[expense.category.name]) {
                        acc[expense.category.name] = 0;
                    }
                    acc[expense.category.name] += expense.amount;
                    return acc;
                }, {});

                let chartData = []
                Object.entries(grouped).forEach(([category, amount], index) => {
                    chartData.push({id: index, value: amount, label: category},)
                });
                setChartCategoryList(chartData);


            }).catch((err) => {
            console.log(err)
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }


    const getSubcategoriesByCategoryId = (categorySelected) => {
        console.log(categorySelected);
        UtilRepo.getSubcategoriesByCategoryId('expense', categorySelected.id, (new DateUtil(fromDate)).mySQLDate(), (new DateUtil(toDate)).mySQLDate())
            .then((res) => {
                setExpenseReportSubCategories(res.data.data);
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    React.useEffect(() => {
        getExpenseIndividualReport()
    }, [fromDate, toDate, reason, category, subCategory, payMode]);

    return <>
    <Grid
        container spacing={0}>
        <Grid
            container spacing={0}>
            <Grid style={{padding: 10}} item md={3} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                        label="Date"
                        inputFormat="DD/MM/YYYY"
                        onChange={(newValue) => {
                            setFromDate(newValue.$d);
                        }}
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
                        onChange={(newValue) => {
                            setToDate(newValue.$d);
                        }}
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
                    options={expenseReportReasons}
                    getOptionLabel={(option) => option.reason}
                    onChange={(e, v) => {
                        setReason(v);
                    }}
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
                            onInput={(e) => {
                                console.log(e);
                                setReason(e.nativeEvent.value)
                            }}
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
                    options={expenseReportCategories}
                    onChange={(e, v) => {
                        setCategory(v);
                        getSubcategoriesByCategoryId(v);
                    }}
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
                            onInput={(e) => {
                                setCategory(e.nativeEvent.value)
                            }}
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
                    options={expenseReportSubCategories}
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
                            onInput={(e) => {
                                setSubCategory(e.nativeEvent.value)
                            }}
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
                    options={expenseReportPayModes}
                    onChange={(e, v) => {
                        setPayMode(v)
                    }}
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
                            onInput={(e) => {
                                setPayMode(e.nativeEvent.value)
                            }}
                        />
                    )}
                />
            </Grid>
            <Grid container>
                <Grid style={{padding: 10}} item xs={12}>
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
                                    <TableCell><b>{formatter.format(expenseListTotal)} ({expenseList.length})</b></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                {expenseList.map((expense, i) => (
                                    <TableRow key={'expense-report-' + i}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{expense.reason.name}</TableCell>
                                        <TableCell>{expense.date}</TableCell>
                                        <TableCell>{expense.category == null ? '' : expense.category.name}</TableCell>
                                        <TableCell>{expense.subCategory == null ? '' : expense.subCategory.name}</TableCell>
                                        <TableCell>{formatter.format(expense.amount)}</TableCell>
                                        <TableCell>{expense.payMode.name}</TableCell>
                                        <TableCell>{expense.description}</TableCell>
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
        </Grid>
    </Grid>

    <Tooltip title="View category breakdown">
        <Fab
            color="primary"
            aria-label="pie chart"
            onClick={() => setPieChartOpen(true)}
            sx={{ position: 'fixed', bottom: 24, right: 24 }}>
            <PieChartIcon />
        </Fab>
    </Tooltip>

    <Dialog
        open={pieChartOpen}
        onClose={() => setPieChartOpen(false)}
        maxWidth="xs"
        fullWidth
        TransitionProps={{
            onEntered: () => setPieChartReady(true),
            onExited: () => setPieChartReady(false),
        }}>
        <DialogTitle>
            Category breakdown
            <IconButton
                aria-label="close"
                onClick={() => setPieChartOpen(false)}
                sx={{ position: 'absolute', right: 8, top: 8 }}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
            {pieChartReady && (
                <PieChart
                    series={[
                        {
                            data: chartCategoryList,
                            labelPosition: 'outside',
                            labelLine: true,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                        },
                    ]}
                    height={300}
                />
            )}
        </DialogContent>
    </Dialog>
    </>
}