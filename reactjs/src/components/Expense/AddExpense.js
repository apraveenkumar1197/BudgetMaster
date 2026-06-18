import {
    Grid,
    Paper,
    Typography
} from "@mui/material";
import { ExpenseList } from "./ExpenseList";
import React from "react";
import Expense from "../../repo/Expense";
import DateUtil from "../../functionalities/DateUtil";
import Box from "@mui/material/Box";
import { ExpenseForm } from "./ExpenseForm";

export const AddExpense = (props) => {

    const [expenseDate, setExpenseDate] = React.useState(new Date());
    const [expenseList, setExpenseList] = React.useState([]);
    const [listLoading, setListLoading] = React.useState(false);
    const [expenseListTotal, setExpenseListTotal] = React.useState('');
    const [editingExpenseData, setEditingExpenseData] = React.useState(null);

    const editExpense = (expense) => {
        setEditingExpenseData({
            id: expense.id,
            date: (new DateUtil(new Date(expense.date))).mySQLDate(), // Use the expense's date for editing
            reason: expense.reason != null ? expense.reason.name : '',
            category: expense.category != null ? expense.category.name : '',
            subCategory: expense.subCategory != null ? expense.subCategory.name : '',
            description: expense.description != null ? expense.description : '',
            amount: expense.amount,
            payMode: expense.payMode != null ? expense.payMode.name : ''
        });
    }

    const getExpensesList = () => {
        setListLoading(true);
        Expense.getExpenseList(new DateUtil(expenseDate).mySQLDate())
            .then((res) => {
                setExpenseList(res.data.data.list)
                setExpenseListTotal(res.data.data.total)
                setListLoading(false);
            }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
                setListLoading(false);
            });
    }

    const deleteExpense = (id) => {
        return Expense.deleteExpense(id)
            .then((res) => {
                getExpensesList()
                props.setSnackbarMessage(res.data.msg)
                props.setOpenSnackbar(true)
            }).catch((err) => {
                props.setSnackbarMessage(err.response.data.msg)
                props.setOpenSnackbar(true)
            });
    }

    React.useEffect(() => {
        getExpensesList()
    }, [expenseDate]);

    return <Grid container spacing={2} sx={{ p: 2, height: { xs: 'auto', md: 'calc(100vh - 100px)' }, overflow: 'auto' }}>
        {/* Left Column - Form */}
        <Grid item xs={12} md={4} sx={{ height: { xs: 'auto', md: '100%' } }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                    Add Expense
                </Typography>

                <ExpenseForm
                    initialData={editingExpenseData}
                    currentDate={expenseDate} // Pass the current date from parent
                    onDateChange={setExpenseDate}
                    onSubmitSuccess={() => {
                        getExpensesList();
                        setEditingExpenseData(null);
                    }}
                    onCancel={() => setEditingExpenseData(null)}
                    setSnackbarMessage={props.setSnackbarMessage}
                    setOpenSnackbar={props.setOpenSnackbar}
                />
            </Paper>
        </Grid>

        {/* Right Column - Expense List */}
        <Grid item xs={12} md={8} sx={{ height: { xs: 'auto', md: '100%' }, display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                    Expense List
                </Typography>
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <ExpenseList
                        editExpense={editExpense}
                        deleteExpense={deleteExpense}
                        expenseListTotal={expenseListTotal}
                        expenseList={expenseList}
                        listLoading={listLoading}
                    />
                </Box>
            </Paper>
        </Grid>
    </Grid>
}
