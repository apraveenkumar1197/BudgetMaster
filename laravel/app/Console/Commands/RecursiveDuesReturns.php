<?php

namespace App\Console\Commands;

use App\Services\RecursiveDuesReturnsProcessor;
use Illuminate\Console\Command;

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
        (new RecursiveDuesReturnsProcessor())->process();
        return Command::SUCCESS;
    }
}
