<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordRequest extends FormRequest
{
    public function rules()
    {
        return [
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed', // 'confirmed' checks the field 'new_password_confirmation'
        ];
    }
}
