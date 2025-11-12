# ✅ Use PHP 8.2 with Apache (includes build tools)
FROM php:8.2-apache-bullseye

ENV DEBIAN_FRONTEND=noninteractive

# ✅ Install PostgreSQL extensions the guaranteed way
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql \
    && docker-php-ext-enable pdo_pgsql pgsql \
    && php -m | grep -E "pgsql|pdo_pgsql" || (echo '❌ PostgreSQL driver not loaded' && exit 1)

# ✅ Enable Apache modules
RUN a2enmod headers rewrite

# ✅ Global CORS configuration
RUN echo '<IfModule mod_headers.c>\n\
  Header always set Access-Control-Allow-Origin "*"\n\
  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"\n\
</IfModule>\n' > /etc/apache2/conf-available/cors.conf \
  && a2enconf cors

# ✅ Fix Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# ✅ Copy your backend files
COPY . /var/www/html/

# ✅ Set working directory
WORKDIR /var/www/html/

# ✅ Expose Apache default port
EXPOSE 80

# ✅ Start Apache
CMD ["apache2-foreground"]
