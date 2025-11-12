FROM php:8.2-apache

# Install PostgreSQL PDO extension directly
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-configure pdo_pgsql --with-pdo-pgsql \
    && docker-php-ext-install pdo_pgsql pgsql

# Enable Apache modules
RUN a2enmod rewrite headers

# Add CORS configuration
RUN echo '\n<IfModule mod_headers.c>\n  Header always set Access-Control-Allow-Origin "*"\n  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"\n</IfModule>\n' \
    > /etc/apache2/conf-available/cors.conf && a2enconf cors

# Set working directory
WORKDIR /var/www/html

# Copy all source files
COPY . /var/www/html

# Fix Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Set file permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]
