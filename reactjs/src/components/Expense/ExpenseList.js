import { Grid, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableFooter, TableRow, Paper, CircularProgress } from "@mui/material";
import React, { Component } from "react";
import Expense from "../../repo/Expense";
import Util from "../../functionalities/Util";
import dayjs from "dayjs";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmationDialog from "../../ui/ConfirmationDialog";
import { PageLoader } from "../../ui/PageLoader";


export const ExpenseList = (props) => {
    const formatter = Util.numberFormatter()
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState(null);
    const [deletingId, setDeletingId] = React.useState(null);

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedId(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedId) {
            setDeletingId(selectedId);
            handleCloseDeleteDialog(); // Close dialog immediately or wait? User asked "after popup confirmation the loading should be displayed on the item of the list"
            // So we close the dialog, then show loading on the list item.
            await props.deleteExpense(selectedId);
            setDeletingId(null);
        } else {
            handleCloseDeleteDialog();
        }
    };

    if (props.listLoading) {
        return <PageLoader />;
    }

    return <TableContainer component={Paper} sx={{ minWidth: 0 }}>
    <Table size="small">
        <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>S.No</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Reason</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Pay mode</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}></TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {props.expenseList.map((expense, i) => (
                <TableRow key={expense.id} hover>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{dayjs(expense.date).format('DD MMM YYYY')}</TableCell>
                    <TableCell>{expense.reason.name}</TableCell>
                    <TableCell>{(expense.category == null ? '' : expense.category.name) + (expense.subCategory == null ? '' : ("(" + expense.subCategory.name + ")"))}</TableCell>
                    <TableCell>{formatter.format(expense.amount)}</TableCell>
                    <TableCell>{expense.payMode.name}</TableCell>
                    <TableCell>
                        <IconButton color="primary" size="small" onClick={() => props.editExpense(expense)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                    <TableCell>
                        {deletingId === expense.id ? (
                            <CircularProgress size={20} color="error" />
                        ) : (
                            <IconButton color="error" size="small" onClick={() => handleDeleteClick(expense.id)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
        <TableFooter>
            <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total:</TableCell>
                <TableCell><strong>{formatter.format(props.expenseListTotal)}</strong></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
            </TableRow>
        </TableFooter>
    </Table>
    <ConfirmationDialog
        open={deleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        handleConfirm={handleConfirmDelete}
        title="Delete Expense?"
        content="Are you sure you want to delete this expense? This action cannot be undone."
    />
    </TableContainer>
}