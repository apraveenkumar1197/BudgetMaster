import './App.css';
import {Dashi} from "./components/Dashi";
import {Login} from "./components/Login";
import {Registration} from "./components/Register";
import {Index} from "./components/Index";
import {Snackbar} from "@mui/material";
import {Routes, Route, useNavigate, useLocation} from "react-router-dom";
import {RoutePath} from "./functionalities/RoutePath"
import React from "react";
import {AddIncome} from "./components/Income/AddIncome";
import {ExpenseIndividualReport} from "./components/Expense/ExpenseIndividualReport";
import {IncomeIndividualReport} from "./components/Income/IncomeIndividualReport";
import SideNav from "./components/SideNav";
import {AddDue} from "./components/DuesReturns/AddDue";
import {AddReturns} from "./components/DuesReturns/AddReturns";
import Box from "@mui/material/Box";
import {AddExpense} from "./components/Expense/AddExpense";
import {TallyReport} from "./components/Tally";
import {PlanBudget} from "./components/Budget/PlanBudget";
import {ReviewBudget} from "./components/Budget/ReviewBudget";
import LocalStorage from "./providers/LocalStorage";
import {Logout} from "./components/Logout";
import {StorageReport} from "./components/StorageReport";
import {AddCreditCard, CreditCard} from "./components/CreditCard/AddCreditCard";

function App() {
  const [snackbarMessage, setSnackbarMessage] = React.useState('')
  const [openSnackbar, setOpenSnackbar] = React.useState(false)

    const navigate = useNavigate();
    const location = useLocation();
    if(location.pathname !== RoutePath.Login){
        if (LocalStorage.accessToken() === null) {
            navigate('/login', {replace: true})
        }
    }

  return (
      <div>
        <Snackbar
            onClose={() => setOpenSnackbar(false)}
            open={openSnackbar}
            autoHideDuration={6000}
            message={snackbarMessage !== '' ? snackbarMessage : 'Unknown server error'}/>
            {/*<Register setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>*/}
          <Box sx={{flexGrow: 1}}>
              <SideNav />
          </Box>
          <br/>
          <div>
              <Routes>
                  <Route path={RoutePath.RootPath} element={<Index setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}></Route>
                  <Route path={RoutePath.Login} element={<Login setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}></Route>
                  <Route path={RoutePath.Register} element={<Registration setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}></Route>
                  <Route path={RoutePath.Dashi} element={<Dashi setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}/>
                  <Route path={RoutePath.Expense} element={<AddExpense setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}/>
                  <Route path={RoutePath.Income} element={<AddIncome setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}/>
                  <Route path={RoutePath.Dues} element={<AddDue setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}/>
                  <Route path={RoutePath.Returns} element={<AddReturns setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}/>
                  <Route path={RoutePath.CreditCard} element={<AddCreditCard setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}/>
                  <Route path={RoutePath.IndividualExpenseReport} element={<ExpenseIndividualReport setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}/>
                  <Route path={RoutePath.IndividualIncomeReport} element={<IncomeIndividualReport setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}/>
                  <Route path={RoutePath.TransferReport} element={<StorageReport setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}/>
                  <Route path={RoutePath.Tally} element={<TallyReport setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}/>
                  <Route path={RoutePath.PlanBudget} element={<PlanBudget setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}/>
                  <Route path={RoutePath.ReviewBudget} element={<ReviewBudget setSnackbarMessage={setSnackbarMessage} setOpenSnackbar={setOpenSnackbar}/>}/>
                  <Route path={RoutePath.Logout} element={<Logout />}/>
              </Routes>
          </div>
      </div>


  );
}

export default App;
