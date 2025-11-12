# ✅ Use a prebuilt image that already has PHP + PostgreSQL drivers
FROM bitnami/php-fpm:8.2

# Install Apache manually
USER root
RUN apt-get update && apt-get install -y apache2 libapache2-mod-fcgid && \
    a2enmod proxy_fcgi setenvif rewrite headers && \
    echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Enable CORS globally
RUN echo '<IfModule mod_headers.c>\n\
  Header always set Access-Control-Allow-Origin "*"\n\
  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"\n\
</IfModule>\n' > /etc/apache2/conf-available/cors.conf && a2enconf cors

# Copy your backend
COPY . /var/www/html/

WORKDIR /var/www/html/

# Apache runs on port 8080 in Bitnami images
EXPOSE 8080

CMD ["bash", "-c", "apachectl -D FOREGROUND"]
