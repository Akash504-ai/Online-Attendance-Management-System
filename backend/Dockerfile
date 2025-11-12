# Use PHP image with common extensions preinstalled
FROM thecodingmachine/php:8.2-v4-apache

# Ensure we run admin commands as root
USER root

# Set working directory
WORKDIR /var/www/html

# Copy backend files into container
COPY . /var/www/html

# Enable Apache modules (must run as root)
RUN a2enmod rewrite headers || true

# Add ServerName to suppress warnings
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Add global CORS config safely
RUN printf '%s\n' '<IfModule mod_headers.c>' \
  '  Header always set Access-Control-Allow-Origin "*"' \
  '  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"' \
  '  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"' \
  '</IfModule>' > /etc/apache2/conf-available/cors.conf \
  && a2enconf cors || true

# Make sure web files are readable and writable by www-data if needed
RUN chown -R www-data:www-data /var/www/html || true
RUN find /var/www/html -type d -exec chmod 755 {} \; || true
RUN find /var/www/html -type f -exec chmod 644 {} \; || true

# Optional: add a quick phpinfo for debugging (remove later)
RUN printf "<?php\nphpinfo();\n" > /var/www/html/phpinfo.php

# Expose port 80 and run Apache in foreground
EXPOSE 80

# Switch back to default user (optional). If image expects root to run apache, you can keep root.
USER root

CMD ["apache2-foreground"]
