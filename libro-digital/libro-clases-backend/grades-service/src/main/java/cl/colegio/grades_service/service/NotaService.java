package cl.colegio.grades_service.service;

import cl.colegio.grades_service.dto.NotaCreateRequest;
import cl.colegio.grades_service.entity.Nota;
import cl.colegio.grades_service.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotaService {
    private final NotaRepository notaRepository; private final AlumnoRepository alumnoRepository; private final CursoRepository cursoRepository; private final ProfesorRepository profesorRepository;
    public NotaService(NotaRepository notaRepository, AlumnoRepository alumnoRepository, CursoRepository cursoRepository, ProfesorRepository profesorRepository){this.notaRepository=notaRepository;this.alumnoRepository=alumnoRepository;this.cursoRepository=cursoRepository;this.profesorRepository=profesorRepository;}
    public List<Nota> listar(){return notaRepository.findAll();}
    public List<Nota> listarPorAlumno(Long alumnoId){return notaRepository.findByAlumnoId(alumnoId);}
    public Nota crear(NotaCreateRequest r){
        Nota n=new Nota(); n.setAlumno(alumnoRepository.findById(r.getAlumnoId()).orElseThrow(() -> new IllegalArgumentException("Alumno no encontrado.")));
        if(r.getCursoId()!=null)n.setCurso(cursoRepository.findById(r.getCursoId()).orElse(null));
        if(r.getProfesorId()!=null)n.setProfesor(profesorRepository.findById(r.getProfesorId()).orElse(null));
        n.setAsignatura(r.getAsignatura()); n.setNota(r.getNota()); n.setDescripcion(r.getDescripcion()); return notaRepository.save(n);
    }
}
