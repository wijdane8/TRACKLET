<?php

namespace App\Http\Controllers;

use App\Models\Log;

class LogController extends Controller
{
    public function index()
{
    try {
        // Load logs with the associated expense and income details
        $logs = Log::with(['expense', 'user', 'income'])->get(); // Ensure 'income' is included
        
        // Return the logs as JSON for the API
        return response()->json($logs, 200);
        
    } catch (\Exception $e) {
        return response()->json(['message' => 'Failed to fetch logs'], 500);
    }
}

}
