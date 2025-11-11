# Use the official PHP 8.2 image with Apache
FROM php:8.2-apache

# Install required PHP extensions for PostgreSQL + PDO
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql

# Copy all backend files to the Apache web root
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html/

# Enable Apache mod_rewrite (useful for REST APIs)
RUN a2enmod rewrite

# Expose port 80 (Render automatically maps it)
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
