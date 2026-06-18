<?php

namespace Tests\Unit;

use App\Services\Budget\AddBudgetEntry;
use App\Models\Sqlite\Budget;
use App\Models\Sqlite\Master\Reason;
use App\Models\Sqlite\Master\Category;
use App\Models\Sqlite\Master\SubCategory;
use App\Services\ServiceResponse;
use App\Enum\HttpStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddBudgetEntryTest extends TestCase
{
    use RefreshDatabase;

    public function test_add_budget_entry_success()
    {
        // Setup
        $month = '2023-10';
        $reason = 'Test Reason';
        $category = 'Test Category';
        $subCategory = 'Test SubCategory';
        $amount = 1000;

        // Create master data
        Reason::create(['name' => $reason]);
        Category::create(['name' => $category]);
        SubCategory::create(['name' => $subCategory]);

        // Action
        $service = new AddBudgetEntry($month, $reason, $category, $subCategory, $amount);
        $response = $service->add();

        // Assert
        $this->assertEquals('Budget added successfully', $response->getMsg());
        $this->assertEquals(HttpStatus::Success, $response->getStatus());
        $this->assertDatabaseHas('budgets', [
            'month' => $month,
            'amount' => $amount
        ], 'sqlite');
    }

    public function test_add_duplicate_budget_entry_fails()
    {
        // Setup
        $month = '2023-10';
        $reason = 'Test Reason';
        $category = 'Test Category';
        $subCategory = 'Test SubCategory';
        $amount = 1000;

        // Create master data
        Reason::create(['name' => $reason]);
        Category::create(['name' => $category]);
        SubCategory::create(['name' => $subCategory]);

        // Add first entry
        $service1 = new AddBudgetEntry($month, $reason, $category, $subCategory, $amount);
        $service1->add();

        // Action: Add second entry with same details
        $service2 = new AddBudgetEntry($month, $reason, $category, $subCategory, $amount);
        $response = $service2->add();

        // Assert
        $this->assertEquals('Budget already planned for reason', $response->getMsg());
        $this->assertEquals(HttpStatus::ValidationError, $response->getStatus());

        // Ensure only one entry exists
        $this->assertEquals(1, Budget::where('month', $month)->count());
    }
}
