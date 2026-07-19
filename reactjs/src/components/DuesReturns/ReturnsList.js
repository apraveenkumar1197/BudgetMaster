import { Grid, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import React, { Component } from "react";
import Expense from "../../repo/Expense";
import Util from "../../functionalities/Util";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "../../ui/ConfirmationDialog";
import { PageLoader } from "../../ui/PageLoader";


export const ReturnsList = (props) => {
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
            await props.deleteReturns(selectedId);
            setDeletingId(null);
        } else {
            handleCloseDeleteDialog();
        }
    };

    if (props.listLoading) {
        return <PageLoader />;
    }

    return <>
        <TableContainer component={Paper} sx={{ minWidth: 0 }}>
            <Table size="small">
                <TableHead sx={{ backgroundColor: 'primary.main' }}>
                    <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>S.No</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Reason</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Amount</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.returnsList.map((returns, i) => (
                        <TableRow key={'returns-' + i} hover>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{dayjs(returns.date).format('DD MMM YYYY')}</TableCell>
                            <TableCell>{returns.reason.name}</TableCell>
                            <TableCell>{(returns.category == null ? '' : returns.category.name) + (returns.subCategory == null ? '' : ("(" + returns.subCategory.name + ")"))}</TableCell>
                            <TableCell>{formatter.format(returns.amount)}</TableCell>
                            <TableCell>
                                {deletingId === returns.id ? (
                                    <CircularProgress size={20} color="error" />
                                ) : (
                                    <IconButton color="error" size="small"
                                        onClick={() => handleDeleteClick(returns.id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <ConfirmationDialog
            open={deleteDialogOpen}
            handleClose={handleCloseDeleteDialog}
            handleConfirm={handleConfirmDelete}
            title="Delete Return?"
            content="Are you sure you want to delete this return? This action cannot be undone."
        />
    </>
}