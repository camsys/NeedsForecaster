#!/bin/sh

java -Xms1g -Xmx2g -Duser.timezone=America/New_York -Dspring.datasource.url=${DB_URL} -Dspring.datasource.password=${DB_PASSWORD} org.springframework.boot.loader.JarLauncher --spring.profiles.active=${ENV}
