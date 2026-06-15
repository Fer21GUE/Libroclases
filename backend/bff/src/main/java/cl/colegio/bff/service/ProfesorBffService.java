package cl.colegio.bff.service;

import cl.colegio.bff.client.AttendanceClient;
import cl.colegio.bff.client.GradesClient;
import cl.colegio.bff.client.UsersClient;
import cl.colegio.bff.dto.*;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.List;

@Service
public class ProfesorBffService {
    private final UsersClient usersClient;
    private final GradesClient gradesClient;
    private final AttendanceClient attendanceClient;

    public ProfesorBffService(UsersClient usersClient, GradesClient gradesClient, AttendanceClient attendanceClient) {
        this.usersClient = usersClient;
        this.gradesClient = gradesClient;
        this.attendanceClient = attendanceClient;
    }

    public Mono<ProfesorDashboardResponse> obtenerDashboard(Long usuarioId, String authorization) {
        return usersClient.obtenerPerfil(usuarioId, authorization)
                .flatMap(perfil -> {
                    if (perfil.profesorId() == null) {
                        return Mono.just(new ProfesorDashboardResponse(perfil, List.of(), List.of(), List.of(), List.of(), List.of(), List.of()));
                    }
                    return Mono.zip(
                            usersClient.cursosPorProfesor(perfil.profesorId(), authorization),
                            gradesClient.notasPorProfesor(perfil.profesorId(), authorization),
                            gradesClient.evaluacionesPorProfesor(perfil.profesorId(), authorization),
                            attendanceClient.asistenciaPorProfesor(perfil.profesorId(), authorization)
                    ).map(t -> new ProfesorDashboardResponse(perfil, t.getT1(), List.of(), List.of(), t.getT2(), t.getT3(), t.getT4()));
                });
    }

    public Mono<List<AlumnoDto>> alumnosPorCurso(Long cursoId, String authorization) {
        return usersClient.alumnosPorCurso(cursoId, authorization);
    }

    public Mono<NotaDto> registrarNota(NotaCreateBffRequest request, String authorization) {
        return usersClient.obtenerPerfil(request.profesorUsuarioId(), authorization)
                .flatMap(perfil -> {
                    if (perfil.profesorId() == null) {
                        return Mono.error(new IllegalArgumentException("El usuario no tiene perfil de profesor."));
                    }
                    NotaCreateInternalRequest internal = new NotaCreateInternalRequest(
                            request.alumnoId(),
                            request.cursoId(),
                            perfil.profesorId(),
                            request.asignatura(),
                            request.nota(),
                            request.descripcion()
                    );
                    return gradesClient.crearNota(internal, authorization);
                });
    }

    public Mono<AsistenciaDto> registrarAsistencia(AsistenciaCreateRequest request, String authorization) {
        return usersClient.obtenerPerfil(request.profesorUsuarioId(), authorization)
                .flatMap(perfil -> {
                    if (perfil.profesorId() == null) {
                        return Mono.error(new IllegalArgumentException("El usuario no tiene perfil de profesor."));
                    }
                    AsistenciaCreateInternalRequest internal = new AsistenciaCreateInternalRequest(
                            request.alumnoId(),
                            request.cursoId(),
                            perfil.profesorId(),
                            request.fecha(),
                            request.estado(),
                            request.observacion(),
                            request.presente()
                    );
                    return attendanceClient.registrarAsistencia(internal, authorization);
                });
    }

    public Mono<EvaluacionDto> crearEvaluacion(EvaluacionCreateBffRequest request, String authorization) {
        return usersClient.obtenerPerfil(request.profesorUsuarioId(), authorization)
                .flatMap(perfil -> {
                    if (perfil.profesorId() == null) {
                        return Mono.error(new IllegalArgumentException("El usuario no tiene perfil de profesor."));
                    }
                    EvaluacionCreateInternalRequest internal = new EvaluacionCreateInternalRequest(
                            request.cursoId(),
                            perfil.profesorId(),
                            request.asignatura(),
                            request.titulo(),
                            request.descripcion(),
                            request.fecha(),
                            request.hora(),
                            request.tipo()
                    );
                    return gradesClient.crearEvaluacion(internal, authorization);
                });
    }
}
