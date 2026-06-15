export const calcularPromedioNotas = (notas = []) => {
  const valores = notas
    .map((nota) => Number(nota.nota))
    .filter((nota) => !Number.isNaN(nota));

  if (valores.length === 0) return 0;

  const total = valores.reduce((suma, nota) => suma + nota, 0);
  return Number((total / valores.length).toFixed(1));
};

export const agruparNotasPorAsignatura = (notas = []) => {
  const grupos = notas.reduce((acumulador, nota) => {
    const asignatura = nota.asignatura || 'Sin asignatura';
    if (!acumulador[asignatura]) acumulador[asignatura] = [];
    acumulador[asignatura].push(nota);
    return acumulador;
  }, {});

  return Object.entries(grupos)
    .map(([asignatura, notasAsignatura]) => ({
      asignatura,
      notas: notasAsignatura,
      promedio: calcularPromedioNotas(notasAsignatura)
    }))
    .sort((a, b) => a.asignatura.localeCompare(b.asignatura));
};

export const calcularPromedioGeneralAsignaturas = (grupos = []) => {
  const promedios = grupos
    .map((grupo) => Number(grupo.promedio))
    .filter((promedio) => !Number.isNaN(promedio) && promedio > 0);

  if (promedios.length === 0) return 0;

  const total = promedios.reduce((suma, promedio) => suma + promedio, 0);
  return Number((total / promedios.length).toFixed(1));
};
