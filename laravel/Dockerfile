# Use official PHP image with FPM and necessary extensions
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libzip-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libssl-dev \
    zip \
    unzip \
    git \
    curl \
    cron \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql pcntl

# Install and enable PHP zip extension
RUN docker-php-ext-install zip

# Octane's app server: Swoole (PECL extension, no external binary to version-match)
RUN pecl install swoole && docker-php-ext-enable swoole

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Laravel application
COPY . .

# Install dependencies
RUN composer install --no-dev --no-scripts --optimize-autoloader

# Laravel's scheduler cron (see app/Console/Kernel.php for job frequencies)
RUN cp docker/cron/laravel-scheduler /etc/cron.d/laravel-scheduler \
    && chmod 0644 /etc/cron.d/laravel-scheduler \
    && chmod +x docker/entrypoint.sh

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expose Octane's HTTP port
EXPOSE 8000

ENTRYPOINT ["docker/entrypoint.sh"]

# Start Octane (Swoole); entrypoint.sh also starts cron for the scheduler
CMD ["php", "artisan", "octane:start", "--server=swoole", "--host=0.0.0.0", "--port=8000"]
