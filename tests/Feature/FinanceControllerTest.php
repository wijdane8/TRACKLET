<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Income;
use App\Models\Expense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinanceControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test the overview API endpoint.
     */
    public function test_finance_overview_returns_correct_data()
    {
        // Create a user
        $user = User::factory()->create();

        // Create incomes for the user
        Income::factory()->createMany([
            ['user_id' => $user->id, 'amount' => 100],
            ['user_id' => $user->id, 'amount' => 200],
        ]);

        // Create expenses for the user
        Expense::factory()->createMany([
            ['user_id' => $user->id, 'amount' => 50],
            ['user_id' => $user->id, 'amount' => 30],
        ]);

        // Send a GET request to the overview endpoint
        $response = $this->getJson("/api/finance/overview/{$user->id}");

        // Assert the response is OK
        $response->assertStatus(200);

        // Assert the structure of the response
        $response->assertJsonStructure([
            'incomes',
            'expenses',
            'total_income',
            'total_expense',
            'balance',
        ]);

        // Assert the content of the response
        $response->assertJson([
            'total_income' => 300, // 100 + 200
            'total_expense' => 80, // 50 + 30
            'balance' => 220, // 300 - 80
        ]);
    }

    /**
     * Test the overview API endpoint when no data exists.
     */
    public function test_finance_overview_returns_zero_for_empty_data()
    {
        // Create a user
        $user = User::factory()->create();

        // Send a GET request to the overview endpoint
        $response = $this->getJson("/api/finance/overview/{$user->id}");

        // Assert the response is OK
        $response->assertStatus(200);

        // Assert the structure of the response
        $response->assertJsonStructure([
            'incomes',
            'expenses',
            'total_income',
            'total_expense',
            'balance',
        ]);

        // Assert the content of the response
        $response->assertJson([
            'total_income' => 0,
            'total_expense' => 0,
            'balance' => 0,
        ]);
    }
}
