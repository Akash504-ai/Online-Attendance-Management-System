# ✅ Start with PHP 8.2 + Apache (includes everything)
FROM thecodingmachine/php:8.2-v4-apache

# Temporarily switch to root for setup
USER root

WORKDIR /var/www/html

# ✅ Install PostgreSQL PDO driver (the missing part)
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && docker-php-ext-enable pdo_pgsql pgsql

# ✅ Enable Apache modules (permission fix)
RUN bash -c "a2enmod rewrite || true" && bash -c "a2enmod headers || true"

# ✅ Add CORS globally
RUN printf '%s\n' '<IfModule mod_headers.c>' \
  '  Header always set Access-Control-Allow-Origin "*"' \
  '  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"' \
  '  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"' \
  '</IfModule>' > /etc/apache2/conf-available/cors.conf && a2enconf cors || true

# ✅ Copy your backend files
COPY . /var/www/html

# ✅ Permissions fix
RUN chown -R www-data:www-data /var/www/html

# ✅ Fix Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# ✅ Switch back to non-root for Render safety
USER docker

EXPOSE 80
CMD ["apache2-foreground"]
