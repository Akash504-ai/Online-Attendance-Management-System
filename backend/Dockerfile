# ✅ Use official PHP with Apache
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# ✅ Install PDO + MySQL drivers
RUN apt-get update && apt-get install -y libzip-dev unzip \
    && docker-php-ext-install pdo pdo_mysql \
    && docker-php-ext-enable pdo_mysql

# ✅ Enable Apache modules
RUN a2enmod rewrite headers

# ✅ Global CORS config
RUN echo '\n\
<IfModule mod_headers.c>\n\
  Header always set Access-Control-Allow-Origin "*"\n\
  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"\n\
</IfModule>\n' > /etc/apache2/conf-available/cors.conf \
  && a2enconf cors

# ✅ Fix Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# ✅ Copy backend code
COPY . /var/www/html

# ✅ Permissions
RUN chown -R www-data:www-data /var/www/html

# ✅ Expose port
EXPOSE 80

# ✅ Start Apache
CMD ["apache2-foreground"]
