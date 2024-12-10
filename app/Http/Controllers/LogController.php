<?php

namespace App\Http\Controllers;

use App\Models\Log;

class LogController extends Controller
{
    public function index()
    {
        try {
            $logs = Log::with(['expense', 'user'])->get(); // Assuming relationships exist in Log model

            // For API response
            return response()->json($logs, 200);

            // If rendering in a view:
            // return view('logs.index', ['logs' => $logs]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch logs'], 500);
        }
    }
}
