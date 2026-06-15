package cl.colegio.bff.service;

import cl.colegio.bff.client.UsersClient;
import cl.colegio.bff.dto.*;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class ApoderadoBffService {
    private final UsersClient usersClient;
    private final AlumnoBffService alumnoBffService;

    public ApoderadoBffService(UsersClient usersClient, AlumnoBffService alumnoBffService) {
        this.usersClient = usersClient;
        this.alumnoBffService = alumnoBffService;
    }

    public Mono<ApoderadoDashboardResponse> obtenerDashboard(Long usuarioId, String authorization) {
        return usersClient.obtenerPerfil(usuarioId, authorization)
                .flatMap(perfil -> {
                    if (perfil.apoderadoId() == null) {
                        return Mono.just(new ApoderadoDashboardResponse(perfil, List.of(), List.of(), List.of(), null));
                    }
                    return usersClient.alumnosPorApoderado(perfil.apoderadoId(), authorization)
                            .flatMap(alumnos -> {
                                if (alumnos.isEmpty()) {
                                    return Mono.just(new ApoderadoDashboardResponse(perfil, alumnos, List.of(), List.of(), null));
                                }
                                return alumnoBffService.obtenerDetalleAlumno(alumnos.get(0), authorization)
                                        .map(detalle -> new ApoderadoDashboardResponse(perfil, alumnos, List.of(), List.of(), detalle));
                            });
                });
    }

    public Mono<AlumnoDetalleResponse> obtenerDetalleAlumno(Long alumnoId, String authorization) {
        return usersClient.alumnoPorId(alumnoId, authorization)
                .flatMap(alumno -> alumnoBffService.obtenerDetalleAlumno(alumno, authorization));
    }
}
