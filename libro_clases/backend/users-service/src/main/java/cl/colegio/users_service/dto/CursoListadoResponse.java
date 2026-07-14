package cl.colegio.users_service.dto;

import java.util.List;

public class CursoListadoResponse {

    private Long id;
    private String nombre;
    private String nivel;
    private List<String> profesoresAsignados;

    public CursoListadoResponse(
            Long id,
            String nombre,
            String nivel,
            List<String> profesoresAsignados
    ) {
        this.id = id;
        this.nombre = nombre;
        this.nivel = nivel;
        this.profesoresAsignados = profesoresAsignados;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getNivel() {
        return nivel;
    }

    public List<String> getProfesoresAsignados() {
        return profesoresAsignados;
    }
}