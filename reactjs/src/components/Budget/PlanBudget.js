import React from "react";
import Tally from "../../repo/Tally";
import Util from "../../functionalities/Util";
import {
    Autocomplete,
    Button,
    CircularProgress,
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
    Typography
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Budget from "../../repo/Budget";
import { SmallOutlinedTextBox } from "../../ui/SmallOutlinedTextBox";
import DateUtil from "../../functionalities/DateUtil";
import Expense from "../../repo/Expense";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import { LoadingButton } from "../../ui/LoadingButton";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { DueList } from "../DuesReturns/DueList";
import DuesReturns from "../../repo/DuesReturns";
import { PageLoader } from "../../ui/PageLoader";
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { ExpenseForm } from "../Expense/ExpenseForm";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, backgroundColor) => {
    const isBlink = backgroundColor === 'blink';
    return {
        userSelect: "none",
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,

        background: isBlink ? "#f39e9e" : backgroundColor,
        animation: isBlink ? "blink-red 1s infinite" : "none",
        color: isBlink ? "white" : "inherit",

        ...draggableStyle
    };
};

export const PlanBudget = (props) => {
    const formatter = Util.numberFormatter()

    const [budgetUpdate, setBudgetUpdate] = React.useState(false);
    const [budgetId, setBudgetId] = React.useState(null);
    const [budgetReasons, setBudgetReasons] = React.useState([]);
    const [budgetCategories, setBudgetCategories] = React.useState([]);
    const [budgetSubCategories, setBudgetSubCategories] = React.useState([]);
    const [budgetSubCategoryData, setBudgetSubCategoryData] = React.useState([]);
    const [budgetListCategoryWise, setBudgetListCategoryWise] = React.useState([]);

    const [budgetTotalAmount, setBudgetTotalAmount] = React.useState('');
    const [budgetDate, setBudgetDate] = React.useState(new Date());
    const [budgetReason, setBudgetReason] = React.useState('');
    const [budgetCategory, setBudgetCategory] = React.useState('');
    const [budgetSubCategory, setBudgetSubCategory] = React.useState('');
    const [budgetAmount, setBudgetAmount] = React.useState('');

    const [individualFlag, setIndividualFlag] = React.useState('Y');
    const [singleEntryTableView, setSingleEntryTableView] = React.useState(false);
    const [dueList, setDueList] = React.useState([]);
    const [showSaveReOrder, setShowSaveReOrder] = React.useState(false);

    const [openExpenseDialog, setOpenExpenseDialog] = React.useState(false);
    const [selectedBudgetForExpense, setSelectedBudgetForExpense] = React.useState(null);

    const [loading, setLoading] = React.useState(false);
    const [budgetListLoading, setBudgetListLoading] = React.useState(false);
    const [duesListLoading, setDuesListLoading] = React.useState(false);

    const getBudgetInitData = () => {
        Budget.initData()
            .then((res) => {
                setBudgetReasons(res.data.data.reasons)
                setBudgetCategories(res.data.data.categories)
                setBudgetSubCategoryData(res.data.data.subCategories)
            }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
            });
    }
    const addBudgetEntry = () => {
        if (loading) return;

        setLoading(true);
        Budget.add(new DateUtil(budgetDate).mySQLMonth(), budgetReason, budgetCategory, budgetSubCategory, budgetAmount).then((res) => {
            getBudgetList()
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
    const getBudgetList = () => {
        setBudgetListLoading(true);
        Budget.list(new DateUtil(budgetDate).mySQLMonth(), individualFlag).then((res) => {
            setBudgetListCategoryWise(res.data.data.list)
            setBudgetTotalAmount(res.data.data.totalAmount);
            setBudgetListLoading(false);
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
            setBudgetListLoading(false);
        });
    }
    const getExpenseFillable = (reason) => {
        Expense.fillable(reason)
            .then((res) => {
                let data = res.data.data

                setBudgetCategory(data.category != null ? data.category.name : '')
                setBudgetSubCategory(data.subCategory != null ? data.subCategory.name : '')

                loadSubCategories(data.category != null ? data.category.name : '')

            }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
            });
    }
    const getDuesList = () => {
        setDuesListLoading(true);
        DuesReturns.getMonthDues(new DateUtil(budgetDate).mySQLMonth())
            .then((res) => {
                setDueList(res.data.data)
                setDuesListLoading(false);
            }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
                setDuesListLoading(false);
            });
    }

    const editBudgetEntry = (budget) => {
        setBudgetId(budget.id)
        let selectedSubcategoriesData = budgetSubCategoryData[budget.category.name];
        setBudgetReason(budget.reason != null ? budget.reason.name : '');
        setBudgetCategory(budget.category != null ? budget.category.name : '');
        setBudgetSubCategory(budget.subCategory != null ? budget.subCategory.name : '');
        setBudgetAmount(budget.amount);
        setBudgetSubCategories(selectedSubcategoriesData == null ? [] : selectedSubcategoriesData);
        setBudgetUpdate(true);
    }

    const updateBudgetEntry = () => {
        if (loading) return;

        setLoading(true);
        Budget.update(budgetId, new DateUtil(budgetDate).mySQLMonth(), budgetReason, budgetCategory, budgetSubCategory, budgetAmount)
            .then((res) => {
                getBudgetList()
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

    const saveOrder = () => {
        if (loading) return;

        setLoading(true);
        Budget.reOrder(new DateUtil(budgetDate).mySQLMonth(), budgetListCategoryWise)
            .then((res) => {
                getBudgetList()
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)
                resetForm();
                setLoading(false)
                setShowSaveReOrder(false)
            }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
                setLoading(false)
            });
    }

    const copyPreviousMonthData = () => {
        if (loading) return;

        setLoading(true);
        Budget.copy(new DateUtil(budgetDate).mySQLMonth())
            .then((res) => {
                getBudgetList()
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

    const deleteBudgetEntry = (id) => {
        Budget.delete(id).then((res) => {
            getBudgetList()
            props.setSnackbarMessage(res.data.msg)
            props.setOpenSnackbar(true)
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }

    const loadSubCategories = (category) => {
        let selectedSubCategories = budgetSubCategoryData[category];
        if (selectedSubCategories !== undefined) {
            setBudgetSubCategories(selectedSubCategories);
        } else {
            setBudgetSubCategories([]);
        }
    }

    const resetForm = () => {
        setBudgetReason('');
        setBudgetCategory('');
        setBudgetSubCategory('');
        setBudgetAmount('');

        setBudgetId(null)
        setBudgetUpdate(false);
    }

    const openConvertDialog = (budget) => {
        setSelectedBudgetForExpense({
            reason: budget.reason != null ? budget.reason.name : '',
            category: budget.category != null ? budget.category.name : '',
            subCategory: budget.subCategory != null ? budget.subCategory.name : '',
            amount: budget.amount,
            date: new DateUtil(budgetDate).mySQLMonth() + "-01" // Default to 1st of the month
        });
        setOpenExpenseDialog(true);
    }

    const onDragEnd = (result) => {
        console.log(result)
        if (!result.destination) {
            return;
        }

        const reOrderedItems = reorder(
            budgetListCategoryWise,
            result.source.index,
            result.destination.index
        );

        setBudgetListCategoryWise(reOrderedItems);
        setShowSaveReOrder(true)
    }

    React.useEffect(() => {
        getBudgetInitData()
        getBudgetList()
    }, []);

    React.useEffect(() => {
        setBudgetListCategoryWise([])
        setSingleEntryTableView(individualFlag === 'Y')
        getBudgetList()
        getDuesList()
    }, [budgetDate, individualFlag]);

    console.log(individualFlag);
    return <Grid container spacing={2} sx={{ p: 2, height: { xs: 'auto', md: 'calc(100vh - 100px)' }, overflow: 'hidden' }}>
        {/* Left Column - Form */}
        <Grid item xs={12} md={2} sx={{ height: { xs: 'auto', md: '100%' }, overflow: 'auto' }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                    Plan Budget
                </Typography>

                {/* Date Picker */}
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <IconButton size="small" onClick={() => {
                        let date = new Date(budgetDate);
                        date.setMonth(date.getMonth() - 1);
                        setBudgetDate(date);
                    }}>
                        <ArrowBackIosIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ flex: 1, mx: 1 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                                label="Date"
                                inputFormat="MM/YYYY"
                                onChange={(newValue) => {
                                    setBudgetDate(newValue.$d);
                                }}
                                renderInput={(params) => <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    {...params} />}
                                value={budgetDate} />
                        </LocalizationProvider>
                    </Box>
                    <IconButton size="small" onClick={() => {
                        let date = new Date(budgetDate);
                        date.setMonth(date.getMonth() + 1);
                        setBudgetDate(date);
                    }}>
                        <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Reason */}
                <Box sx={{ mb: 2 }}>
                    <Autocomplete
                        value={budgetReason}
                        freeSolo
                        id="budget_reason_autocomplete"
                        disableClearable
                        options={budgetReasons}
                        onChange={(e, v) => {
                            getExpenseFillable(v)
                            setBudgetReason(v)
                        }}
                        renderInput={(params) => (<TextField
                            {...params}
                            id="budget_reason"
                            label="Reason"
                            size="small"
                            fullWidth
                            InputProps={{
                                ...params.InputProps, type: 'search',
                            }}
                            onInput={(e) => {
                                setBudgetReason(e.target.value)
                            }} />)}
                    />
                </Box>

                {/* Category */}
                <Box sx={{ mb: 2 }}>
                    <Autocomplete
                        value={budgetCategory}
                        freeSolo
                        id="budget_category_autocomplete"
                        disableClearable
                        options={budgetCategories}
                        onChange={(e, v) => {
                            let selectedSubCategories = budgetSubCategoryData[v];
                            if (selectedSubCategories !== undefined) {
                                setBudgetSubCategories(selectedSubCategories);
                            } else {
                                setBudgetSubCategories([]);
                            }
                            setBudgetCategory(v)
                        }}
                        renderInput={(params) => (<TextField
                            {...params}
                            id="budget_category"
                            label="Category"
                            size="small"
                            fullWidth
                            InputProps={{
                                ...params.InputProps, type: 'search',
                            }}
                            onInput={(e) => {
                                var selectedCategory = e.target.value;
                                let selectedSubCategories1 = budgetSubCategoryData[selectedCategory];
                                if (selectedSubCategories1 !== undefined) {
                                    setBudgetSubCategories(selectedSubCategories1);
                                } else {
                                    setBudgetSubCategories([]);
                                }
                                setBudgetCategory(selectedCategory);
                            }} />)}
                    />
                </Box>

                {/* Sub Category */}
                <Box sx={{ mb: 2 }}>
                    <Autocomplete
                        value={budgetSubCategory}
                        freeSolo
                        id="budget_sub_category_autocomplete"
                        disableClearable
                        options={budgetSubCategories}
                        onChange={(e, v) => setBudgetSubCategory(v)}
                        renderInput={(params) => (<TextField
                            {...params}
                            id="budget_sub_category"
                            label="Sub Category"
                            size="small"
                            fullWidth
                            InputProps={{
                                ...params.InputProps, type: 'search',
                            }}
                            onInput={(e) => setBudgetSubCategory(e.target.value)} />)}
                    />
                </Box>

                {/* Amount */}
                <Box sx={{ mb: 2 }}>
                    <SmallOutlinedTextBox
                        id="test-text-field"
                        label="Amount"
                        value={budgetAmount}
                        onInput={(e) => setBudgetAmount(e.target.value)}
                        fullWidth
                    />
                </Box>

                {/* Add/Update Button */}
                <Box sx={{ mb: 2 }}>
                    {budgetUpdate ?
                        <LoadingButton variant="contained" disabled={loading} onClick={updateBudgetEntry} fullWidth size="large">
                            Update Budget
                        </LoadingButton> :
                        <LoadingButton variant="contained" disabled={loading} onClick={addBudgetEntry} fullWidth size="large">
                            Add Budget
                        </LoadingButton>
                    }
                </Box>
            </Paper>
        </Grid>

        {/* Middle Column - Budget List */}
        <Grid item xs={12} md={6} sx={{ height: { xs: 'auto', md: '100%' }, display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, flexGrow: 1 }}>
                        Budget List
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={individualFlag === 'Y'} onChange={(e) => setIndividualFlag(e.target.checked ? 'Y' : 'N')} />}
                        label="Individual budget"
                    />
                    {(showSaveReOrder && individualFlag === 'Y') &&
                        <LoadingButton variant="contained" disabled={loading} onClick={saveOrder} size="small">
                            Save Order
                        </LoadingButton>
                    }
                    {budgetListCategoryWise.length === 0 && !budgetListLoading &&
                        <LoadingButton variant="outlined" disabled={loading} onClick={copyPreviousMonthData} size="small">
                            Copy Past Month
                        </LoadingButton>
                    }
                </Box>
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {budgetListLoading ? <PageLoader /> :
                        (singleEntryTableView ? (<Table size="small">
                            <TableHead style={{ backgroundColor: '#1976d2' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>S.No</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Reason</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Sub Category</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Amount</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}></TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}></TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="droppable">
                                    {(provided, snapshot) => (
                                        <TableBody
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}>
                                            {budgetListCategoryWise.map((budget, i) => (
                                                <Draggable
                                                    key={i}
                                                    draggableId={"q-" + i}
                                                    index={i}>
                                                    {(provided, snapshot) => (
                                                        <TableRow ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, budget.colorFlag)}
                                                            className={budget.colorFlag === 'blink' ? 'blink-item' : ''}
                                                            hover>
                                                            <TableCell>{i + 1}</TableCell>
                                                            <TableCell>{budget.reason != null ? budget.reason.name : ''}</TableCell>
                                                            <TableCell>{budget.category != null ? budget.category.name : ''}</TableCell>
                                                            <TableCell>{budget.subCategory != null ? budget.subCategory.name : ''}</TableCell>
                                                            <TableCell>{formatter.format(budget.amount)}</TableCell>
                                                            <TableCell>
                                                                {!budget.is_expense_added && (
                                                                    <IconButton color="secondary" size="small"
                                                                        onClick={() => openConvertDialog(budget)}
                                                                        title="Convert to Expense">
                                                                        <PostAddIcon fontSize="small" />
                                                                    </IconButton>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <IconButton color="primary" size="small"
                                                                    onClick={() => editBudgetEntry(budget)}>
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                            <TableCell>
                                                                <IconButton color="error" size="small"
                                                                    onClick={() => deleteBudgetEntry(budget.id)}>
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>)}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </TableBody>)}
                                </Droppable>
                            </DragDropContext>
                            <TableFooter>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Total:</TableCell>
                                    <TableCell><strong style={{ fontSize: '1.25rem' }}>{formatter.format(budgetTotalAmount)}</strong></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>) : (<Table size="small">
                            <TableHead style={{ backgroundColor: '#1976d2' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>S.No</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {budgetListCategoryWise.map((budget, i) => (<TableRow key={i} hover>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{budget.category}</TableCell>
                                    <TableCell>{formatter.format(budget.amount)}</TableCell>
                                </TableRow>))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Total:</TableCell>
                                    <TableCell><strong style={{ fontSize: '1.25rem' }}>{formatter.format(budgetTotalAmount)}</strong></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>))
                    }
                </Box>
            </Paper>
        </Grid>

        {/* Right Column - Due List */}
        <Grid item xs={12} md={4} sx={{ height: { xs: 'auto', md: '100%' }, display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                    Upcoming Dues
                </Typography>
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <DueList dueList={dueList} listLoading={duesListLoading} onDueClick={(due) => {
                        if (due.isExpenseMade) return;
                        setBudgetReason(due.reason.name);
                        setBudgetAmount(due.amount);
                        setBudgetCategory(due.category ? due.category.name : '');
                        setBudgetSubCategory(due.subCategory ? due.subCategory.name : '');

                        if (due.category) {
                            loadSubCategories(due.category.name);
                        }
                    }} />
                </Box>
            </Paper>
        </Grid>

        <Dialog open={openExpenseDialog} onClose={() => setOpenExpenseDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogContent>
                <ExpenseForm
                    initialData={selectedBudgetForExpense}
                    onSubmitSuccess={() => {
                        getBudgetList();
                        getDuesList();
                        setOpenExpenseDialog(false);
                    }}
                    onCancel={() => setOpenExpenseDialog(false)}
                    setSnackbarMessage={props.setSnackbarMessage}
                    setOpenSnackbar={props.setOpenSnackbar}
                />
            </DialogContent>
        </Dialog>
    </Grid>
}