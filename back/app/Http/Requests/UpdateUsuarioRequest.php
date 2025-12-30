<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUsuarioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Get the ID of the user being updated from the route parameter
        $id = $this->route('user') ?? $this->route('usuario');

        return [
            'nombre' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:usuarios,email,' . $id . ',id_usuario',
            'telefono' => 'nullable|string|max:20',
            'tipo_usuario' => 'nullable|in:paciente,especialista,admin',
            'contraseña' => 'nullable|string'
        ];
    }
}
