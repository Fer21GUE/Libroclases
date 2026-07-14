import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import AdminPageLayout
  from '../../components/AdminLayout.jsx';

import {
  createUser,
  getUsers,
  updateUserActive
} from '../../api/usersApi.js';

import {
  getAsignaturas,
  getCourses
} from '../../api/coursesApi.js';

const initialForm = {
  nombre: '',
  apellidos: '',
  rut: '',
  email: '',
  password: '',
  rol: 'alumno',
  codigoProfesor: '',
  asignaturaIds: [],
  codigoAlumno: '',
  cursoId: '',
  telefono: ''
};

const initialErrors = {
  nombre: '',
  apellidos: '',
  rut: '',
  email: '',
  password: '',
  codigoProfesor: '',
  asignaturas: '',
  codigoAlumno: '',
  telefono: ''
};

const quitarTildes = (texto) => {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const normalizarParaCorreo = (texto) => {
  return quitarTildes(texto)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
};

const limpiarNombre = (texto) => {
  return texto
    .replace(/[^\p{L}\s'-]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/'{2,}/g, "'")
    .replace(/-{2,}/g, '-');
};

const limpiarCodigo = (texto) => {
  return texto
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '');
};

const limpiarTelefono = (texto) => {
  return texto
    .replace(/\D/g, '')
    .slice(0, 9);
};

const separarApellidos = (apellidos) => {
  const partes = apellidos
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return {
    apellidoPaterno: partes[0] || '',
    apellidoMaterno:
      partes.slice(1).join(' ')
  };
};

const formatearRut = (valor) => {
  const limpio = valor
    .toUpperCase()
    .replace(/[^0-9K]/g, '')
    .slice(0, 9);

  if (limpio.length <= 1) {
    return limpio;
  }

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  const cuerpoConPuntos = cuerpo
    .split('')
    .reverse()
    .join('')
    .replace(/(\d{3})(?=\d)/g, '$1.')
    .split('')
    .reverse()
    .join('');

  return `${cuerpoConPuntos}-${dv}`;
};

const rutValido = (rut) => {
  if (
    !/^\d{1,2}\.\d{3}\.\d{3}-[0-9K]$/.test(
      rut
    )
  ) {
    return false;
  }

  const limpio = rut
    .replace(/\./g, '')
    .toUpperCase();

  const [
    numero,
    dvIngresado
  ] = limpio.split('-');

  let suma = 0;
  let multiplicador = 2;

  for (
    let indice = numero.length - 1;
    indice >= 0;
    indice -= 1
  ) {
    suma +=
      Number(numero[indice]) *
      multiplicador;

    multiplicador =
      multiplicador === 7
        ? 2
        : multiplicador + 1;
  }

  const resultado =
    11 - (suma % 11);

  let dvCalculado;

  if (resultado === 11) {
    dvCalculado = '0';
  } else if (resultado === 10) {
    dvCalculado = 'K';
  } else {
    dvCalculado =
      String(resultado);
  }

  return dvIngresado === dvCalculado;
};

const nombreValido = (nombre) => {
  return (
    nombre.trim().length >= 2 &&
    /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u.test(
      nombre.trim()
    )
  );
};

const apellidosValidos = (apellidos) => {
  const partes = apellidos
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return (
    partes.length >= 2 &&
    /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u.test(
      apellidos.trim()
    )
  );
};

const generarCorreoVistaPrevia = (
  nombres,
  apellidos
) => {
  const partesNombre = nombres
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const {
    apellidoPaterno,
    apellidoMaterno
  } = separarApellidos(apellidos);

  if (
    partesNombre.length === 0 ||
    !apellidoPaterno ||
    !apellidoMaterno
  ) {
    return '';
  }

  let inicialesNombre;

  if (partesNombre.length >= 2) {
    inicialesNombre =
      partesNombre[0].charAt(0) +
      partesNombre[1].charAt(0);
  } else {
    inicialesNombre =
      normalizarParaCorreo(
        partesNombre[0]
      ).slice(0, 2);
  }

  const inicialMaterno =
    apellidoMaterno.charAt(0);

  const base = normalizarParaCorreo(
    inicialesNombre +
    apellidoPaterno +
    inicialMaterno
  );

  return `${base}@colegio.cl`;
};

const generarPasswordVistaPrevia = (
  apellidos,
  rut
) => {
  const {
    apellidoPaterno
  } = separarApellidos(apellidos);

  if (
    !apellidoPaterno ||
    !rut
  ) {
    return '';
  }

  const inicial =
    normalizarParaCorreo(
      apellidoPaterno.charAt(0)
    ).toUpperCase();

  const rutSinPuntos =
    rut.replace(/\./g, '');

  return inicial + rutSinPuntos;
};

const fieldErrorStyle = {
  display: 'block',
  marginTop: '5px',
  color: '#ff8a8a',
  fontSize: '13px'
};

export default function Users() {
  const [users, setUsers] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [
    asignaturas,
    setAsignaturas
  ] = useState([]);

  const [form, setForm] =
    useState(initialForm);

  const [
    fieldErrors,
    setFieldErrors
  ] = useState(initialErrors);

  const [
    showSubjects,
    setShowSubjects
  ] = useState(false);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  const loadData = async () => {
    const [
      usersData,
      coursesData,
      subjectsData
    ] = await Promise.all([
      getUsers(),
      getCourses(),
      getAsignaturas()
    ]);

    setUsers(usersData);
    setCourses(coursesData);
    setAsignaturas(subjectsData);
  };

  useEffect(() => {
    loadData().catch((e) => {
      setError(e.message);
    });
  }, []);

  const setFieldError = (
    field,
    value
  ) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const onChange = (e) => {
    const {
      name,
      value
    } = e.target;

    let nuevoValor = value;

    if (
      name === 'nombre' ||
      name === 'apellidos'
    ) {
      nuevoValor =
        limpiarNombre(value);
    }

    if (name === 'rut') {
      nuevoValor =
        formatearRut(value);
    }

    if (
      name === 'codigoProfesor' ||
      name === 'codigoAlumno'
    ) {
      nuevoValor =
        limpiarCodigo(value);
    }

    if (name === 'telefono') {
      nuevoValor =
        limpiarTelefono(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: nuevoValor,

      ...(name === 'rol'
        ? {
            asignaturaIds: [],
            codigoProfesor: '',
            codigoAlumno: '',
            cursoId: '',
            telefono: ''
          }
        : {})
    }));

    setFieldError(name, '');

    if (name === 'rol') {
      setFieldErrors(initialErrors);
      setShowSubjects(false);
    }
  };

  const toggleAsignatura = (id) => {
    setForm((prev) => ({
      ...prev,

      asignaturaIds:
        prev.asignaturaIds.includes(id)
          ? prev.asignaturaIds.filter(
              (subjectId) =>
                subjectId !== id
            )
          : [
              ...prev.asignaturaIds,
              id
            ]
    }));

    setFieldError(
      'asignaturas',
      ''
    );
  };

  const selectedSubjectNames =
    useMemo(() => {
      return asignaturas
        .filter((asignatura) =>
          form.asignaturaIds.includes(
            asignatura.id
          )
        )
        .map(
          (asignatura) =>
            asignatura.nombre
        );
    }, [
      asignaturas,
      form.asignaturaIds
    ]);

  const esAdministrador =
    form.rol === 'admin';

  const correoGenerado =
    useMemo(() => {
      if (esAdministrador) {
        return '';
      }

      return generarCorreoVistaPrevia(
        form.nombre,
        form.apellidos
      );
    }, [
      esAdministrador,
      form.nombre,
      form.apellidos
    ]);

  const passwordGenerada =
    useMemo(() => {
      if (esAdministrador) {
        return '';
      }

      return generarPasswordVistaPrevia(
        form.apellidos,
        form.rut
      );
    }, [
      esAdministrador,
      form.apellidos,
      form.rut
    ]);

  const validarFormulario = () => {
    const nuevosErrores = {
      ...initialErrors
    };

    if (!nombreValido(form.nombre)) {
      nuevosErrores.nombre =
        'Ingrese un nombre válido usando solamente letras.';
    }

    if (esAdministrador) {
      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          form.email.trim()
        )
      ) {
        nuevosErrores.email =
          'Ingrese un correo válido.';
      }

      if (
        form.password.trim().length < 6
      ) {
        nuevosErrores.password =
          'La contraseña debe tener al menos 6 caracteres.';
      }
    } else {
      if (
        !apellidosValidos(
          form.apellidos
        )
      ) {
        nuevosErrores.apellidos =
          'Ingrese correctamente el apellido paterno y materno.';
      }

      if (!rutValido(form.rut)) {
        nuevosErrores.rut =
          'Ingrese un RUT válido con puntos y dígito verificador.';
      }
    }

    if (
      form.rol === 'profesor'
    ) {
      if (
        form.codigoProfesor &&
        !/^PROF-\d{3,}$/.test(
          form.codigoProfesor
        )
      ) {
        nuevosErrores.codigoProfesor =
          'El código debe tener el formato PROF-001.';
      }

      if (
        form.asignaturaIds.length === 0
      ) {
        nuevosErrores.asignaturas =
          'Seleccione al menos una asignatura.';
      }
    }

    if (
      form.rol === 'alumno' &&
      form.codigoAlumno &&
      !/^ALU-\d{3,}$/.test(
        form.codigoAlumno
      )
    ) {
      nuevosErrores.codigoAlumno =
        'El código debe tener el formato ALU-001.';
    }

    if (
      form.rol === 'apoderado' &&
      !/^\d{9}$/.test(
        form.telefono
      )
    ) {
      nuevosErrores.telefono =
        'El teléfono debe contener exactamente 9 dígitos.';
    }

    setFieldErrors(
      nuevosErrores
    );

    return !Object.values(
      nuevosErrores
    ).some(Boolean);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!validarFormulario()) {
      setError(
        'Revise los campos marcados antes de crear el usuario.'
      );

      return;
    }

    const payload = {
      nombre: form.nombre.trim(),

      apellidos: esAdministrador
        ? ''
        : form.apellidos.trim(),

      rut: esAdministrador
        ? ''
        : form.rut,

      email: esAdministrador
        ? form.email.trim()
        : '',

      password: esAdministrador
        ? form.password
        : '',

      rol: form.rol,

      codigoProfesor:
        form.rol === 'profesor'
          ? form.codigoProfesor
          : '',

      asignaturaIds:
        form.rol === 'profesor'
          ? form.asignaturaIds
          : [],

      codigoAlumno:
        form.rol === 'alumno'
          ? form.codigoAlumno
          : '',

      cursoId:
        form.rol === 'alumno' &&
        form.cursoId
          ? Number(form.cursoId)
          : null,

      telefono:
        form.rol === 'apoderado'
          ? form.telefono
          : ''
    };

    try {
      await createUser(payload);

      setMessage(
        esAdministrador
          ? 'Administrador creado correctamente.'
          : `Usuario creado. Correo: ${correoGenerado}. Contraseña inicial: ${passwordGenerada}`
      );

      setForm(initialForm);
      setFieldErrors(initialErrors);
      setShowSubjects(false);

      await loadData();
    } catch (e) {
      setError(e.message);
    }
  };

  const onToggleActivo = async (
    usuarioId
  ) => {
    setError('');
    setMessage('');

    const usuario = users.find(
      (item) =>
        item.id === usuarioId
    );

    if (!usuario) {
      setError(
        'No se encontró el usuario seleccionado.'
      );

      return;
    }

    const nuevoEstado =
      !usuario.activo;

    try {
      const actualizado =
        await updateUserActive(
          usuarioId,
          nuevoEstado
        );

      setUsers((prev) =>
        prev.map((item) =>
          item.id === usuarioId
            ? {
                ...item,
                activo:
                  actualizado.activo
              }
            : item
        )
      );

      setMessage(
        nuevoEstado
          ? 'Usuario habilitado correctamente.'
          : 'Usuario inhabilitado correctamente.'
      );
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <AdminPageLayout title="Gestión de usuarios">
      <div className="content-section">
        <h2>Crear usuario</h2>

        <form
          onSubmit={onSubmit}
          noValidate
          className="role-card"
          style={{
            background: '#111827',
            border:
              '1px solid rgba(255,255,255,0.08)',
            overflow: 'visible'
          }}
        >
          <div
            className="row g-3"
            style={{
              overflow: 'visible'
            }}
          >
            <div className="col-md-3">
              <select
                name="rol"
                className="form-control"
                value={form.rol}
                onChange={onChange}
              >
                <option value="admin">
                  Admin
                </option>

                <option value="profesor">
                  Profesor
                </option>

                <option value="alumno">
                  Alumno
                </option>

                <option value="apoderado">
                  Apoderado
                </option>
              </select>
            </div>

            <div className="col-md-3">
              <input
                name="nombre"
                className="form-control"
                placeholder={
                  esAdministrador
                    ? 'Nombre'
                    : 'Nombre o nombres'
                }
                value={form.nombre}
                onChange={onChange}
                maxLength={100}
              />

              {fieldErrors.nombre && (
                <small
                  style={fieldErrorStyle}
                >
                  {fieldErrors.nombre}
                </small>
              )}
            </div>

            {!esAdministrador && (
              <>
                <div className="col-md-3">
                  <input
                    name="apellidos"
                    className="form-control"
                    placeholder="Apellido paterno y materno"
                    value={form.apellidos}
                    onChange={onChange}
                    maxLength={160}
                  />

                  {fieldErrors.apellidos && (
                    <small
                      style={
                        fieldErrorStyle
                      }
                    >
                      {
                        fieldErrors.apellidos
                      }
                    </small>
                  )}
                </div>

                <div className="col-md-3">
                  <input
                    name="rut"
                    className="form-control"
                    placeholder="RUT: 12.345.678-5"
                    value={form.rut}
                    onChange={onChange}
                    maxLength={12}
                  />

                  {fieldErrors.rut && (
                    <small
                      style={
                        fieldErrorStyle
                      }
                    >
                      {fieldErrors.rut}
                    </small>
                  )}
                </div>
              </>
            )}

            {esAdministrador && (
              <>
                <div className="col-md-3">
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Correo"
                    value={form.email}
                    onChange={onChange}
                  />

                  {fieldErrors.email && (
                    <small
                      style={
                        fieldErrorStyle
                      }
                    >
                      {fieldErrors.email}
                    </small>
                  )}
                </div>

                <div className="col-md-3">
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={onChange}
                  />

                  {fieldErrors.password && (
                    <small
                      style={
                        fieldErrorStyle
                      }
                    >
                      {
                        fieldErrors.password
                      }
                    </small>
                  )}
                </div>
              </>
            )}

            {!esAdministrador && (
              <>
                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Correo"
                    value={correoGenerado}
                    readOnly
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Contraseña"
                    value={passwordGenerada}
                    readOnly
                  />
                </div>
              </>
            )}

            {form.rol === 'profesor' && (
              <>
                <div className="col-md-3">
                  <input
                    name="codigoProfesor"
                    className="form-control"
                    placeholder="Código profesor; automático si se deja vacío"
                    value={
                      form.codigoProfesor
                    }
                    onChange={onChange}
                    maxLength={20}
                  />

                  {fieldErrors
                    .codigoProfesor && (
                    <small
                      style={
                        fieldErrorStyle
                      }
                    >
                      {
                        fieldErrors
                          .codigoProfesor
                      }
                    </small>
                  )}
                </div>

                <div
                  className="col-md-9"
                  style={{
                    position: 'relative',
                    zIndex: showSubjects
                      ? 3000
                      : 1
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setShowSubjects(
                        (open) => !open
                      )
                    }
                    style={{
                      width: '100%',
                      minHeight: '38px',
                      backgroundColor:
                        '#ffffff',
                      color: '#212529',
                      border:
                        '1px solid #ced4da',
                      borderRadius: '6px',
                      padding:
                        '8px 42px 8px 12px',
                      textAlign: 'left',
                      position: 'relative',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow:
                        'ellipsis',
                      cursor: 'pointer'
                    }}
                  >
                    {selectedSubjectNames
                      .length > 0
                      ? selectedSubjectNames
                          .join(', ')
                      : 'Seleccione una o más asignaturas'}

                    <span
                      style={{
                        position:
                          'absolute',
                        right: '14px',
                        top: '50%',
                        transform:
                          'translateY(-50%)',
                        pointerEvents:
                          'none'
                      }}
                    >
                      {showSubjects
                        ? '▲'
                        : '▼'}
                    </span>
                  </button>

                  {fieldErrors.asignaturas && (
                    <small
                      style={
                        fieldErrorStyle
                      }
                    >
                      {
                        fieldErrors
                          .asignaturas
                      }
                    </small>
                  )}

                  {showSubjects && (
                    <div
                      style={{
                        position:
                          'absolute',
                        zIndex: 5000,
                        top:
                          'calc(100% + 5px)',
                        left: '12px',
                        right: '12px',
                        maxHeight: '280px',
                        overflowY: 'auto',
                        backgroundColor:
                          '#ffffff',
                        border:
                          '1px solid #ced4da',
                        borderRadius:
                          '6px',
                        boxShadow:
                          '0 12px 30px rgba(0, 0, 0, 0.35)',
                        padding: '8px'
                      }}
                    >
                      {asignaturas.map(
                        (asignatura) => {
                          const selected =
                            form.asignaturaIds
                              .includes(
                                asignatura.id
                              );

                          return (
                            <label
                              key={
                                asignatura.id
                              }
                              style={{
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                gap: '10px',
                                padding:
                                  '9px 10px',
                                color:
                                  '#212529',
                                backgroundColor:
                                  selected
                                    ? '#e7f1ff'
                                    : '#ffffff',
                                borderRadius:
                                  '5px',
                                cursor:
                                  'pointer'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selected
                                }
                                onChange={() =>
                                  toggleAsignatura(
                                    asignatura.id
                                  )
                                }
                              />

                              <span>
                                {
                                  asignatura.nombre
                                }
                              </span>
                            </label>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {form.rol === 'alumno' && (
              <>
                <div className="col-md-4">
                  <input
                    name="codigoAlumno"
                    className="form-control"
                    placeholder="Código alumno; automático si se deja vacío"
                    value={
                      form.codigoAlumno
                    }
                    onChange={onChange}
                    maxLength={20}
                  />

                  {fieldErrors
                    .codigoAlumno && (
                    <small
                      style={
                        fieldErrorStyle
                      }
                    >
                      {
                        fieldErrors
                          .codigoAlumno
                      }
                    </small>
                  )}
                </div>

                <div className="col-md-4">
                  <select
                    name="cursoId"
                    className="form-control"
                    value={form.cursoId}
                    onChange={onChange}
                  >
                    <option value="">
                      Sin curso
                    </option>

                    {courses.map(
                      (course) => (
                        <option
                          key={course.id}
                          value={course.id}
                        >
                          {course.nombre}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </>
            )}

            {form.rol === 'apoderado' && (
              <div className="col-md-4">
                <input
                  name="telefono"
                  inputMode="numeric"
                  className="form-control"
                  placeholder="Teléfono de 9 dígitos"
                  value={form.telefono}
                  onChange={onChange}
                  maxLength={9}
                />

                {fieldErrors.telefono && (
                  <small
                    style={fieldErrorStyle}
                  >
                    {fieldErrors.telefono}
                  </small>
                )}
              </div>
            )}

            <div className="col-12">
              <button
                className="btn-base btn-primary"
                type="submit"
              >
                Crear usuario
              </button>
            </div>
          </div>
        </form>

        {message && (
          <div className="form-success">
            {message}
          </div>
        )}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}
      </div>

      <div className="content-section">
        <h2>Listado de usuarios</h2>

        <div className="table-responsive">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Código usuario</th>
                <th>Activo</th>
                <th>
                  Habilitar o inhabilitar usuarios
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>

                  <td>{user.nombre}</td>

                  <td>{user.email}</td>

                  <td>{user.rol}</td>

                  <td>
                    {user.codigoUsuario ||
                      '-'}
                  </td>

                  <td>
                    {user.activo
                      ? 'Sí'
                      : 'No'}
                  </td>

                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={
                          !!user.activo
                        }
                        onChange={() =>
                          onToggleActivo(
                            user.id
                          )
                        }
                      />

                      <label className="form-check-label">
                        {user.activo
                          ? 'Habilitado'
                          : 'Inhabilitado'}
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPageLayout>
  );
}