@extends('layouts.app')

@section('content')
<h1>Expenses</h1>
<a href="{{ route('expenses.create') }}" class="btn btn-primary">Add Expense</a>

<form action="{{ route('expenses.search') }}" method="GET" class="mt-3">
    <input type="text" name="query" placeholder="Search..." class="form-control">
</form>

<table class="table mt-3">
    <thead>
        <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        @foreach($expenses as $expense)
        <tr>
            <td>{{ $expense->amount }}</td>
            <td>{{ $expense->category }}</td>
            <td>{{ $expense->date }}</td>
            <td>{{ $expense->description }}</td>
            <td>
                <a href="{{ route('expenses.edit', $expense->id) }}" class="btn btn-warning">Edit</a>
                <form action="{{ route('expenses.destroy', $expense->id) }}" method="POST" style="display:inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
                </form>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>

{{ $expenses->links() }}
@endsection
