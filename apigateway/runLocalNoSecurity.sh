#!/bin/bash
mvn clean -X spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=local,no-security"
