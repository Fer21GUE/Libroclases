package cl.colegio.auth_service.config;

import cl.colegio.auth_service.entity.Usuario;
import cl.colegio.auth_service.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedAdmin(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!usuarioRepository.existsByEmailIgnoreCase("admin@colegio.cl")) {
                Usuario admin = new Usuario();
                admin.setNombre("Administrador");
                admin.setEmail("admin@colegio.cl");
                admin.setPassword(passwordEncoder.encode("Admin123"));
                admin.setRol("admin");
                admin.setActivo(true);
                usuarioRepository.save(admin);
            }
        };
    }
}
