<?php

namespace App\Console\Commands;

use App\Enum\HttpStatus;
use App\Models\User;
use App\Services\DB\SqliteSetup;
use App\Services\Due\AddDueService;
use App\Services\Ledger\Expense\AddExpenseService;
use App\Services\Ledger\Income\AddIncomeService;
use App\Services\Returns\AddReturnsService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use mysql_xdevapi\Collection;
use PDO;
use PhpOffice\PhpSpreadsheet\IOFactory;

class HLMigration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:hl';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.HttpStatus::Error
     *
     * @return int
     */
    public function handle()
    {
        DB::connection('sqlite_old')->update(DB::raw("UPDATE ledger SET category='' where category IS NULL and income_expense='Income'"));

        new SqliteSetup(User::find(1));
        $spreadsheet = IOFactory::load(Storage::disk('local')->path('Migration.xlsx'));
        $expenseData = $spreadsheet->getSheet(0)->toArray(null, true, true, true);
        $incomeData = $spreadsheet->getSheet(1)->toArray(null, true, true, true);
        $dueData = $spreadsheet->getSheet(2)->toArray(null, true, true, true);
        $returnData = $spreadsheet->getSheet(3)->toArray(null, true, true, true);

        /*$results = DB::connection('sqlite_old')->select(DB::raw("SELECT * FROM ledger where income_expense='Expense'"));

        $data = collect($expenseData);
        foreach ($results as $i => $value) {
            //echo "$i - $value->reason . "," . $value->category\n";
            $res = $data->where('A', trim($value->reason))
                ->where('B', trim($value->category));
           if(count($res) == 0)
               echo $value->reason . "," . $value->category . "\n";
        }*/

        $this->expense($expenseData);
        $this->income($incomeData);
        $this->due($dueData);
        $this->return($returnData);

        return Command::SUCCESS;
    }

    function expense($expenseData)
    {
        var_dump(count($expenseData));
        foreach ($expenseData as $value) {

            $oldReason = trim($value['A']);
            $oldCategory = trim($value['B']);

            $reason = trim($value['C']);
            $category = trim($value['D']);
            $subCategory = trim($value['E']);
            $description = trim($value['F']);

            $results = DB::connection('sqlite_old')->select(DB::raw("SELECT * FROM ledger where trim(reason)='$oldReason' and trim(category)='$oldCategory' and income_expense='Expense'"));
            foreach ($results as $row) {
                $serRes = (new AddExpenseService($row->date, $reason, $category, $subCategory, $description, $row->debit, $row->transaction_type))->add();
                if ($serRes['status'] != 200)
                    echo $value['A'] . "," . $value['B'] . "\n";
            }
            DB::connection('sqlite_old')->delete(DB::raw("DELETE FROM ledger where trim(reason)='$oldReason' and trim(category)='$oldCategory' and income_expense='Expense'"));
        }
    }

    function income($incomeData)
    {
        var_dump(count($incomeData));
        foreach ($incomeData as $value) {

            $oldReason = trim($value['A']);
            $oldCategory = trim($value['B']);

            $reason = trim($value['C']);
            $category = trim($value['D']);
            $subCategory = trim($value['E']);
            //$description = trim($value['F']);

            $results = DB::connection('sqlite_old')->select(DB::raw("SELECT * FROM ledger where trim(reason)='$oldReason' and (category)='$oldCategory' and income_expense='Income'"));
            foreach ($results as $row) {
                $serRes = (new AddIncomeService($row->date, $reason, $category, $subCategory, null, $row->credit, $row->transaction_type))->add();
                if ($serRes->getStatus() != HttpStatus::Success)
                    echo $value['A'] . "," . $value['B'] . "\n";
            }
            DB::connection('sqlite_old')->delete(DB::raw("DELETE FROM ledger where trim(reason)='$oldReason' and (category)='$oldCategory' and income_expense='Income'"));
        }
    }

    function due($dueData)
    {
        foreach ($dueData as $value) {

            $oldReason = trim($value['A']);
            //$oldCategory = trim($value['B']);

            $reason = trim($value['C']);
            $category = trim($value['D']);
            $subCategory = trim($value['E']);
            //$description = trim($value['F']);

            $results = DB::connection('sqlite_old')->select(DB::raw("SELECT * FROM dues where trim(reason)='$oldReason'"));
            foreach ($results as $row) {
                $serRes = (new AddDueService($row->date, $reason, $category, $subCategory, $row->amount))->add();
                if ($serRes->getStatus() != HttpStatus::Success)
                    echo $value['A'] . "," . $value['B'] . "\n";
            }
            DB::connection('sqlite_old')->delete(DB::raw("DELETE FROM dues where trim(reason)='$oldReason'"));
        }
    }

    function return($returnData)
    {
        foreach ($returnData as $value) {

            $oldReason = trim($value['A']);
            //$oldCategory = trim($value['B']);

            $reason = trim($value['C']);
            $category = trim($value['D']);
            $subCategory = trim($value['E']);
            //$description = trim($value['F']);

            $results = DB::connection('sqlite_old')->select(DB::raw("SELECT * FROM investment_returns where trim(returns_from)='$oldReason'"));
            foreach ($results as $row) {
                $serRes = (new AddReturnsService($row->date, $reason, $category, $subCategory, $row->amount))->add();
                if ($serRes->getStatus() != HttpStatus::Success)
                    echo $value['A'] . "," . $value['B'] . "\n";
            }
            DB::connection('sqlite_old')->delete(DB::raw("DELETE FROM investment_returns where trim(returns_from)='$oldReason'"));
        }
    }
}
