# ✅ Start from same PHP + Apache base
FROM thecodingmachine/php:8.2-v4-apache

USER root
WORKDIR /var/www/html

# ✅ Install PostgreSQL driver (the missing part!)
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && docker-php-ext-enable pdo_pgsql pgsql \
    && php -m | grep pgsql || (echo '❌ PGSQL not loaded!' && exit 1)

# ✅ Enable Apache modules
RUN a2enmod rewrite headers || true

# ✅ Add global CORS
RUN printf '%s\n' '<IfModule mod_headers.c>' \
  '  Header always set Access-Control-Allow-Origin "*"' \
  '  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"' \
  '  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"' \
  '</IfModule>' > /etc/apache2/conf-available/cors.conf \
  && a2enconf cors || true

# ✅ Copy backend files
COPY . /var/www/html

# ✅ Set file permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]
