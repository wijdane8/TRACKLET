<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    /**
     * Get all expenses for the authenticated user
     */
    public function index()
{
    $expenses = Auth::user()->expenses()->latest()->get();
    $totalExpense = $expenses->sum('amount'); // Calculate total expense

    return response()->json([
        'message' => 'Expenses retrieved successfully',
        'data' => $expenses,
        'total_expense' => $totalExpense,
    ], 200);
}


    /**
     * Get a specific expense for the authenticated user
     */
    public function show($id)
    {
        $expense = Auth::user()->expenses()->findOrFail($id);

        // Log the action for view
        $this->logAction('view', "Viewed expense with ID: $id", $expense);

        return response()->json([
            'message' => 'Expense retrieved successfully',
            'data' => $expense,
        ], 200);
    }

    /**
     * Store a new expense
     */
    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required|string',
            'amount' => 'required|numeric',
            'category' => 'required|string',
            'date' => 'required|date',
        ]);

        $expense = Auth::user()->expenses()->create($request->all());

        // Log the action for create
        $this->logAction('create', "Created new expense with ID: {$expense->id}", $expense);

        return response()->json(['data' => $expense], 201);
    }

    /**
     * Update an existing expense for the authenticated user
     */
    public function update(Request $request, $id)
    {
        $expense = Auth::user()->expenses()->findOrFail($id); // Ensure user owns the expense
        $expense->update($request->all());

        // Log the action for update
        $this->logAction('update', "Updated expense with ID: $id", $expense);

        return response()->json(['data' => $expense], 200);
    }

    /**
     * Delete an expense for the authenticated user
     */
    public function destroy($id)
{
    // Find the expense by ID
    $expense = Auth::user()->expenses()->findOrFail($id);
    
    // Capture the expense ID before deleting
    $expenseId = $expense->id;

    // Delete the expense
    $expense->delete();

    // Log the action for delete with the captured expense ID
    $this->logAction('delete', "Deleted expense with ID: $expenseId");

    return response()->json(['message' => 'Expense deleted successfully'], 200);
}


    /**
     * Helper method to log actions related to expenses
     */
    private function logAction($actionType, $description, $expense = null)
    {
        Log::create([
            'user_id' => Auth::id(),
            'expense_id' => $expense ? $expense->id : null,
            'action_type' => $actionType,
            'description' => $description,
            'ip_address' => request()->ip(),
            'timestamp' => now(), // Current timestamp
        ]);
    }
    public function logs()
    {
        $userId = Auth::id(); // Get the authenticated user's ID

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        $logs = Log::with(['user', 'expense']) // Eager load relationships
            ->where('user_id', $userId) // Filter by the current user's ID
            ->latest() // Sort logs by the latest
            ->get();
    
        return response()->json($logs);
}
}
