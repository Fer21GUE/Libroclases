package cl.colegio.bff.service;

import cl.colegio.bff.client.GradesClient;
import cl.colegio.bff.client.UsersClient;
import cl.colegio.bff.dto.AdminDashboardResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class AdminBffService {
    private final UsersClient usersClient;
    private final GradesClient gradesClient;

    public AdminBffService(UsersClient usersClient, GradesClient gradesClient) {
        this.usersClient = usersClient;
        this.gradesClient = gradesClient;
    }

    public Mono<AdminDashboardResponse> obtenerDashboard(String authorization) {
        return Mono.zip(
                usersClient.listarUsuarios(authorization),
                usersClient.listarCursos(authorization),
                gradesClient.listarNotas(authorization)
        ).map(t -> new AdminDashboardResponse(t.getT1().size(), t.getT2().size(), t.getT3().size(), 0));
    }
}
