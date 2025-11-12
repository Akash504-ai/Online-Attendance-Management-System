# ✅ Use official PHP + Apache image
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# ✅ Install extensions (PostgreSQL PDO + CORS support)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && docker-php-ext-enable pdo_pgsql pgsql

# ✅ Enable Apache modules
RUN a2enmod rewrite headers

# ✅ Add global CORS config
RUN echo '\n\
<IfModule mod_headers.c>\n\
  Header always set Access-Control-Allow-Origin "*"\n\
  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"\n\
</IfModule>\n' > /etc/apache2/conf-available/cors.conf \
    && a2enconf cors

# ✅ Copy your backend code
COPY . /var/www/html

# ✅ Fix Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# ✅ File permissions
RUN chown -R www-data:www-data /var/www/html

# ✅ Expose port
EXPOSE 80

# ✅ Start Apache
CMD ["apache2-foreground"]
