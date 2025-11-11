# Use the official PHP 8.2 image with Apache preinstalled
FROM php:8.2-apache

# Copy all backend files to the Apache web root
COPY . /var/www/html/

# Enable common PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Expose port 80 (Render will automatically map it)
EXPOSE 80

# Start Apache server
CMD ["apache2-foreground"]
