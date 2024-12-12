<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Income;
use Illuminate\Http\Request;
use App\Http\Resources\IncomeResource;


class IncomeController extends Controller
{
    // Store a new income
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric',
            'source' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
        ]);
        
        $income = Income::create($request->all());
        
        return response()->json($income, 201);
    }
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

            return response()->json($query->paginate(10));
        }

    
    // Update an income record
    public function update(Request $request, $id)
    {
        $income = Income::findOrFail($id);

        $income->update($request->all());

        return response()->json($income);
    }

    // Delete an income record
    public function destroy($id)
    {
        $income = Income::findOrFail($id);
        $income->delete();

        return response()->json(['message' => 'Income deleted successfully']);
    }
}
