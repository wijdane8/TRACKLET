<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLogsTable extends Migration
{

    public function up()
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('expense_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('action_type'); // Action type like create, update, etc.
            $table->text('description')->nullable(); // Optional description
            $table->string('ip_address')->nullable(); // IP address of the user
            $table->timestamp('timestamp')->useCurrent(); // Defaults to current timestamp
            $table->timestamps(); // Laravel's created_at and updated_at fields
        });
        
    }

    public function down()
    {
        Schema::dropIfExists('logs');
    }

}
