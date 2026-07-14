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
messaging-service: 8086
```

## Usuarios

```
admin@colegio.cl / Admin123 / Administrador
mesotop@colegio.cl / S12345678-5 / Profesor 1
caperezs@colegio.cl / P11111111-1 / Profesor 2
mirojasd@colegio.cl / R22222222-2 / Alumno 1
vpfloress@colegio.cl / F33333333-3 / Alumno 2
pegonzalezr@colegio.cl / G44444444-4 / Apoderado 1

