# Use official PHP 8.2 Apache image
FROM php:8.2-apache

ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies and PostgreSQL PDO driver
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-configure pgsql --with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && docker-php-ext-enable pdo_pgsql pgsql \
    && php -m | grep -E "pgsql|pdo_pgsql" || (echo "❌ PostgreSQL extensions not loaded" && exit 1)

# Enable Apache modules
RUN a2enmod headers rewrite

# Fix Apache ServerName warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Copy backend files
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html/

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
