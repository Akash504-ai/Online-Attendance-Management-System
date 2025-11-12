# ✅ Uses PHP 8.2 + Apache + all PDO drivers preinstalled
FROM thecodingmachine/php:8.2-v4-apache

# ✅ Set working directory
WORKDIR /var/www/html

# ✅ Copy backend files
COPY . /var/www/html

# ✅ Enable Apache modules
RUN a2enmod rewrite headers

# ✅ Fix Apache warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# ✅ Add global CORS headers
RUN echo '<IfModule mod_headers.c>\n\
  Header always set Access-Control-Allow-Origin "*"\n\
  Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
  Header always set Access-Control-Allow-Headers "Content-Type, Authorization"\n\
</IfModule>' > /etc/apache2/conf-available/cors.conf && a2enconf cors

# ✅ Expose port 80 (Render auto-detects)
EXPOSE 80

# ✅ Start Apache
CMD ["apache2-foreground"]
