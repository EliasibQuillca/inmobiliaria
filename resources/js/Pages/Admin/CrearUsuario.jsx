import React from 'react';
import FormularioUsuario from './FormularioUsuario';

export default function CrearUsuario({ auth }) {
    return <FormularioUsuario auth={auth} modo="crear" />;
}
