import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {ExpenseIndividualReport} from "./Expense/ExpenseIndividualReport";
import {AppBar, IconButton, Link, Toolbar, Typography} from "@mui/material";
import {RoutePath} from "../functionalities/RoutePath"
import {useLocation, useNavigate} from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

export default function SideNav() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const navigate = useNavigate();
    const location = useLocation();

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({...state, [anchor]: open});
    };


    const navigatePage = (path) => {
        navigate(path, {replace: true})
    };

    const navItem = (label, path) => {
        const isActive = location.pathname === path;
        return (
            <ListItem disablePadding>
                <ListItemButton
                    selected={isActive}
                    onClick={() => navigatePage(path)}
                    sx={{
                        '&.Mui-selected': {
                            bgcolor: 'rgba(79, 70, 229, 0.12)',
                            borderLeft: '3px solid',
                            borderColor: 'primary.main',
                        },
                        '&.Mui-selected:hover': {
                            bgcolor: 'rgba(79, 70, 229, 0.18)',
                        },
                    }}>
                    <ListItemText primary={label} primaryTypographyProps={{fontWeight: isActive ? 700 : 500}}/>
                </ListItemButton>
            </ListItem>
        );
    };

    const list = (anchor) => (
        <Box
            sx={{width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 260}}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}>
            <Box sx={{
                p: 2,
                backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #0d9488 130%)',
                color: '#fff'
            }}>
                <Typography variant="h6" sx={{fontWeight: 700}}>BudgetMaster</Typography>
            </Box>
            <List>
                {navItem('Dashi', RoutePath.Dashi)}
                {navItem('Tally', RoutePath.Tally)}
                <Divider/>
                {navItem('Add Expense', RoutePath.Expense)}
                {navItem('Add Income', RoutePath.Income)}
                <Divider/>
                {navItem('Dues', RoutePath.Dues)}
                {navItem('Returns', RoutePath.Returns)}
                {navItem('Credit Card', RoutePath.CreditCard)}
                <Divider/>
                {navItem('Expense report', RoutePath.IndividualExpenseReport)}
                {navItem('Income report', RoutePath.IndividualIncomeReport)}
                {navItem('Transfer report', RoutePath.TransferReport)}
                <Divider/>
                {navItem('Plan Budget', RoutePath.PlanBudget)}
                {navItem('Review Budget', RoutePath.ReviewBudget)}
            </List>
        </Box>
    );

    const styles = {
        toolbarButtons: {
            marginLeft: 'auto',
        },
    };
    return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={0}>
            <Toolbar variant="dense">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon onClick={toggleDrawer('left', true)}></MenuIcon>
                    <Drawer
                        anchor={'left'}
                        open={state['left']}
                        onClose={toggleDrawer('left', false)}
                        transitionDuration={250}
                        PaperProps={{
                            sx: {borderTopRightRadius: 16, borderBottomRightRadius: 16}
                        }}>
                        {list('left')}
                    </Drawer>
                </IconButton>
                <Typography variant="h6" color="inherit" component="div" sx={{
                    display: {xs: 'none', sm: 'block'},
                    fontWeight: 700,
                    letterSpacing: 0.3
                }}>
                    BudgetMaster
                </Typography>
                <div style={{marginLeft: 'auto'}}>
                    <IconButton color="inherit" onClick={() => navigatePage(RoutePath.Dashi)}>
                        <DashboardIcon />
                    </IconButton>
                    <IconButton color="inherit"  onClick={() => navigatePage(RoutePath.Logout)}>
                        <LogoutIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    </Box>
    );
}