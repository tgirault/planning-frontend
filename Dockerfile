# Build myapp server Docker container
FROM httpd:2.4
MAINTAINER t.girault@gmail.com

# Copie des sources dans le répertoire apache
COPY app /usr/local/apache2/htdocs