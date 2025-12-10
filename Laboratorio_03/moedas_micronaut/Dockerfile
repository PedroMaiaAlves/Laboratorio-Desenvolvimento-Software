# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copiar arquivos de configuração do Maven primeiro (para cache de dependências)
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# Baixar dependências (cache layer - otimiza builds futuros)
RUN mvn dependency:go-offline -B || true

# Copiar código fonte
COPY src ./src

# Compilar e criar o JAR
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Criar usuário não-root para segurança
RUN addgroup -S appuser && adduser -S appuser -G appuser
USER appuser:appuser

# Copiar o JAR da aplicação do stage de build
COPY --from=build /app/target/*.jar app.jar

# Expor a porta (Render usa a variável PORT)
EXPOSE 8080

# Comando para executar a aplicação
# Render injeta a variável PORT automaticamente
ENTRYPOINT ["java", "-jar", "app.jar"]

