<?php

namespace App\Http\Controllers;

use App\Models\Especialista;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\HorarioService;

use App\Http\Requests\UpdateEspecialistaRequest;
use App\Http\Requests\UpdateConsultorioEspecialistaRequest;
use App\Http\Requests\UpdateHorarioEspecialistaRequest;

class EspecialistaController
{
    protected $horarioService;

    public function __construct(HorarioService $horarioService)
    {
        $this->horarioService = $horarioService;
    }

    /**
     * Mostrar detalles de un especialista.
     */
    public function show($id)
    {
        $especialista = Especialista::with('usuario', 'consultorio')
            ->where('id_usuario', $id)
            ->firstOr(function () {
                abort(404, 'Especialista no encontrado');
            });

        return response()->json([
            'especialista' => [
                'id_especialista' => $especialista->id_especialista,
                'id_usuario' => $especialista->id_usuario,
                'nombre' => $especialista->usuario->nombre,
                'especialidad' => $especialista->especialidad,
                'horario_inicio' => $especialista->horario_inicio,
                'horario_fin' => $especialista->horario_fin,
                'dias_trabajo' => json_decode($especialista->dias_trabajo, true) ?? [],
                'consultorio' => $especialista->consultorio ? [
                    'nombre' => $especialista->consultorio->nombre,
                    'ubicacion' => $especialista->consultorio->ubicacion,
                ] : null,
            ],
        ]);
    }


    /**
     * Actualizar información del especialista.
     */
    public function update(UpdateEspecialistaRequest $request, $id)
    {
        $especialista = $this->findEspecialista($id);

        $validated = $request->validated();

        $especialista->update($validated);

        return response()->json($especialista);
    }

    /**
     * Actualizar el consultorio asignado a un especialista.
     */
    public function actualizarConsultorio(UpdateConsultorioEspecialistaRequest $request, $id_especialista)
    {
        $especialista = $this->findEspecialista($id_especialista);

        $validated = $request->validated();

        $nuevo_consultorio = $validated['id_consultorio'];

        // Si el especialista no tiene horario asignado, se le asigna el consultorio directamente
        if (empty($especialista->horario_inicio) || empty($especialista->horario_fin)) {
            $especialista->update(['id_consultorio' => $nuevo_consultorio]);

            return response()->json([
                'message' => 'Consultorio asignado correctamente (sin validación de horarios)',
                'especialista' => $especialista,
            ]);
        }

        // Verificar si hay conflicto en el nuevo consultorio solo si tiene horario asignado
        $conflicto = $this->horarioService->verificarConflicto(
            $nuevo_consultorio,
            $id_especialista,
            $especialista->horario_inicio,
            $especialista->horario_fin,
            json_decode($especialista->dias_trabajo, true) ?? []
        );

        if ($conflicto) {
            abort(409, 'El especialista tiene un horario que entra en conflicto con otro en el nuevo consultorio.');
        }

        // Si no hay conflictos, actualizar el consultorio
        $especialista->update(['id_consultorio' => $nuevo_consultorio]);

        return response()->json([
            'message' => 'Consultorio asignado correctamente',
            'especialista' => $especialista,
        ]);
    }



    /**
     * Actualizar el horario de un especialista.
     */
    public function actualizarHorario(UpdateHorarioEspecialistaRequest $request, $id_especialista)
    {
        Log::info($request->all());
        $especialista = $this->findEspecialista($id_especialista);

        if (!$especialista->id_consultorio) {
            abort(400, 'El especialista no tiene un consultorio asignado');
        }

        // Validación de la entrada
        $validated = $request->validated();

        $horario_inicio = $validated['horario_inicio'];
        $horario_fin = $validated['horario_fin'];
        $dias_trabajo = $validated['dias_trabajo'];

        // Buscar conflicto con otros especialistas en el mismo consultorio
        $conflicto = $this->horarioService->verificarConflicto(
            $especialista->id_consultorio,
            $id_especialista,
            $horario_inicio,
            $horario_fin,
            $dias_trabajo
        );

        if ($conflicto) {
            abort(409, 'El horario y días de trabajo se cruzan con otro especialista en el mismo consultorio');
        }

        // Guardar los datos, convirtiendo el array de días a formato JSON
        $especialista->update([
            'horario_inicio' => $horario_inicio,
            'horario_fin' => $horario_fin,
            'dias_trabajo' => json_encode($dias_trabajo),
        ]);

        return response()->json([
            'message' => 'Horario actualizado correctamente',
            'especialista' => $especialista,
        ]);
    }



    /**
     * Eliminar un especialista.
     */
    public function destroy($id)
    {
        $especialista = $this->findEspecialista($id);
        $especialista->delete();

        return response()->json(['message' => 'Especialista eliminado']);
    }

    /**
     * Método auxiliar para encontrar un especialista o devolver error 404.
     */
    private function findEspecialista($id)
    {
        return Especialista::findOrFail($id);
    }

    public function findEspecialistaDating($id)
    {


        try {
            // Buscar al especialista por su ID
            $especialista = Especialista::with('usuario')
                ->where('id_especialista', $id)
                ->firstOr(function () {
                    abort(404, 'Especialista no encontrado');
                });
            // Retornar la información del especialista
            return response()->json([
                'id_especialista' => $especialista->id_especialista,
                'nombre' => $especialista->usuario->nombre,
                // Agregar más datos si es necesario
            ]);
        } catch (\Exception $e) {
            // Manejar errores si el especialista no se encuentra
            return response()->json([
                'error' => 'Especialista no encontrado.',
            ], 404);
        }
    }
}
