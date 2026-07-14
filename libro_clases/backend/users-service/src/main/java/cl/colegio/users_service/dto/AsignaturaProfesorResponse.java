package cl.colegio.users_service.dto;

public class AsignaturaProfesorResponse {

    private Long id;
    private String nombre;

    public AsignaturaProfesorResponse(
            Long id,
            String nombre
    ) {
        this.id = id;
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }
}