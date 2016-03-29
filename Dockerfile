# Build myapp server Docker container
FROM httpd
MAINTAINER t.girault@gmail.com

# Copie des sources dans le répertoire apache
COPY app /usr/local/apache2/src/