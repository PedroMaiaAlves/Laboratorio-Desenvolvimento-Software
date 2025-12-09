# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /home/app

# Copy the Maven project files
COPY pom.xml ./
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.bat .

# Copy the source code
COPY src ./src

# Build the application and create the JAR file
# Using -DskipTests to speed up the build process in CI/CD environments
RUN mvn package -DskipTests

# Stage 2: Create the final lightweight image
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /home/app/target/moedas-0.1.jar .

# Expose the port the application runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "moedas-0.1.jar"]