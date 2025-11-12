# Use a PHP image that already has Postgres drivers compiled
FROM php:8.2-apache-bullseye

ENV DEBIAN_FRONTEND=noninteractive

# Install the Postgres client libraries (runtime dependency)
RUN apt-get update && apt-get install -y libpq5 libpq-dev \
    && docker-php-ext-install pdo_pgsql pgsql \
    && php -m | grep -E "pgsql|pdo_pgsql" || (echo "❌ PostgreSQL extensions not loaded" && exit 1)

# Enable Apache modules
RUN a2enmod headers rewrite

# Silence Apache ServerName warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Copy your backend files
COPY . /var/www/html/

WORKDIR /var/www/html/

EXPOSE 80
CMD ["apache2-foreground"]
