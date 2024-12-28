<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;

    // Specify the attributes that can be mass assigned
    protected $fillable = [
        'user_id',       // The user who performed the action
        'expense_id',    // The expense related to the action (nullable)
        'income_id',     // The income related to the action (nullable)
        'action_type',   // Type of action (create, update, delete, view)
        'description',   // A description of the action
        'ip_address',    // The IP address from which the action was performed
        'timestamp',     // Timestamp of when the action was performed
    ];

    /**
     * Relationship with the Expense model
     */
    public function expense()
    {
        return $this->belongsTo(Expense::class);
    }

    /**
     * Relationship with the Income model
     */
    public function income()
    {
        return $this->belongsTo(Income::class);
    }

    /**
     * Relationship with the User model
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
