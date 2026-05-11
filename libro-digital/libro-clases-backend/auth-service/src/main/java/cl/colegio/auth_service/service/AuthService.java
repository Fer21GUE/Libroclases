package cl.colegio.auth_service.service;

import cl.colegio.auth_service.dto.LoginRequest;
import cl.colegio.auth_service.dto.LoginResponse;
import cl.colegio.auth_service.entity.Usuario;
import cl.colegio.auth_service.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(request.getEmail().trim())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas."));

        if (usuario.getActivo() != null && !usuario.getActivo()) {
            throw new IllegalArgumentException("Usuario desactivado.");
        }

        String stored = usuario.getPassword();
        boolean matches = stored != null && stored.startsWith("$2")
                ? passwordEncoder.matches(request.getPassword(), stored)
                : request.getPassword().equals(stored);

        if (!matches) {
            throw new IllegalArgumentException("Credenciales inválidas.");
        }

        // Si venía desde el script antiguo con contraseña plana, la actualizamos a BCrypt.
        if (stored != null && !stored.startsWith("$2")) {
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
            usuarioRepository.save(usuario);
        }

        String token = jwtService.generateToken(usuario);
        return new LoginResponse(token, usuario.getId(), usuario.getNombre(), usuario.getEmail(), normalizeRole(usuario.getRol()));
    }

    private String normalizeRole(String rol) {
        return rol == null ? "" : rol.trim().toLowerCase();
    }
}
