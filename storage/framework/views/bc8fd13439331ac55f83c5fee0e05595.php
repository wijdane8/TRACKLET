<?php $__env->startSection('content'); ?>
<h1>Expenses</h1>
<a href="<?php echo e(route('expenses.create')); ?>" class="btn btn-primary">Add Expense</a>

<form action="<?php echo e(route('expenses.search')); ?>" method="GET" class="mt-3">
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
        <?php $__currentLoopData = $expenses; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $expense): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <tr>
            <td><?php echo e($expense->amount); ?></td>
            <td><?php echo e($expense->category); ?></td>
            <td><?php echo e($expense->date); ?></td>
            <td><?php echo e($expense->description); ?></td>
            <td>
                <a href="<?php echo e(route('expenses.edit', $expense->id)); ?>" class="btn btn-warning">Edit</a>
                <form action="<?php echo e(route('expenses.destroy', $expense->id)); ?>" method="POST" style="display:inline;">
                    <?php echo csrf_field(); ?>
                    <?php echo method_field('DELETE'); ?>
                    <button type="submit" class="btn btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
                </form>
            </td>
        </tr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </tbody>
</table>

<?php echo e($expenses->links()); ?>

<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /Users/wijdan/Downloads/saff-api/resources/views/expenses/index.blade.php ENDPATH**/ ?>