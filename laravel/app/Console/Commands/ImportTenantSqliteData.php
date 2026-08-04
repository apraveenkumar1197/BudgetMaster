<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class ImportTenantSqliteData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tenant:import {path : Absolute path to the tenant .db (sqlite) file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'One-time import of a legacy per-tenant SQLite database into the single MySQL database';

    /**
     * Tables to copy, in dependency-safe order.
     *
     * @var array<int, string>
     */
    private $tables = [
        'storages',
        'pay_modes',
        'credit_cards',
        'loans',
        'investments',
        'settings',
        'categories',
        'sub_categories',
        'reasons',
        'budgets',
        'investment_hides',
        'ledgers',
    ];

    public function handle()
    {
        $path = $this->argument('path');

        if (!file_exists($path)) {
            $this->error("File not found: {$path}");
            return Command::FAILURE;
        }

        Config::set('database.connections.sqlite_import', [
            'driver' => 'sqlite',
            'url' => null,
            'database' => $path,
            'prefix' => '',
            'foreign_key_constraints' => true,
        ]);

        $sourceCounts = [];
        foreach ($this->tables as $table) {
            $sourceCounts[$table] = DB::connection('sqlite_import')->table($table)->count();
        }

        DB::transaction(function () use ($sourceCounts) {
            foreach ($this->tables as $table) {
                if (DB::table($table)->count() > 0) {
                    throw new \RuntimeException("Target table '{$table}' is not empty, aborting import.");
                }

                DB::connection('sqlite_import')->table($table)->orderBy(
                    DB::connection('sqlite_import')->getSchemaBuilder()->hasColumn($table, 'id') ? 'id' : DB::raw('rowid')
                )->chunk(500, function ($rows) use ($table) {
                    $insertRows = $rows->map(function ($row) use ($table) {
                        $row = (array) $row;
                        // One legacy garbage row (budgets id 799) has an empty string
                        // amount; the column is NOT NULL decimal, so normalize to 0.
                        if ($table === 'budgets' && ($row['amount'] ?? null) === '') {
                            $row['amount'] = 0;
                        }
                        return $row;
                    })->all();
                    if (!empty($insertRows)) {
                        DB::table($table)->insert($insertRows);
                    }
                });

                $importedCount = DB::table($table)->count();
                if ($importedCount !== $sourceCounts[$table]) {
                    throw new \RuntimeException("Row count mismatch for '{$table}': source {$sourceCounts[$table]}, imported {$importedCount}.");
                }

                $this->info("{$table}: imported {$importedCount} rows");
            }
        });

        $this->info('Import complete.');
        return Command::SUCCESS;
    }
}
