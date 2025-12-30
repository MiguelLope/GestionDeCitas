<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUsuarioRequest extends FormRequest
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
        return [
            'nombre' => 'required|string|max:100',
            'email' => 'required|email|unique:usuarios,email',
            'curp' => 'required|string|unique:usuarios,curp',
            'contraseña' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:15',
            'tipo_usuario' => 'required|in:admin,especialista,paciente',
            'especialidad' => 'required_if:tipo_usuario,especialista|string|max:100', // Validar especialidad solo si es especialista
        ];
    }
}
