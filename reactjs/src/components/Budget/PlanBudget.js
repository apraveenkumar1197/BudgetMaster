import React from "react";
import Tally from "../../repo/Tally";
import Util from "../../functionalities/Util";
import {
    Autocomplete,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Budget from "../../repo/Budget";
import {SmallOutlinedTextBox} from "../../ui/SmallOutlinedTextBox";
import DateUtil from "../../functionalities/DateUtil";
import Expense from "../../repo/Expense";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import {LoadingButton} from "../../ui/LoadingButton";
import Paper from "@mui/material/Paper";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {DueList} from "../DuesReturns/DueList";
import DuesReturns from "../../repo/DuesReturns";


const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, backgroundColor) => ({
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    background: isDragging ? "#dedddc" : backgroundColor,

    ...draggableStyle
});

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

    const [individualFlag, setIndividualFlag] = React.useState('N');
    const [singleEntryTableView, setSingleEntryTableView] = React.useState(false);
    const [dueList, setDueList] = React.useState([]);
    const [showSaveReOrder, setShowSaveReOrder] = React.useState(false);

    const [loading, setLoading] = React.useState(false);

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
        Budget.add(new DateUtil(budgetDate).mySQLMonth(), budgetReason, budgetCategory, budgetSubCategory, budgetAmount).then((res) => {
            getBudgetList()
            props.setSnackbarMessage(res.data.msg)
            props.setOpenSnackbar(true)
            resetForm();
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
        });
    }
    const getBudgetList = () => {
        Budget.list(new DateUtil(budgetDate).mySQLMonth(), individualFlag).then((res) => {
            setBudgetListCategoryWise(res.data.data.list)
            setBudgetTotalAmount(res.data.data.totalAmount);
        }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
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
        DuesReturns.getMonthDues(new DateUtil(budgetDate).mySQLMonth())
            .then((res) => {
                setDueList(res.data.data)
            }).catch((err) => {
            props.setSnackbarMessage(err.response.data.msg)
            props.setOpenSnackbar(true)
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
    return <Grid container>
        <Grid item xs={12} md={3}>
            <Grid container style={{padding: 10}} spacing={0}>
                <Grid item>
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
                            value={budgetDate}/>
                    </LocalizationProvider>
                </Grid>
            </Grid>
            <Grid container style={{padding: 10}} spacing={0}>
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
                    sx={{width: 300}}
                    renderInput={(params) => (<TextField
                        {...params}
                        id="budget_reason"
                        label="Reason"
                        size="small"
                        InputProps={{
                            ...params.InputProps, type: 'search',
                        }}
                        onInput={(e) => {
                            setBudgetReason(e.target.value)
                        }}/>)}
                />
            </Grid>
            <Grid container style={{padding: 10}} spacing={0}>
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
                    sx={{width: 300}}
                    renderInput={(params) => (<TextField
                        {...params}
                        id="budget_category"
                        label="Category"
                        size="small"
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
                        }}/>)}
                />
            </Grid>
            <Grid container style={{padding: 10}} spacing={0}>
                <Autocomplete
                    value={budgetSubCategory}
                    freeSolo
                    id="budget_sub_category_autocomplete"
                    disableClearable
                    options={budgetSubCategories}
                    onChange={(e, v) => setBudgetSubCategory(v)}
                    sx={{width: 300}}
                    renderInput={(params) => (<TextField
                        {...params}
                        id="budget_sub_category"
                        label="Sub Category"
                        size="small"
                        InputProps={{
                            ...params.InputProps, type: 'search',
                        }}
                        onInput={(e) => setBudgetSubCategory(e.target.value)}/>)}
                />
            </Grid>
            <Grid container sx={{width: 300}} style={{padding: 10}} spacing={0}>
                <SmallOutlinedTextBox id="test-text-field" label="Amount" value={budgetAmount}
                                      onInput={(e) => setBudgetAmount(e.target.value)}/>
            </Grid>
            <Grid container style={{padding: 10}} spacing={0}>
                {budgetUpdate ? <LoadingButton variant="contained" disabled={loading} onClick={updateBudgetEntry}>Update
                        Budget</LoadingButton> :
                    <LoadingButton variant="contained" disabled={loading} onClick={addBudgetEntry}>Add
                        Budget</LoadingButton>}
            </Grid>
        </Grid>

        <Grid item xs={12} md={5}>
            <Grid container style={{padding: 10}} spacing={0}>
                <FormControlLabel control={<Switch onChange={(e) => setIndividualFlag(e.target.checked ? 'Y' : 'N')}/>}
                                  label="Individual budget"/>
                {
                    (showSaveReOrder && individualFlag === 'Y') ?
                        <LoadingButton variant="contained" disabled={loading} onClick={saveOrder}>Save
                            Order</LoadingButton> : ''}
                {
                    budgetListCategoryWise.length === 0 ?
                        <LoadingButton variant="contained" disabled={loading} onClick={copyPreviousMonthData}>Copy past
                            month</LoadingButton> : ''
                }
            </Grid>
            <Grid container style={{padding: 10}} spacing={0}>
                {singleEntryTableView ? (<Table flex={1}>
                    <TableHead style={{backgroundColor: '#1976d2'}}>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Sub Category</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
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
                                                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, budget.colorFlag)}>
                                                    <TableCell>{i + 1}</TableCell>
                                                    <TableCell>{budget.reason != null ? budget.reason.name : ''}</TableCell>
                                                    <TableCell>{budget.category != null ? budget.category.name : ''}</TableCell>
                                                    <TableCell>{budget.subCategory != null ? budget.subCategory.name : ''}</TableCell>
                                                    <TableCell>{formatter.format(budget.amount)}</TableCell>
                                                    <TableCell>
                                                        <IconButton color="black" size="medium"
                                                                    onClick={() => editBudgetEntry(budget)}>
                                                            <EditIcon/>
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton color="black" size="medium"
                                                                    onClick={() => deleteBudgetEntry(budget.id)}>
                                                            <DeleteIcon/>
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
                            <TableCell></TableCell>
                            <TableCell><h2>{formatter.format(budgetTotalAmount)}</h2></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>) : (<Table flex={1}>
                    <TableHead style={{backgroundColor: '#1976d2'}}>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {budgetListCategoryWise.map((budget, i) => (<TableRow>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{budget.category}</TableCell>
                            <TableCell>{formatter.format(budget.amount)}</TableCell>
                        </TableRow>))}
                    </TableBody>
                    <TableFooter>
                        <TableRow><TableCell></TableCell><TableCell></TableCell><TableCell>
                            <h2>{formatter.format(budgetTotalAmount)}</h2></TableCell></TableRow>
                    </TableFooter>
                </Table>)}
            </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
            <DueList dueList={dueList}/>
        </Grid>
    </Grid>
}