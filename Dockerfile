# Build myapp server Docker container
FROM coreos/apache
MAINTAINER t.girault@gmail.com

# Copie des sources dans le répertoire www
COPY app /var/www/