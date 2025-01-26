<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CreditCardController;
use App\Http\Controllers\DashiController;
use App\Http\Controllers\DueController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\InvestmentController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\Master\CategoryController;
use App\Http\Controllers\Master\ReasonController;
use App\Http\Controllers\Master\StorageController;
use App\Http\Controllers\Master\SubCategoryController;
use App\Http\Controllers\ReturnsController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\TallyController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\SetSqliteConfigMiddleware;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::get('login', function () {
    return response()->json(["status" => "unauthorised"], 401);
})->name('login');

Route::prefix('auth')->group(function () {
    Route::post('check', [AuthController::class, 'checkToken']);
    Route::prefix('otp')->group(function () {
        Route::post('get', [AuthController::class, 'getLoginOTP']);
        Route::post('verify', [AuthController::class, 'validateLoginOTP']);
    });
});

Route::middleware(['auth:api', SetSqliteConfigMiddleware::class])->group(function () {
    Route::resource('reason', ReasonController::class, ['only' => ['index']]);
    Route::resource('category', CategoryController::class, ['only' => ['index']]);
    Route::resource('pay_mode', CategoryController::class, ['only' => ['index']]);
    Route::resource('investments', InvestmentController::class, ['only' => ['index', 'create']]);
    Route::get('investments/monthly/get', [InvestmentController::class, 'subCategoryMonthWise']);
    Route::get('investments/list', [InvestmentController::class, 'list']);
    Route::patch('investment/hide', [InvestmentController::class, 'hide']);
    Route::patch('investment/unhide', [InvestmentController::class, 'unHide']);
    Route::resource('storage', StorageController::class, ['only' => ['index', 'store']]);
    Route::post('storage/transfer', [StorageController::class, 'transfer']);
    Route::get('storage/report', [StorageController::class, 'report']);
    Route::resource('dues', DueController::class, ['only' => ['index', 'store', 'destroy']]);
    Route::get('dues/month', [DueController::class, 'month']);
    Route::resource('returns', ReturnsController::class, ['only' => ['index', 'store', 'destroy']]);
    Route::resource('creditCard', CreditCardController::class, ['only' => ['index', 'store']]);

    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::prefix('register')->group(function () {
        Route::get('user/details/get', [UserController::class, 'getUserDetails']);
        Route::post('user/details/update', [UserController::class, 'updateDetails']);
        Route::get('loans/list', [SetupController::class, 'loanList']);
        Route::post('loans/add', [SetupController::class, 'addLoan']);
        Route::post('status/update', [SetupController::class, 'updateRegisterStatus']);
        Route::get('loans/list', [SetupController::class, 'loanList']);
    });
    Route::prefix('expense')->group(function () {
        Route::get('add', [ExpenseController::class, 'initData']);
        Route::post('add', [ExpenseController::class, 'add']);
        Route::put('{id}/update', [ExpenseController::class, 'update']);
        Route::delete('{id}', [ExpenseController::class, 'delete']);
        Route::get('get/{date}', [ExpenseController::class, 'getByDate']);
        Route::get('report/individual', [ExpenseController::class, 'individualReport']);
        Route::get('fillable', [ExpenseController::class, 'fillable']);
    });
    Route::prefix('income')->group(function () {
        Route::get('add', [IncomeController::class, 'initData']);
        Route::post('add', [IncomeController::class, 'add']);
        Route::put('{id}/update', [IncomeController::class, 'update']);
        Route::delete('{id}', [IncomeController::class, 'delete']);
        Route::get('get/{month}', [IncomeController::class, 'getByMonth']);
        Route::get('report/individual', [IncomeController::class, 'individualReport']);
        Route::get('fillable', [IncomeController::class, 'fillable']);
    });
    Route::prefix('tally')->group(function () {
        Route::get('report', [TallyController::class, 'report']);
    });
    Route::prefix('budget')->group(function () {
        Route::post('reorder', [BudgetController::class, 'reOrder']);
        Route::post('copy', [BudgetController::class, 'copyPreviousMonth']);
    });
    Route::resource('loan', LoanController::class);
    Route::resource('budget', BudgetController::class);
    Route::resource('subCategory', SubCategoryController::class);
    Route::resource('dashi', DashiController::class);
});


