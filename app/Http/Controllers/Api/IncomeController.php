<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Income;
use App\Models\Log; // Import the Log model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IncomeController extends Controller
{
    /**
     * Store a new income
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'source' => 'required|string',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'recurrence' => 'required|in:once,weekly,monthly,yearly',
        ]);

        $income = new Income();
        $income->user_id = auth()->id();
        $income->amount = $validated['amount'];
        $income->source = $validated['source'];
        $income->description = $validated['description'];
        $income->date = $validated['date'];
        $income->recurrence = $validated['recurrence'];
        $income->save();

        // Log the action for create
        $this->logAction('create', "Created new income with ID: {$income->id}", $income);

        return response()->json(['message' => 'Income added successfully!', 'data' => $income], 201);
    }

    /**
     * Get a paginated list of incomes for the specified user
     */
    public function index(Request $request, $userId)
    {
        $query = Income::where('user_id', $userId);

        if ($request->has('source')) {
            $query->where('source', 'LIKE', "%{$request->source}%");
        }

        if ($request->has('date_from') && $request->has('date_to')) {
            $query->whereBetween('date', [$request->date_from, $request->date_to]);
        }

        if ($request->has('sort')) {
            $query->orderBy($request->sort, $request->get('direction', 'asc'));
        }

        $incomes = $query->paginate(10);

        return response()->json($incomes);
    }

    /**
     * Update an income record
     */
    public function update(Request $request, $id)
    {
        $income = Income::findOrFail($id);
        $income->update($request->all());

        // Log the action for update
        $this->logAction('update', "Updated income with ID: $id", $income);

        return response()->json(['message' => 'Income updated successfully', 'data' => $income], 200);
    }

    /**
     * Delete an income record
     */
    public function destroy($id)
    {
        $income = Income::findOrFail($id);
        $incomeId = $income->id;

        $income->delete();

        // Log the action for delete
        $this->logAction('delete', "Deleted income with ID: $incomeId");

        return response()->json(['message' => 'Income deleted successfully'], 200);
    }

    /**
     * Logs an action performed on an income record
     */
    private function logAction($actionType, $description, $income = null)
    {
        Log::create([
            'user_id' => Auth::id(),
            'income_id' => $income ? $income->id : null, // Set income_id if available
            'action_type' => $actionType,
            'description' => $description,
            'ip_address' => request()->ip(),
            'timestamp' => now(), // Current timestamp
        ]);
    }

    /**
     * Get logs related to incomes for the authenticated user
     */
    public function logs()
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $logs = Log::with(['user', 'income']) // Eager load relationships
            ->where('user_id', $userId)
            ->latest()
            ->get();

        return response()->json($logs);
    }
}
