
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { compose, minLength, required } from '../utils/validators';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';

// Configuración del bloqueo
const LOGIN_ATTEMPTS_KEY = 'sunshine_login_attempts';
const MAX_INTENTOS = 3;
const TIEMPO_BLOQUEO = 5 * 60 * 1000; // 5 minutos

// Validaciones del formulario
const rules = {
  username: compose(required('El usuario'), minLength(3, 'El usuario')),
  password: compose(required('La contraseña'), minLength(6, 'La contraseña')),
};

// Obtener los intentos y comprobar si existe un bloqueo
const obtenerEstadoLogin = () => {
  try {
    const estado = JSON.parse(
      localStorage.getItem(LOGIN_ATTEMPTS_KEY) || 'null'
    );

    if (!estado) {
      return { intentos: 0, bloqueadoHasta: 0 };
    }

    // Si el bloqueo ya terminó, reiniciar el contador
    if (estado.bloqueadoHasta && Date.now() >= estado.bloqueadoHasta) {
      localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
      return { intentos: 0, bloqueadoHasta: 0 };
    }

    return {
      intentos: Number(estado.intentos) || 0,
      bloqueadoHasta: Number(estado.bloqueadoHasta) || 0,
    };
  } catch {
    localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
    return { intentos: 0, bloqueadoHasta: 0 };
  }
};

// Registrar un intento fallido
const registrarIntentoFallido = () => {
  const estado = obtenerEstadoLogin();
  const intentos = estado.intentos + 1;

  const bloqueadoHasta =
    intentos >= MAX_INTENTOS
      ? Date.now() + TIEMPO_BLOQUEO
      : 0;

  const nuevoEstado = { intentos, bloqueadoHasta };

  localStorage.setItem(
    LOGIN_ATTEMPTS_KEY,
    JSON.stringify(nuevoEstado)
  );

  return nuevoEstado;
};

// Limpiar los intentos después de un login exitoso
const limpiarIntentos = () => {
  localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
};

// Convertir segundos a formato MM:SS
const formatearTiempo = (segundos) => {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  return `${String(minutos).padStart(2, '0')}:${String(
    segundosRestantes
  ).padStart(2, '0')}`;
};

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState('');
  const [sending, setSending] = useState(false);
  const [lockUntil, setLockUntil] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm({ username: '', password: '' }, rules);

  const field = (id) => ({
    id,
    value: values[id],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[id]
  });

  // Recuperar el estado del bloqueo al cargar el login
  useEffect(() => {
    const estado = obtenerEstadoLogin();

    if (estado.bloqueadoHasta > Date.now()) {
      setLockUntil(estado.bloqueadoHasta);
      setRemainingSeconds(
        Math.ceil((estado.bloqueadoHasta - Date.now()) / 1000)
      );
      setApiError(
        'Has alcanzado el máximo de intentos fallidos.'
      );
    }
  }, []);

  // Actualizar la cuenta regresiva cada segundo
  useEffect(() => {
    if (!lockUntil) return;

    const actualizarTiempo = () => {
      const restante = Math.max(
        0,
        Math.ceil((lockUntil - Date.now()) / 1000)
      );

      setRemainingSeconds(restante);

      if (restante === 0) {
        limpiarIntentos();
        setLockUntil(0);
        setApiError(
          'El bloqueo ha finalizado. Ya puedes intentar ingresar.'
        );
      }
    };

    actualizarTiempo();

    const intervalo = setInterval(actualizarTiempo, 1000);

    return () => clearInterval(intervalo);
  }, [lockUntil]);

  if (user) {
    return <Navigate to="/sistema/dashboard" replace />;
  }

  return (
    <AuthLayout title="Inicio de sesión">
      <form
        onSubmit={handleSubmit(async (form) => {
          setApiError('');

          // Comprobar si el usuario todavía está bloqueado
          const estado = obtenerEstadoLogin();

          if (estado.bloqueadoHasta > Date.now()) {
            setLockUntil(estado.bloqueadoHasta);
            setRemainingSeconds(
              Math.ceil(
                (estado.bloqueadoHasta - Date.now()) / 1000
              )
            );
            setApiError(
              'Has alcanzado el máximo de intentos fallidos.'
            );
            return;
          }

          setSending(true);

          try {
            await login(form.username, form.password);

            // Inicio exitoso: reiniciar intentos
            limpiarIntentos();
            setLockUntil(0);
            setRemainingSeconds(0);

            navigate('/sistema/dashboard');
          } catch (error) {
            // Registrar intento fallido
            const resultado = registrarIntentoFallido();

            if (resultado.bloqueadoHasta > 0) {
              setLockUntil(resultado.bloqueadoHasta);
              setRemainingSeconds(5 * 60);

              setApiError(
                'Has alcanzado 3 intentos fallidos. El acceso está bloqueado temporalmente.'
              );
            } else {
              setApiError(
                `${error.message || 'No se pudo iniciar sesión.'} Intento ${resultado.intentos} de ${MAX_INTENTOS}.`
              );
            }
          } finally {
            setSending(false);
          }
        })}
        noValidate
      >
        {apiError && (
          <p
            role="alert"
            className="mb-4 rounded bg-red-100 p-3 text-sm text-red-800"
          >
            {apiError}

            {lockUntil > 0 && (
              <span className="mt-1 block font-semibold">
                Puedes volver a intentar en:{' '}
                {formatearTiempo(remainingSeconds)}
              </span>
            )}
          </p>
        )}

        <div className="space-y-5">
          <FormField
            id="username"
            label="Nombre de Usuario"
            error={errors.username}
            onDark
          >
            <Input
              {...field('username')}
              placeholder="Usuario..."
              autoComplete="username"
            />
          </FormField>

          <FormField
            id="password"
            label="Contraseña"
            error={errors.password}
            onDark
          >
            <Input
              {...field('password')}
              type="password"
              placeholder="Contraseña..."
              autoComplete="current-password"
            />
          </FormField>
        </div>

        <div className="mt-2 text-right">
          <a
            href="#"
            className="text-xs font-semibold underline transition hover:text-brand-light"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="submit"
            size="lg"
            disabled={sending || lockUntil > 0}
          >
            {sending
              ? 'Ingresando...'
              : lockUntil > 0
                ? `Bloqueado (${formatearTiempo(remainingSeconds)})`
                : 'Ingresar'}
          </Button>
        </div>

        <p className="mt-6 text-center text-xs">
          ¿Aún no tienes cuenta?{' '}
          <Link
            to="/registro"
            className="font-semibold underline hover:text-brand-light"
          >
            Regístrate
          </Link>
        </p>

        <p className="mt-3 text-center text-xs">
          <Link
            to="/"
            className="underline transition hover:text-brand-light"
          >
            Volver al sitio web
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
