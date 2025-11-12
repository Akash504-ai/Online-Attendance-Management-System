# ✅ Use prebuilt PHP + Apache image (already has rewrite + headers)
FROM thecodingmachine/php:8.2-v4-apache

# Switch to root to install pgsql extensions
USER root
WORKDIR /var/www/html

# ✅ Install PostgreSQL PDO drivers
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo_pgsql pgsql \
    && docker-php-ext-enable pdo_pgsql pgsql

# ✅ Copy backend code
COPY . /var/www/html

# ✅ Add CORS config directly into Apache
RUN echo '\n\
<IfModule mod_headers.c>\n\
  Header always set Access-Control-Allow-Origin "*"\n\
  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"\n\
</IfModule>\n' >> /etc/apache2/apache2.conf

# ✅ Fix Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# ✅ Permissions for app
RUN chown -R www-data:www-data /var/www/html

# ✅ Switch back to safe user
USER docker

EXPOSE 80
CMD ["apache2-foreground"]
