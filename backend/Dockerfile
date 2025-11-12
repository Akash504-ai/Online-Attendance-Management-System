# ✅ Use official PHP 8.2 image with Apache
FROM php:8.2-apache

ENV DEBIAN_FRONTEND=noninteractive

# ✅ Install Postgres PDO extensions properly
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-configure pdo_pgsql --with-pdo-pgsql \
    && docker-php-ext-install pdo_pgsql pgsql \
    && docker-php-ext-enable pdo_pgsql pgsql \
    && php -m | grep -E "pgsql|pdo_pgsql" || (echo '❌ PostgreSQL driver not loaded!' && exit 1)

# ✅ Enable Apache modules
RUN a2enmod headers rewrite

# ✅ Silence Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# ✅ Copy backend code into container
COPY . /var/www/html/

# ✅ Set working directory
WORKDIR /var/www/html/

# ✅ Expose port 80
EXPOSE 80

# ✅ Start Apache server
CMD ["apache2-foreground"]
