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
    if(location.pathname === RoutePath.Login){
        return;
    }

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({...state, [anchor]: open});
    };


    const navigatePage = (path) => {
        navigate(path, {replace: true})
    };
    const list = (anchor) => (
        <Box
            sx={{width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250}}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}>

            <List>
                <ListItem disablePadding>
                    <ListItemButton to={RoutePath.Dashi}>
                        <ListItemText primary={'Dashi'}/>
                    </ListItemButton>
                </ListItem>
                 <ListItem disablePadding>
                    <ListItemButton to={RoutePath.Tally}>
                        <ListItemText primary={'Tally'}/>
                    </ListItemButton>
                </ListItem>
                <Divider/>
                <ListItem disablePadding>
                    <ListItemButton to={RoutePath.Expense}>
                        <ListItemText primary={'Add Expense'}/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton to={RoutePath.Income}>
                        <ListItemText primary={'Add Income'}/>
                    </ListItemButton>
                </ListItem>
                <Divider/>
                <ListItem disablePadding>
                    <ListItemButton to={RoutePath.Dues}>
                        <ListItemText primary={'Dues'}/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton to={RoutePath.Returns}>
                        <ListItemText primary={'Returns'}/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton to={RoutePath.CreditCard}>
                        <ListItemText primary={'Credit Card'}/>
                    </ListItemButton>
                </ListItem>
                <Divider/>
                <ListItem disablePadding>
                    <ListItemButton to={RoutePath.IndividualExpenseReport}>
                        <ListItemText primary={'Expense report'}/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton to={RoutePath.IndividualIncomeReport}>
                        <ListItemText primary={'Income report'}/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton to={RoutePath.TransferReport}>
                        <ListItemText primary={'Transfer report'}/>
                    </ListItemButton>
                </ListItem>
                <Divider/>
                <ListItem disablePadding>
                    <ListItemButton to={RoutePath.PlanBudget}>
                        <ListItemText primary={'Plan Budget'}/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton to={RoutePath.ReviewBudget}>
                        <ListItemText primary={'Review Budget'}/>
                    </ListItemButton>
                </ListItem>
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
        <AppBar position="static">
            <Toolbar variant="dense">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon onClick={toggleDrawer('left', true)}></MenuIcon>
                    <Drawer
                        anchor={'left'}
                        open={state['left']}
                        onClose={toggleDrawer('left', false)}>
                        {list('left')}
                    </Drawer>
                </IconButton>
                <Typography variant="h6" color="inherit" component="div">

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