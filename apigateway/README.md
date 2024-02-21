# Kickstarter-API-Gateway


### Project setup in folder run:
```
mvn install
```

### For clean code run in the /apigateway folder after making changes before committing:


```
mvn spotless:apply
```

### IntelliJ Local Environment Configuration
First under Run click on Edit Configurations Create a new application with the name: ```kiwi-apigateway```

Add the path to your JAVA JRE 17: ```C:\Program Files\Java\jre-17.0.7```

Then fill with JAVA main class as follows: ```de.muenchen.kiwi.ApiGatewayApplication```

Click Modify Options and Add VM options to add the Spring profile: ```-Dspring.profiles.active=local```

Set the working directory to the entire frontend: ```C:\user\your_username\projects\```

Add IDE environmental variables:
```
ALLOWED_ORIGINS_CLOUD_GATEWAY;
ALLOWED_ORIGINS_MANAGEMENT;
BACKEND_URI;
FILTERS_REWRITE_PATH;
PREDICATES_PATH;
REALM;
```

Run the api-gateway. Should be running at http://localhost:8082.

