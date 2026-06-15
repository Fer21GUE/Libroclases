package cl.colegio.bff.client;

import cl.colegio.bff.dto.AsistenciaCreateInternalRequest;
import cl.colegio.bff.dto.AsistenciaDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.function.Consumer;

@Component
public class AttendanceClient {
    private final WebClient webClient;

    public AttendanceClient(WebClient.Builder builder, @Value("${services.attendance.url}") String attendanceUrl) {
        this.webClient = builder.baseUrl(attendanceUrl).build();
    }

    public Mono<List<AsistenciaDto>> asistenciaPorAlumno(Long alumnoId, String authorization) {
        return webClient.get()
                .uri("/api/attendance/alumno/{alumnoId}", alumnoId)
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<AsistenciaDto>>() {})
                .onErrorReturn(List.of());
    }

    public Mono<List<AsistenciaDto>> asistenciaPorProfesor(Long profesorId, String authorization) {
        return webClient.get()
                .uri("/api/attendance/profesor/{profesorId}", profesorId)
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<AsistenciaDto>>() {})
                .onErrorReturn(List.of());
    }

    public Mono<AsistenciaDto> registrarAsistencia(AsistenciaCreateInternalRequest request, String authorization) {
        return webClient.post()
                .uri("/api/attendance")
                .headers(relayAuth(authorization))
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AsistenciaDto.class);
    }

    private Consumer<HttpHeaders> relayAuth(String authorization) {
        return headers -> {
            if (authorization != null && !authorization.isBlank()) {
                headers.set(HttpHeaders.AUTHORIZATION, authorization);
            }
        };
    }
}
