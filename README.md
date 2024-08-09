# NeedsForecaster

The second of the new independent Asset Cloud modules.

# Local Database Setup
- Install pgAdmin if not installed (https://www.pgadmin.org/download/)
- In pgAdmin, drill down into 'Servers -> localhost' on the left
- Right-click 'Databases', then click 'Create -> Database...'
- In the dialog box, enter 'needs_forecaster_dev' in the 'Database' field and click 'Save'
- In the codebase, open `src/main/resources/application.properties`
- Fill in the following configuration variables accordingly:
  spring.datasource.url=jdbc:postgresql://localhost:5432/needs_forecaster_dev 
  spring.datasource.username={username used to create the database in pgAdmin}
  spring.datasource.password={password for above username}
