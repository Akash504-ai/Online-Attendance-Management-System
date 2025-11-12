# Use official PHP 8.2 image with Apache
FROM php:8.2-apache

# Prevent interactive prompts during install
ENV DEBIAN_FRONTEND=noninteractive

# Update system and install dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && docker-php-ext-enable pdo_pgsql pgsql

# Enable Apache modules
RUN a2enmod headers rewrite

# Fix Apache hostname warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Copy backend files
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html/

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
