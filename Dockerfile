# Dockerfile for development server | Inspired by: https://github.com/romeOz/docker-apache-php/blob/master/7.3/Dockerfile
FROM ubuntu:bionic
MAINTAINER mc17uulm <marco.combosch@uni-ulm.de>

ENV OS_LOCALE="en_US.UTF-8"
ENV PHP_VERSION="7.3"
RUN apt-get update && apt-get install -y locales && locale-gen ${OS_LOCALE}
ENV LANG=${OS_LOCALE} \
    LANGUAGE={OS_LOCALE} \
    LC_ALL=${OS_LOCALE}} \
    DEBIAN_FRONTEND=noninteractive

ENV APACHE_CONF_DIR=/etc/apache2 \
    PHP_CONF_DIR=/etc/php/${PHP_VERSION} \
    PHP_DATA_DIR=/var/lib/php \
    NVM_DIR=/usr/local/NVM_DIR \
    NODE_VERSION=4.4.7 

COPY ./conf/webserver/entrypoint.sh /sbin/entrypoint.sh        

SHELL ["/bin/bash", "-c"]
RUN \
    BUILD_DEPS='software-properties-common' \
    && dpkg-reconfigure locales \
    && apt-get install --no-install-recommends -y $BUILD_DEPS \
    && add-apt-repository -y ppa:ondrej/php \
    && add-apt-repository -y ppa:ondrej/apache2 \
    && apt-get update \
    # Install Apache & php
    && apt-get install -y curl apache2 libapache2-mod-php${PHP_VERSION} php${PHP_VERSION}-cli php${PHP_VERSION}-readlin php${PHP_VERSION}-mbstring php${PHP_VERSION}-zip php${PHP_VERSION}-intl php${PHP_VERSION}-xml php${PHP_VERSION}-json php${PHP_VERSION}-curl php${PHP_VERSION}-gd php${PHP_VERSION}-pgsql php${PHP_VERSION}-mysql php-pear \
    # Apache settings
    && cp /dev/null ${APACHE_CONF_DIR}/conf-available/other-vhosts-access-log.conf \
    && rm ${APACHE_CONF_DIR}/sites-enabled/000-default.conf ${APACHE_CONF_DIR}/sites-available/000-default.conf \
    && a2enmod rewrite php${PHP_VERSION} \
    # Install composer
    && curl -sS https://getcomposer.org/installer | php -- --version=1.8.4 --install-dir=/usr/local/bin --filename=composer \
    # TODO: installing node, npm, babel, webpack, nodemon, etc.
    && curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash \
    && source ${NVM_DIR}/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default \
    # Cleaning
    && apt-get purge -y --auto-remove $BUILD_DEPS \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/* \
    # Forward request and error logs to docker log collector
    && ln -sf /dev/stdout /var/log/apache2/access.log \
    && ln -sf /dev/stderr /var/log/apache2/error.log \
    && chmod 755 /sbin/entrypoint.sh \
    && chown www-data:www-data ${PHP_DATA_DIR} -Rf

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN node -v
RUN npm -v

COPY ./conf/webserver/apache2.conf ${APACHE_CONF_DIR}/apache2.conf
COPY ./conf/webserver/hosts.conf ${APACHE_CONF_DIR}/sites-enabled/hosts.conf
COPY ./conf/webserver/php.ini ${PHP_CONF_DIR}/apache2/conf.d/custom.installing

EXPOSE 80 443

CMD ["/sbin/entrypoint.sh"]