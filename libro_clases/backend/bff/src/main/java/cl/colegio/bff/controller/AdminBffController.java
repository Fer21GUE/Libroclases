package cl.colegio.bff.controller;

import cl.colegio.bff.dto.AdminDashboardResponse;
import cl.colegio.bff.service.AdminBffService;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/bff/admin")
public class AdminBffController {
    private final AdminBffService adminBffService;

    public AdminBffController(AdminBffService adminBffService) {
        this.adminBffService = adminBffService;
    }

    @GetMapping("/dashboard")
    public Mono<AdminDashboardResponse> dashboard(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return adminBffService.obtenerDashboard(authorization);
    }
}
