<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Income;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashoardIEController extends Controller
{
    public function overview(Request $request)
    {
        // Get the authenticated user
        $user = Auth::user();

        // Check if the user is authenticated
        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated'
            ], 401);
        }

        // Fetch incomes and expenses only for the authenticated user
        $incomes = $user->incomes()->latest()->get(); // Assumes a relationship method 'incomes' exists
        $expenses = $user->expenses()->latest()->get();

        // Calculate totals for the authenticated user
        $totalIncome = $incomes->sum('amount');  // Sum of 'amount' for incomes
        $totalExpense = $expenses->sum('amount'); // Sum of 'amount' for expenses
        $balance = $totalIncome - $totalExpense;

        // Return response as JSON
        return response()->json([
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'balance' => $balance,
            'incomes' => $incomes,
            'expenses' => $expenses,
        ], 200);
    }
}
