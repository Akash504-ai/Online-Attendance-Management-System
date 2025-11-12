FROM thecodingmachine/php:8.2-v4-apache

# Switch to root to install extensions
USER root

# Install PostgreSQL PDO driver (Render-safe)
RUN apt-get update && apt-get install -y libpq-dev \
    && install-php-extensions pdo_pgsql pgsql

# Enable Apache modules
RUN a2enmod rewrite headers

# Add global CORS config
RUN echo '\n<IfModule mod_headers.c>\n  Header always set Access-Control-Allow-Origin "*"\n  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"\n</IfModule>\n' \
    > /etc/apache2/conf-available/cors.conf && a2enconf cors

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . /var/www/html

# Fix Apache warnings
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Fix permissions
RUN chown -R www-data:www-data /var/www/html

# Switch back to safe user
USER www-data
