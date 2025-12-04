import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Login({ status, canResetPassword }) {
    const { csrf_token } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Asegurar que el token CSRF esté disponible al cargar la página
    useEffect(() => {
        if (!csrf_token) {
            console.error('CSRF token not found on page load');
        } else {
            console.log('CSRF token found:', csrf_token.substring(0, 10) + '...');

            // Actualizar el meta tag con el token de Inertia
            const metaTag = document.head.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                metaTag.content = csrf_token;
            }
        }
    }, [csrf_token]);

    const submit = (e) => {
        e.preventDefault();

        // Verificar que el token CSRF existe
        if (!csrf_token) {
            console.error('CSRF token not found');
            // Recargar la página para obtener un nuevo token
            window.location.reload();
            return;
        }

        console.log('Submitting login with CSRF token:', csrf_token.substring(0, 10) + '...');

        post(route('login'), {
            preserveState: false,
            preserveScroll: false,
            forceFormData: true,
            headers: {
                'X-CSRF-TOKEN': csrf_token,
            },
            onSuccess: () => {
                // Recarga completa después de login exitoso para resetear todo el estado
                window.location.reload();
            },
            onFinish: () => reset('password'),
            onError: (errors) => {
                console.error('Login errors:', errors);

                // Si hay un error 419, recargar la página para obtener un nuevo token
                if (errors.message && errors.message.includes('419')) {
                    console.log('CSRF token expired, reloading page...');
                    setTimeout(() => window.location.reload(), 1000);
                }
            }
        });
    };    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Bienvenido de Nuevo</h1>
                <p className="text-gray-600 mt-2">Ingresa tus credenciales para acceder a tu cuenta</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {errors.email && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">
                                {errors.email}
                            </p>
                            {errors.email.includes('no coinciden') && (
                                <p className="mt-2 text-sm text-red-700">
                                    ¿No tienes cuenta?{' '}
                                    <Link href="/register" className="font-semibold underline hover:text-red-900">
                                        Regístrate aquí
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-gray-600 hover:text-indigo-700 transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}

                    <PrimaryButton className="ml-4 bg-indigo-600 hover:bg-indigo-700" disabled={processing}>
                        Iniciar Sesión
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                <p className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{' '}
                    <Link
                        href={"/register"}
                        className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        Regístrate Ahora
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
