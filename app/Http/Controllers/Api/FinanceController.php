<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Income;
use App\Models\Expense;

class FinanceController extends Controller
{
    public function overview($userId)
    {
        $incomes = Income::where('user_id', $userId)->get();
        $expenses = Expense::where('user_id', $userId)->get();

        $totalIncome = $incomes->sum('amount');
        $totalExpense = $expenses->sum('amount');
        $balance = $totalIncome - $totalExpense;

        return response()->json([
            'incomes' => $incomes,
            'expenses' => $expenses,
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'balance' => $balance
        ]);
    }
}
