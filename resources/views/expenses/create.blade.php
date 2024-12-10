@extends('layouts.app')

@section('content')
<h1>Add Expense</h1>
<form action="{{ route('expenses.store') }}" method="POST">
    @csrf
    <input type="number" name="amount" placeholder="Amount" class="form-control" required>
    <input type="text" name="category" placeholder="Category" class="form-control mt-2" required>
    <textarea name="description" placeholder="Description" class="form-control mt-2" required></textarea>
    <input type="date" name="date" class="form-control mt-2" required>
    <button type="submit" class="btn btn-success mt-2">Add Expense</button>
</form>
@endsection
