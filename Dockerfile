FROM php:8.1-fpm

# تثبيت المتطلبات
RUN apt-get update && apt-get install -y \
    git curl zip unzip libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# نسخ ملفات المشروع
WORKDIR /var/www
COPY . .

# إعطاء صلاحيات للمجلدات
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
