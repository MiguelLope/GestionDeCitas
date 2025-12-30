<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\ConsultorioController;
use App\Http\Controllers\ContactoController;
use App\Http\Controllers\EspecialistaController;
use App\Http\Controllers\HistorialMedicoController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Public Routes ---

// Auth
Route::post('login', [UsuarioController::class, 'login']);
Route::post('usuarios', [UsuarioController::class, 'store']); // Register
Route::post('enviar-codigo', [AuthController::class, 'sendVerificationCode']);
Route::post('verificar-codigo', [AuthController::class, 'verifyCode']);

// Public Info (optional, can be protected if desired)
Route::get('contacto', [ContactoController::class, 'index']);
Route::post('contacto', [ContactoController::class, 'update']); // Maybe protect this? Leaving public for now as per previous state

// --- Protected Routes ---
Route::middleware('auth:sanctum')->group(function () {

    // User Info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Resources
    Route::apiResource('usuarios', UsuarioController::class)->except(['store']); // Store is public (register)
    Route::apiResource('consultorios', ConsultorioController::class);
    Route::apiResource('especialistas', EspecialistaController::class);
    Route::apiResource('citas', CitaController::class);
    Route::apiResource('pagos', PagoController::class);
    Route::apiResource('historiales', HistorialMedicoController::class); // Was 'historial' before, 'historiales' is better convention

    // Specific Controller Actions

    // Pagos
    Route::put('pagos/{id_pago}/completar', [PagoController::class, 'completarPago']);

    // Usuarios / Admin
    Route::get('administradores', [UsuarioController::class, 'getAdministradores']);
    Route::get('pacientes', [UsuarioController::class, 'getPacientes']);
    Route::get('especialist/ver', [UsuarioController::class, 'getEspecialistas']);
    Route::get('especialistas-list', [UsuarioController::class, 'getEspecialistas']);

    // Especialistas
    Route::put('/especialistas/{especialista}/horario', [EspecialistaController::class, 'actualizarHorario']);
    Route::put('/especialistas/{especialista}/consultorio', [EspecialistaController::class, 'actualizarConsultorio']);
    Route::get('especialistas/date/{id_especialista}', [EspecialistaController::class, 'findEspecialistaDating']);

    // Citas
    Route::get('paciente/citas/{id_especialista}', [CitaController::class, 'citasPendientesPorPaciente']);
    Route::get('especialista/citas/{id_especialista}', [CitaController::class, 'citasPendientesPorEspecialista']);
    Route::get('especialista/citas', [CitaController::class, 'citasPendientesPorAdmin']);
    Route::get('citas/especialista/{id}', [CitaController::class, 'showEspecialista']);

    // Historial
    Route::get('historial/paciente/{id}', [HistorialMedicoController::class, 'getHistorialPaciente']);
    Route::get('historial/especialista/{id}', [HistorialMedicoController::class, 'getHistorialEspecialista']);
    Route::get('historial/completo/{id}', [HistorialMedicoController::class, 'getHistorialCompleto']);
});
