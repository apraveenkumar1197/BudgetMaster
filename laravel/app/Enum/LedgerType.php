<?php

namespace App\Enum;

enum LedgerType:string
{
    case Expense = 'expense';
    case Income = 'income';
    case Storage = 'storage';
    case Due = 'due';
    case Returns = 'returns';
}
