<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('incomes', function (Blueprint $table) {
            $table->enum('recurrence', ['once', 'weekly', 'monthly', 'yearly'])->default('once');
        });
    }

    public function down()
    {
        Schema::table('incomes', function (Blueprint $table) {
            $table->dropColumn('recurrence');
        });
    }
};
