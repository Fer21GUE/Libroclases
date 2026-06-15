# Libro de Clases Digital

## Estructura

```
libro-digital-limpio
├── database
├── backend
│   ├── api-gateway
│   ├── auth-service
│   ├── users-service
│   ├── grades-service
│   ├── attendance-service
│   └── bff
├── frontend
```
## Ejecución

1. Crear la base `libro_clases` en PostgreSQL.
2. Ejecutar `database/libro_clases.sql`.
3. Levantar los servicios en terminales separadas.

```
cd backend\auth-service
.\mvnw.cmd spring-boot:run
```

```
cd backend\users-service
.\mvnw.cmd spring-boot:run
```

```
cd backend\grades-service
.\mvnw.cmd spring-boot:run
```

```
cd backend\attendance-service
.\mvnw.cmd spring-boot:run
```

```
cd backend\bff
.\mvnw.cmd spring-boot:run
```

```
cd backend\api-gateway
.\mvnw.cmd spring-boot:run
```

```
cd frontend
npm install
npm run dev
```

## Puertos

```
auth-service: 8081
users-service: 8082
grades-service: 8083
bff: 8084
attendance-service: 8085
api-gateway: 8080
frontend: 5173
```

## Usuarios

```
admin@colegio.cl / Admin123
profesor@colegio.cl / Profesor123
profesor2@colegio.cl / Profesor123
alumno@colegio.cl / Alumno123
alumno2@colegio.cl / Alumno123
apoderado@colegio.cl / Apoderado123
```
