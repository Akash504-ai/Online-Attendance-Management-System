# Use official PHP 8.2 image with Apache
FROM php:8.2-apache

# Install required system dependencies and PostgreSQL PDO driver
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo_pgsql pgsql

# Enable Apache modules (rewrite + headers)
RUN a2enmod headers rewrite

# Prevent Apache domain warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Copy backend files
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html/

# Expose port 80
EXPOSE 80

# Start Apache server
CMD ["apache2-foreground"]
