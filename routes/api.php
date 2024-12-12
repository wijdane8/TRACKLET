<?php

use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\AccountTypeController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\LogController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\IncomeController;

// Authentication routes
Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register')->name('api.auth.register');
    Route::post('/login', 'login')->name('api.auth.login');
    Route::post('/reset/otp', 'resetOtp')->name('api.auth.reset.otp');
    Route::post('/reset/password', 'resetPassword')->name('api.auth.reset.password');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/otp', 'otp')->name('api.auth.otp');
        Route::post('/verify', 'verify')->name('api.auth.verify');
        Route::post('/logout', 'logout')->name('api.auth.logout');
    });
});


Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('incomes')->group(function() {
        Route::post('/', [IncomeController::class, 'store']); // Create an income
        Route::get('/{userId}', [IncomeController::class, 'index']); // Get incomes for a user
        Route::put('/{id}', [IncomeController::class, 'update']); // Update an income
        Route::delete('/{id}', [IncomeController::class, 'destroy']); // Delete an income
    });
});
Route::get('/finance/overview/{userId}', [FinanceController::class, 'overview']);




Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [ProfileController::class, 'show']); // Fetch user info
    Route::put('/user', [ProfileController::class, 'update']); // Update user info
    Route::put('/user/password', [ProfileController::class, 'updatePassword']); // Update password
});


// Expense routes
Route::middleware('auth:sanctum')->controller(ExpenseController::class)->group(function () {
    Route::get('/all-expenses', 'index')->name('expenses.index'); // List all expenses
    Route::post('/expenses', 'store')->name('expenses.store'); // Add an expense
    Route::get('/expenses/{id}', 'show')->name('expenses.show'); // View an expense
    Route::put('/expenses/{id}', 'update')->name('expenses.update'); // Update an expense
    Route::delete('/expenses/{id}', 'destroy')->name('expenses.destroy'); // Delete an expense
    Route::get('/logs', 'logs')->name('expenses.logs'); // View logs for an expense
});


// Account Type routes
Route::middleware('auth:sanctum')->controller(AccountTypeController::class)->group(function () {
    Route::get('/account-types', 'index')->name('api.account.type.index');
    Route::get('/account-types/{id}', 'show')->name('api.account.type.show');
});

// Account routes
Route::middleware('auth:sanctum')->controller(AccountController::class)->group(function () {
    Route::get('/accounts', 'index')->name('api.account.index');
    Route::get('/accounts/{id}', 'show')->name('api.account.show');
    Route::post('/accounts', 'store')->name('api.account.store');
    Route::patch('/accounts/{id}', 'update')->name('api.account.update');
    Route::delete('/accounts/{id}', 'destroy')->name('api.account.destroy');
    // Route::get('/account-types', [AccountTypeController::class, 'index']);
    // Route::get('/currencies', [CurrencyController::class, 'index']);

});


