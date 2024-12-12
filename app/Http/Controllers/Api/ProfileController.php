<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile.
     *
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        return response()->json([
            'user' => Auth::user(),
        ]);
    }

    /**
     * Update the authenticated user's profile.
     *
     * @param  \App\Http\Requests\UpdateUserRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request)
    {
        $user = Auth::user();

        $user->update([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
        ]);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user,
        ]);
    }

    /**
     * Reset the authenticated user's password.
     *
     * @param  \App\Http\Requests\UpdatePasswordRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = Auth::user();

        // Check if the current password matches
        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 400);
        }

        // Update the password
        $user->update([
            'password' => Hash::make($request->input('new_password')),
        ]);

        return response()->json([
            'message' => 'Password reset successfully.',
        ]);
    }
}
