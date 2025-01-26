<?php

namespace App\Console\Commands;

use App\Enum\HttpStatus;
use App\Mail\DbBackupMailer;
use App\Models\User;
use App\Services\DB\SqliteSetup;
use App\Services\Due\AddDueService;
use App\Services\Ledger\Expense\AddExpenseService;
use App\Services\Ledger\Income\AddIncomeService;
use App\Services\Returns\AddReturnsService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use mysql_xdevapi\Collection;
use PDO;
use PhpOffice\PhpSpreadsheet\IOFactory;

class DbBackuper extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:db';

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
        $users = User::all();
        foreach ($users as $user){
            Mail::to($user->email)->send((new DbBackupMailer($user->db_name)));
        }
        return Command::SUCCESS;
    }
}
