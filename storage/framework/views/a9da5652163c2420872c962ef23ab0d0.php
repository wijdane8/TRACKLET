<?php $__env->startSection('content'); ?>
<h1>Add Expense</h1>
<form action="<?php echo e(route('expenses.store')); ?>" method="POST">
    <?php echo csrf_field(); ?>
    <input type="number" name="amount" placeholder="Amount" class="form-control" required>
    <input type="text" name="category" placeholder="Category" class="form-control mt-2" required>
    <textarea name="description" placeholder="Description" class="form-control mt-2" required></textarea>
    <input type="date" name="date" class="form-control mt-2" required>
    <button type="submit" class="btn btn-success mt-2">Add Expense</button>
</form>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /Users/wijdan/Downloads/saff-api/resources/views/expenses/create.blade.php ENDPATH**/ ?>