package cl.colegio.bff.client;

import cl.colegio.bff.dto.AlumnoDto;
import cl.colegio.bff.dto.CursoDto;
import cl.colegio.bff.dto.PerfilDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.function.Consumer;

@Component
public class UsersClient {
    private final WebClient webClient;

    public UsersClient(WebClient.Builder builder, @Value("${services.users.url}") String usersUrl) {
        this.webClient = builder.baseUrl(usersUrl).build();
    }

    public Mono<List<Object>> listarUsuarios(String authorization) {
        return webClient.get()
                .uri("/api/users")
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Object>>() {})
                .onErrorReturn(List.of());
    }

    public Mono<List<Object>> listarCursos(String authorization) {
        return webClient.get()
                .uri("/api/courses")
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Object>>() {})
                .onErrorReturn(List.of());
    }

    public Mono<PerfilDto> obtenerPerfil(Long usuarioId, String authorization) {
        return webClient.get()
                .uri("/api/users/perfil/{usuarioId}", usuarioId)
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(PerfilDto.class)
                .onErrorReturn(new PerfilDto(usuarioId, null, null, null, null, null, null, null, null, null));
    }

    public Mono<List<CursoDto>> cursosPorProfesor(Long profesorId, String authorization) {
        return webClient.get()
                .uri("/api/courses/profesor/{profesorId}", profesorId)
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<CursoDto>>() {})
                .onErrorReturn(List.of());
    }

    public Mono<List<AlumnoDto>> alumnosPorCurso(Long cursoId, String authorization) {
        return webClient.get()
                .uri("/api/courses/{cursoId}/alumnos", cursoId)
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<AlumnoDto>>() {})
                .onErrorReturn(List.of());
    }

    public Mono<AlumnoDto> alumnoPorId(Long alumnoId, String authorization) {
        return webClient.get()
                .uri("/api/courses/alumnos/{alumnoId}", alumnoId)
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(AlumnoDto.class);
    }

    public Mono<List<AlumnoDto>> alumnosPorApoderado(Long apoderadoId, String authorization) {
        return webClient.get()
                .uri("/api/courses/apoderado/{apoderadoId}/alumnos", apoderadoId)
                .headers(relayAuth(authorization))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<AlumnoDto>>() {})
                .onErrorReturn(List.of());
    }

    private Consumer<HttpHeaders> relayAuth(String authorization) {
        return headers -> {
            if (authorization != null && !authorization.isBlank()) {
                headers.set(HttpHeaders.AUTHORIZATION, authorization);
            }
        };
    }
}
