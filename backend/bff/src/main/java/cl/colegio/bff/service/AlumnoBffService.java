package cl.colegio.bff.service;

import cl.colegio.bff.client.AttendanceClient;
import cl.colegio.bff.client.GradesClient;
import cl.colegio.bff.client.UsersClient;
import cl.colegio.bff.dto.*;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Map;

@Service
public class AlumnoBffService {
    private final UsersClient usersClient;
    private final GradesClient gradesClient;
    private final AttendanceClient attendanceClient;

    public AlumnoBffService(UsersClient usersClient, GradesClient gradesClient, AttendanceClient attendanceClient) {
        this.usersClient = usersClient;
        this.gradesClient = gradesClient;
        this.attendanceClient = attendanceClient;
    }

    public Mono<AlumnoDashboardResponse> obtenerDashboard(Long usuarioId, String authorization) {
        return usersClient.obtenerPerfil(usuarioId, authorization)
                .flatMap(perfil -> {
                    if (perfil.alumnoId() == null) {
                        return Mono.just(new AlumnoDashboardResponse(perfil, List.of(), List.of(), List.of(), List.of(), java.math.BigDecimal.ZERO, java.math.BigDecimal.ZERO));
                    }
                    return Mono.zip(
                            gradesClient.notasPorAlumno(perfil.alumnoId(), authorization),
                            attendanceClient.asistenciaPorAlumno(perfil.alumnoId(), authorization),
                            gradesClient.evaluacionesPorAlumno(perfil.alumnoId(), authorization)
                    ).map(t -> new AlumnoDashboardResponse(
                            perfil,
                            t.getT1(),
                            t.getT2(),
                            List.of(),
                            t.getT3(),
                            ResumenUtils.promedioNotas(t.getT1()),
                            ResumenUtils.porcentajeAsistencia(t.getT2())
                    ));
                });
    }

    public Mono<AlumnoDetalleResponse> obtenerDetalleAlumno(AlumnoDto alumno, String authorization) {
        return Mono.zip(
                gradesClient.notasPorAlumno(alumno.id(), authorization),
                attendanceClient.asistenciaPorAlumno(alumno.id(), authorization),
                gradesClient.evaluacionesPorAlumno(alumno.id(), authorization)
        ).map(t -> new AlumnoDetalleResponse(
                alumno,
                t.getT1(),
                t.getT2(),
                t.getT3(),
                ResumenUtils.promedioNotas(t.getT1()),
                ResumenUtils.porcentajeAsistencia(t.getT2())
        ));
    }

    public Mono<Map<String, Object>> marcarMensajeLeido(Long mensajeId) {
        return Mono.just(Map.of("status", "ok", "mensajeId", mensajeId));
    }
}
