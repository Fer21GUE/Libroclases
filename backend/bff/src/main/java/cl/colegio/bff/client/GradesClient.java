package cl.colegio.bff.client;

import cl.colegio.bff.dto.EvaluacionCreateInternalRequest;
import cl.colegio.bff.dto.EvaluacionDto;
import cl.colegio.bff.dto.NotaCreateInternalRequest;
import cl.colegio.bff.dto.NotaDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.function.Consumer;

@Component
public class GradesClient {
    private final WebClient webClient;

    public GradesClient(WebClient.Builder builder, @Value("${services.grades.url}") String gradesUrl) {
        this.webClient = builder.baseUrl(gradesUrl).build();
    }

    public Mono<List<NotaDto>> listarNotas(String authorization) {
        return webClient.get()
                .uri("/api/grades")
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<NotaDto>>() {})
                .onErrorReturn(List.of());
    }

    public Mono<List<NotaDto>> notasPorAlumno(Long alumnoId, String authorization) {
        return webClient.get()
                .uri("/api/grades/alumno/{alumnoId}", alumnoId)
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<NotaDto>>() {})
                .onErrorReturn(List.of());
    }

    public Mono<List<NotaDto>> notasPorProfesor(Long profesorId, String authorization) {
        return webClient.get()
                .uri("/api/grades/profesor/{profesorId}", profesorId)
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<NotaDto>>() {})
                .onErrorReturn(List.of());
    }

    public Mono<NotaDto> crearNota(NotaCreateInternalRequest request, String authorization) {
        return webClient.post()
                .uri("/api/grades")
                .headers(relayAuth(authorization))
                .bodyValue(request)
                .retrieve()
                .bodyToMono(NotaDto.class);
    }

    public Mono<List<EvaluacionDto>> evaluacionesPorAlumno(Long alumnoId, String authorization) {
        return webClient.get()
                .uri("/api/grades/evaluaciones/alumno/{alumnoId}", alumnoId)
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<EvaluacionDto>>() {})
                .onErrorReturn(List.of());
    }

    public Mono<List<EvaluacionDto>> evaluacionesPorProfesor(Long profesorId, String authorization) {
        return webClient.get()
                .uri("/api/grades/evaluaciones/profesor/{profesorId}", profesorId)
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<EvaluacionDto>>() {})
                .onErrorReturn(List.of());
    }

    public Mono<EvaluacionDto> crearEvaluacion(EvaluacionCreateInternalRequest request, String authorization) {
        return webClient.post()
                .uri("/api/grades/evaluaciones")
                .headers(relayAuth(authorization))
                .bodyValue(request)
                .retrieve()
                .bodyToMono(EvaluacionDto.class);
    }

    private Consumer<HttpHeaders> relayAuth(String authorization) {
        return headers -> {
            if (authorization != null && !authorization.isBlank()) {
                headers.set(HttpHeaders.AUTHORIZATION, authorization);
            }
        };
    }
}
