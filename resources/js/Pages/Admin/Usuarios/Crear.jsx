import React from 'react';
import FormularioUsuario from './Formulario';

export default function CrearUsuario({ auth }) {
    return <FormularioUsuario auth={auth} modo="crear" />;
}
