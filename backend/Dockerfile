FROM php:8.2-apache

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_mysql \
    && docker-php-ext-enable pdo_mysql

RUN a2enmod rewrite headers

RUN echo '\n\
<IfModule mod_headers.c>\n\
  Header always set Access-Control-Allow-Origin "*"\n\
  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"\n\
</IfModule>\n' > /etc/apache2/conf-available/cors.conf \
    && a2enconf cors

COPY . /var/www/html

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]
