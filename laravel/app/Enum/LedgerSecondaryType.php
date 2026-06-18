<?php

namespace App\Enum;

enum LedgerSecondaryType:string
{
    case Investment = 'Investment';
    case Saving = 'Saving';
    case Loan = 'Loan';
}
