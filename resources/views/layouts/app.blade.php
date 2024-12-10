<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Laravel App')</title>
    <!-- Add CSS or JS Links Here -->
</head>
<body>
    <header>
        <h1>My Laravel App</h1>
    </header>

    <main>
        @yield('content') <!-- Content will be injected here -->
    </main>

    <footer>
        <p>Footer content</p>
    </footer>
</body>
</html>
