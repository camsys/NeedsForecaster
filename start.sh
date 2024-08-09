#!/bin/sh

export MB_DB_TYPE=postgres
export MB_DB_DBNAME=metabaseappdb
export MB_DB_PORT=5432
export MB_DB_USER=metabase
export MB_DB_PASS=metabase
export MB_DB_HOST=`cat BOOT-INF/classes/application-$ENV.properties | grep "spring.datasource.url" | awk -F 'postgresql://' '{print $2}' | cut -d ":" -f 1`

echo "Connecting to Metabase DB at $MB_DB_HOST"

java -Xms1g -Xmx2g -Duser.timezone=America/New_York -jar metabase.jar &
java -Xms1g -Xmx2g -Duser.timezone=America/New_York org.springframework.boot.loader.JarLauncher --spring.profiles.active=${ENV}
