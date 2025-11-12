# Use official PHP 8.2 Apache image
FROM php:8.2-apache

ENV DEBIAN_FRONTEND=noninteractive

# Update and install PostgreSQL PDO support
RUN apt-get update \
    && apt-get install -y libpq-dev \
    && docker-php-ext-configure pgsql --with-pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && docker-php-ext-enable pdo pdo_pgsql pgsql \
    && php -m | grep -E "pgsql|pdo_pgsql" || (echo "❌ pgsql not loaded" && exit 1)

# Enable Apache modules
RUN a2enmod headers rewrite

# Silence Apache domain warnings
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Copy your backend code
COPY . /var/www/html/

WORKDIR /var/www/html/

EXPOSE 80

CMD ["apache2-foreground"]
