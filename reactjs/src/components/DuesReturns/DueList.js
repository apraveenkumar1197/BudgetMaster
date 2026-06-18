import {
    Grid,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress
} from "@mui/material";
import { PageLoader } from "../../ui/PageLoader";
import React, { Component } from "react";
import Expense from "../../repo/Expense";
import Util from "../../functionalities/Util";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import DuesReturns from "../../repo/DuesReturns";
import Budget from "../../repo/Budget";
import ConfirmationDialog from "../../ui/ConfirmationDialog";


export const DueList = (props) => {
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
            await props.deleteDue(selectedId);
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
                {'deleteDue' in props ? <TableCell sx={{ color: 'white', fontWeight: 600 }}></TableCell> : ''}
            </TableRow>
        </TableHead>
        <TableBody>
            {props.dueList.map((due, i) => (
                <TableRow
                    style={{ backgroundColor: due.colorFlag, cursor: props.onDueClick && !due.isExpenseMade ? 'pointer' : 'default' }}
                    key={'dues-' + i}
                    hover
                    onClick={() => {
                        if (props.onDueClick) {
                            props.onDueClick(due);
                        }
                    }}
                >
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{dayjs(due.date).format('DD MMM YYYY')}</TableCell>
                    <TableCell>{due.reason.name}</TableCell>
                    <TableCell>{(due.category == null ? '' : due.category.name) + (due.subCategory == null ? '' : ("(" + due.subCategory.name + ")"))}</TableCell>
                    <TableCell>{formatter.format(due.amount)}</TableCell>
                    {'deleteDue' in props ? <TableCell>
                        {deletingId === due.id ? (
                            <CircularProgress size={20} color="error" />
                        ) : (
                            <IconButton color="error" size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(due.id);
                                }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </TableCell> : ''}
                </TableRow>
            ))}
        </TableBody>
        <ConfirmationDialog
            open={deleteDialogOpen}
            handleClose={handleCloseDeleteDialog}
            handleConfirm={handleConfirmDelete}
            title="Delete Due?"
            content="Are you sure you want to delete this due? This action cannot be undone."
        />
    </Table>
}