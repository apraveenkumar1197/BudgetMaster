<?php

namespace App\Enum;

enum Category: string
{
    case Expense = 'expense';
    case Income = 'income';
    case InvestmentReturns = 'Investment-Returns';
    case SavingReturns = 'Saving-Return';
    case CreditCardExpense = 'Credit card expense';
    case Loan = 'Loan';
    case LoanPaid = 'Loan-Paid';
}
