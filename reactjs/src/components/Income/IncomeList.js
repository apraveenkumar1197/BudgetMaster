import { Grid, IconButton, Stack, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, CircularProgress } from "@mui/material";
import React, { Component } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Util from "../../functionalities/Util";
import dayjs from "dayjs";
import ConfirmationDialog from "../../ui/ConfirmationDialog";
import { PageLoader } from "../../ui/PageLoader";


export const IncomeList = (props) => {
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
            handleCloseDeleteDialog();
            await props.deleteIncome(selectedId);
            setDeletingId(null);
        } else {
            handleCloseDeleteDialog();
        }
    };

    if (props.listLoading) {
        return <PageLoader />;
    }

    return <Table size="small">
        <TableHead style={{ backgroundColor: '#1976d2' }}>
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
            {props.incomeList.map((income, i) => (
                <TableRow key={income.id} hover>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{dayjs(income.date).format('DD MMM YYYY')}</TableCell>
                    <TableCell>{income.reason.name}</TableCell>
                    <TableCell>{(income.category == null ? '' : income.category.name) + (income.subCategory == null ? '' : ("(" + income.subCategory.name + ")"))}</TableCell>
                    <TableCell>{formatter.format(income.amount)}</TableCell>
                    <TableCell>{income.payMode.name}</TableCell>
                    <TableCell>
                        <IconButton color="primary" size="small" onClick={() => props.editIncome(income)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                    <TableCell>
                        {deletingId === income.id ? (
                            <CircularProgress size={20} color="error" />
                        ) : (
                            <IconButton color="error" size="small" onClick={() => handleDeleteClick(income.id)}>
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
                <TableCell><strong>{formatter.format(props.incomeAmountTotal)}</strong></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
            </TableRow>
        </TableFooter>
        <ConfirmationDialog
            open={deleteDialogOpen}
            handleClose={handleCloseDeleteDialog}
            handleConfirm={handleConfirmDelete}
            title="Delete Income?"
            content="Are you sure you want to delete this income? This action cannot be undone."
        />
    </Table>
}