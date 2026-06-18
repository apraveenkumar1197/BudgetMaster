<?php

namespace App\Services\Storage;

use App\Models\Sqlite\Ledger;
use App\Models\Sqlite\Storage;
use App\Services\ServiceResponse;
use Carbon\Carbon;

class StorageReport
{
    private $fromDate, $toDate, $fromStorageId, $toStorageId;
    function __construct($fromDate, $toDate, $fromStorageId, $toStorageId)
    {
        $this->fromDate = $fromDate;
        $this->toDate = $toDate;
        $this->fromStorageId = $fromStorageId;
        $this->toStorageId = $toStorageId;
    }

    function report()
    {
        $finalData = collect();
        $storageReportData = collect();
        $storageReport = Ledger::dateRange($this->fromDate, $this->toDate)
            ->storageTransfers()
            ->get();

        $fromPayModes = collect();
        $toPayModes = collect();
        if($this->fromStorageId != null)
            $fromPayModes = Storage::find($this->fromStorageId)->payModes->pluck('id');
        if($this->toStorageId != null)
            $toPayModes = Storage::find($this->toStorageId)->payModes->pluck('id');

        foreach ($storageReport as $ledger){
            $amount = $ledger->credit > 0 ? $ledger->credit : $ledger->debit;
            $amountType = $ledger->credit > 0 ? 'credit' : 'debit';

            if($fromPayModes->isNotEmpty() and !$fromPayModes->contains($ledger->pay_mode) and $amountType == 'debit') continue;
            if($toPayModes->isNotEmpty() and !$toPayModes->contains($ledger->pay_mode) and $amountType == 'credit') continue;

            $storageReportItem = $storageReportData->where('date', $ledger->date)
                ->where('amount', $amount)
                ->whereBetween('created_at', [
                    Carbon::parse($ledger->created_at)->subSeconds(2)->format('Y-m-d H:i:s'),
                    Carbon::parse($ledger->created_at)->addSeconds(2)->format('Y-m-d H:i:s')
                ])
                ->first();

            if($storageReportItem == null){
                $storageReportItem = [
                    'date' => $ledger->date,
                    'amount' => $amount,
                    'created_at' => $ledger->created_at,
                    'from' => null,
                    'to' => null,
                ];
                $storageReportItem[$amountType == 'credit' ? 'to' : 'from'] = $ledger->payMode->storage->name;
                $storageReportData->add($storageReportItem);
            }
            else{
                $storageReportItem[$amountType == 'credit' ? 'to' : 'from'] = $ledger->payMode->storage->name;
                $finalData->add($storageReportItem);
            }
        }

        return (new ServiceResponse())->setData([
            'transfers' => $finalData->sortByDesc('date')->values(),
            'storage' => (new StorageListService($this->fromDate, $this->toDate))->get()->getData()
        ]);
    }
}
