# Build myapp server Docker container
FROM coreos/apache
MAINTAINER t.girault@gmail.com

# Copie des sources dans le r�pertoire www
COPY app /var/www/