import {
  jsPDF
} from 'jspdf';

const obtenerFechaEnEspañol = () => {
  return new Intl.DateTimeFormat(
    'es-CL',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }
  ).format(new Date());
};

const limpiarNombreArchivo = (
  texto
) => {
  return texto
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(
      /[^a-zA-Z0-9]+/g,
      '_'
    )
    .replace(
      /^_+|_+$/g,
      ''
    );
};

export const generarCertificadoAlumnoRegular = (
  alumno
) => {
  if (!alumno) {
    throw new Error(
      'No se encontró la información del alumno.'
    );
  }

  if (!alumno.nombre) {
    throw new Error(
      'El alumno no tiene un nombre registrado.'
    );
  }

  if (!alumno.cursoNombre) {
    throw new Error(
      'El alumno no tiene un curso asignado.'
    );
  }

  const documento = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const anchoPagina =
    documento.internal.pageSize.getWidth();

  const margenIzquierdo = 28;
  const margenDerecho = 28;

  const anchoTexto =
    anchoPagina -
    margenIzquierdo -
    margenDerecho;

  const fecha =
    obtenerFechaEnEspañol();

  documento.setProperties({
    title:
      'Certificado de alumno regular',
    subject:
      'Certificado de alumno regular',
    author:
      'Colegio Bernardo O\'Higgins',
    creator:
      'Sistema Libro Digital'
  });

  documento.setDrawColor(
    25,
    67,
    98
  );

  documento.setLineWidth(0.8);

  documento.rect(
    14,
    14,
    anchoPagina - 28,
    269
  );

  documento.setFont(
    'helvetica',
    'bold'
  );

  documento.setFontSize(15);

  documento.text(
    'COLEGIO BERNARDO O\'HIGGINS',
    anchoPagina / 2,
    31,
    {
      align: 'center'
    }
  );

  documento.setFont(
    'helvetica',
    'normal'
  );

  documento.setFontSize(10);

  documento.text(
    'Unidad académica ',
    anchoPagina / 2,
    38,
    {
      align: 'center'
    }
  );

  documento.setDrawColor(
    170,
    180,
    190
  );

  documento.setLineWidth(0.3);

  documento.line(
    margenIzquierdo,
    45,
    anchoPagina -
      margenDerecho,
    45
  );

  documento.setFont(
    'helvetica',
    'bold'
  );

  documento.setFontSize(16);

  documento.text(
    'CERTIFICADO DE ALUMNO REGULAR',
    anchoPagina / 2,
    67,
    {
      align: 'center'
    }
  );

  const anchoTitulo =
    documento.getTextWidth(
      'CERTIFICADO DE ALUMNO REGULAR'
    );

  documento.setLineWidth(0.35);

  documento.line(
    anchoPagina / 2 -
      anchoTitulo / 2,
    69,
    anchoPagina / 2 +
      anchoTitulo / 2,
    69
  );

  documento.setFont(
    'helvetica',
    'normal'
  );

  documento.setFontSize(10);

  documento.text(
    `Santiago, ${fecha}`,
    anchoPagina -
      margenDerecho,
    83,
    {
      align: 'right'
    }
  );

  documento.setFontSize(12);

  const primerParrafo =
    'La Dirección del Colegio Bernardo O\'Higgins certifica que:';

  documento.text(
    primerParrafo,
    margenIzquierdo,
    105
  );

  documento.setFont(
    'helvetica',
    'bold'
  );

  documento.setFontSize(13);

  documento.text(
    alumno.nombre.toUpperCase(),
    anchoPagina / 2,
    124,
    {
      align: 'center'
    }
  );

  documento.setFont(
    'helvetica',
    'normal'
  );

  documento.setFontSize(12);

    const textoAlumno =
        `se encuentra matriculado y es alumno regular del curso ${alumno.cursoNombre}, durante el año académico ${new Date().getFullYear()}.`;

    const lineasAlumno =
        documento.splitTextToSize(
            textoAlumno,
            anchoTexto
        );

  documento.text(
    lineasAlumno,
    margenIzquierdo,
    143,
    {
      align: 'justify',
      maxWidth: anchoTexto,
      lineHeightFactor: 1.7
    }
  );

  const textoFinal =
    'Se extiende el presente certificado a petición del apoderado, para los fines que estime convenientes.';

  const lineasFinal =
    documento.splitTextToSize(
      textoFinal,
      anchoTexto
    );

  documento.text(
    lineasFinal,
    margenIzquierdo,
    178,
    {
      align: 'justify',
      maxWidth: anchoTexto,
      lineHeightFactor: 1.7
    }
  );

  documento.setDrawColor(
    70,
    80,
    90
  );

  documento.setLineWidth(0.3);

  documento.line(
    72,
    235,
    138,
    235
  );

  documento.setFont(
    'helvetica',
    'bold'
  );

  documento.setFontSize(11);

  documento.text(
    'DIRECCIÓN',
    anchoPagina / 2,
    242,
    {
      align: 'center'
    }
  );

  documento.setFont(
    'helvetica',
    'normal'
  );

  documento.setFontSize(10);

  documento.text(
    'Colegio Bernardo O\'Higgins',
    anchoPagina / 2,
    248,
    {
      align: 'center'
    }
  );

  documento.setFontSize(8);

  documento.setTextColor(
    90,
    100,
    110
  );

  documento.text(
    'Documento generado electrónicamente por el sistema institucional.',
    anchoPagina / 2,
    270,
    {
      align: 'center'
    }
  );

  const nombreArchivo =
    limpiarNombreArchivo(
      alumno.nombre
    );

  documento.save(
    `certificado_alumno_regular_${nombreArchivo}.pdf`
  );
};