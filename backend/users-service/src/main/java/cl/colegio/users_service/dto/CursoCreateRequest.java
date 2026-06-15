package cl.colegio.users_service.dto;

import jakarta.validation.constraints.NotBlank;

public class CursoCreateRequest {
    @NotBlank private String nombre;
    private String nivel;
    private Long profesorJefeId;
    public String getNombre(){return nombre;} public void setNombre(String nombre){this.nombre=nombre;}
    public String getNivel(){return nivel;} public void setNivel(String nivel){this.nivel=nivel;}
    public Long getProfesorJefeId(){return profesorJefeId;} public void setProfesorJefeId(Long profesorJefeId){this.profesorJefeId=profesorJefeId;}
}
