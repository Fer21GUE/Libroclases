package cl.colegio.bff.dto;

import java.util.List;

public record ApoderadoDashboardResponse(
        PerfilDto apoderado,
        List<AlumnoDto> alumnos,
        List<MensajeDto> mensajes,
        List<SolicitudDto> solicitudes,
        AlumnoDetalleResponse alumnoSeleccionado
) {}
