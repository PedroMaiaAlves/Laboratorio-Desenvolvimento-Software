# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /home/app

# Copy project files (pointing to the subfolder)
COPY "Laboratorio_03/moedas_micronaut/pom.xml" ./pom.xml
COPY "Laboratorio_03/moedas_micronaut/.mvn" ./.mvn
COPY "Laboratorio_03/moedas_micronaut/mvnw" ./mvnw
COPY "Laboratorio_03/moedas_micronaut/mvnw.bat" ./mvnw.bat
COPY "Laboratorio_03/moedas_micronaut/src" ./src

# Build the application
RUN ./mvnw package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the final JAR from the build stage
COPY --from=build /home/app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]