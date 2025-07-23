import React from 'react';
import { Head } from '@inertiajs/react';
import FormularioUsuario from './FormularioUsuario';

export default function EditarUsuario({ auth, usuario }) {
    return <FormularioUsuario auth={auth} usuario={usuario} userId={usuario?.id} modo="editar" />;
}
