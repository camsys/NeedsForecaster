# NeedsForecaster

The second of the new independent Asset Cloud modules.

# Developer Notes

1. Clone CSAssetCloud repo

This is needed because NeedsForecaster references CSAssetCloud/Core.

`mvn clean install`

2. Clone NeedsForecaster repo

You will need to set up your own database and database credentials.  See below.

```
mvn clean package -U
java -jar target/NeedsForecaster-<version from pom>.jar
``` 

3. To package just rebuilding Java and not React code (which can be slow):

`mvn clean package -Dskip.npm`

4. To run the React development server:
```
cd src/main/js/src
npm run start
```

# Local Database Setup
- Install pgAdmin if not installed (https://www.pgadmin.org/download/)
- In pgAdmin, drill down into 'Servers -> localhost' on the left
- Right-click 'Databases', then click 'Create -> Database...'
- In the dialog box, enter 'needs_forecaster_dev' in the 'Database' field and click 'Save'
- In the codebase, open `src/main/resources/application.properties`
- Fill in the following configuration variables accordingly:
```
spring.datasource.url=jdbc:postgresql://localhost:5432/needs_forecaster_dev
spring.datasource.username={username used to create the database in pgAdmin}
spring.datasource.password={password for above username}
```
