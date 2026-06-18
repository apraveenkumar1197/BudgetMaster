<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\DB\SqliteSetup;
use App\Services\RecursiveDuesReturnsProcessor;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class RecursiveDuesReturns extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'recursive:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        User::all()->each(function ($user) {
            new SqliteSetup($user);
            (new RecursiveDuesReturnsProcessor())->process();

        });
        return Command::SUCCESS;
    }
}
