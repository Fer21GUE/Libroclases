# Arquitectura MVC adaptada y BFF

El backend mantiene una arquitectura por capas en cada microservicio Spring.

```txt
Controller -> Service -> Repository -> Base de datos
```

El componente `bff` corre en el puerto 8084 y orquesta las respuestas que consume el frontend.

## Servicios

```txt
auth-service: 8081
users-service: 8082
grades-service: 8083
bff: 8084
attendance-service: 8085
api-gateway: 8080
```

## Gateway

```txt
/api/auth/** -> auth-service
/api/users/** -> users-service
/api/courses/** -> users-service
/api/grades/** -> grades-service
/api/bff/** -> bff
/api/attendance/** -> attendance-service
```

## BFF

```txt
GET /api/bff/admin/dashboard
GET /api/bff/profesor/{usuarioId}/dashboard
GET /api/bff/alumno/{usuarioId}/dashboard
GET /api/bff/apoderado/{usuarioId}/dashboard
POST /api/bff/profesor/asistencia
POST /api/bff/profesor/evaluaciones
```

El frontend consume el gateway y el BFF, no los servicios internos de forma directa.
