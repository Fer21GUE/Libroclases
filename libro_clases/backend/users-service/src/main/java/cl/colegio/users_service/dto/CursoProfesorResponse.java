package cl.colegio.users_service.dto;

public class CursoProfesorResponse {
    private Long id;
    private String nombre;
    private String nivel;
    private String asignatura;
    private Long profesorId;
    private String profesorNombre;
    private Long totalAlumnos;
    private String diaSemana;
    private String horario;
    private String sala;
    private Integer anio;
    private String letra;

    public CursoProfesorResponse(Long id, String nombre, String nivel, String asignatura, Long profesorId, String profesorNombre, Long totalAlumnos) {
        this.id = id;
        this.nombre = nombre;
        this.nivel = nivel;
        this.asignatura = asignatura;
        this.profesorId = profesorId;
        this.profesorNombre = profesorNombre;
        this.totalAlumnos = totalAlumnos;
        this.diaSemana = "";
        this.horario = "";
        this.sala = "";
        this.anio = java.time.LocalDate.now().getYear();
        this.letra = "";
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getNivel() { return nivel; }
    public String getAsignatura() { return asignatura; }
    public Long getProfesorId() { return profesorId; }
    public String getProfesorNombre() { return profesorNombre; }
    public Long getTotalAlumnos() { return totalAlumnos; }
    public String getDiaSemana() { return diaSemana; }
    public String getHorario() { return horario; }
    public String getSala() { return sala; }
    public Integer getAnio() { return anio; }
    public String getLetra() { return letra; }
}
