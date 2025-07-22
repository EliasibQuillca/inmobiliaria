<?php

namespace App\Policies;

use App\Models\Asesor;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AsesorPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->esAdministrador();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Asesor $asesor): bool
    {
        return $user->esAdministrador() ||
               ($user->esAsesor() && $user->asesor && $user->asesor->id === $asesor->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->esAdministrador();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Asesor $asesor): bool
    {
        return $user->esAdministrador();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Asesor $asesor): bool
    {
        return $user->esAdministrador();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Asesor $asesor): bool
    {
        return $user->esAdministrador();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Asesor $asesor): bool
    {
        return $user->esAdministrador();
    }

    /**
     * Determine whether the user can change the status of the model.
     */
    public function cambiarEstado(User $user, Asesor $asesor): bool
    {
        return $user->esAdministrador();
    }
}
