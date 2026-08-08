<?php

namespace App\Console\Commands;

use App\Mail\DbBackupMailer;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Process\Process;

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
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $user = User::first();
        if (!$user) {
            return Command::SUCCESS;
        }

        $connection = config('database.connections.mysql');
        $dumpPath = storage_path('app/' . date('Y-m-d') . '-db-backup.sql');

        $process = new Process([
            'mysqldump',
            '-h' . $connection['host'],
            '-P' . $connection['port'],
            '-u' . $connection['username'],
            '-p' . $connection['password'],
            $connection['database'],
            '--result-file=' . $dumpPath,
        ]);
        $process->setTimeout(300);
        $process->run();

        if (!$process->isSuccessful() || !file_exists($dumpPath)) {
            $this->error('mysqldump failed: ' . $process->getErrorOutput());
            return Command::FAILURE;
        }

        Mail::to($user->email)->send(new DbBackupMailer($dumpPath));

        unlink($dumpPath);

        return Command::SUCCESS;
    }
}
