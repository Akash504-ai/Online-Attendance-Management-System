FROM thecodingmachine/php:8.2-v4-apache

# Switch to root user
USER root

# Enable PostgreSQL extensions (already included in this image)
RUN docker-php-ext-enable pdo_pgsql pgsql 2>/dev/null || true

# Enable Apache modules
RUN a2enmod rewrite headers

# Add CORS configuration
RUN echo '\n<IfModule mod_headers.c>\n  Header always set Access-Control-Allow-Origin "*"\n  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"\n</IfModule>\n' \
    > /etc/apache2/conf-available/cors.conf && a2enconf cors

# Set working directory
WORKDIR /var/www/html

# Copy all project files
COPY . /var/www/html

# Add ServerName to fix Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Fix permissions
RUN chown -R www-data:www-data /var/www/html

# Switch back to www-data for safety
USER www-data
