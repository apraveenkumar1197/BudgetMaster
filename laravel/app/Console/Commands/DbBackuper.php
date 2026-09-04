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
            // MySQL 8's auto-generated self-signed cert is rejected by this
            // (MariaDB-based) client's default TLS verification; the
            // db<->laravel-php hop is within the trusted Docker network, so
            // skipping TLS here is acceptable. --no-tablespaces avoids
            // needing the broad PROCESS privilege just to take a backup.
            '--skip-ssl',
            '--no-tablespaces',
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
