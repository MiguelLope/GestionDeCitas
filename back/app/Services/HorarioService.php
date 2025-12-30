<?php

namespace App\Services;

use App\Models\Especialista;

class HorarioService
{
    /**
     * Verifica si existe un conflicto de horario para un especialista en un consultorio dado.
     *
     * @param int $id_consultorio ID del consultorio.
     * @param int $id_especialista ID del especialista (para excluirlo de la búsqueda).
     * @param string $horario_inicio Hora de inicio.
     * @param string $horario_fin Hora de fin.
     * @param array $dias_trabajo Días de trabajo.
     * @return bool True si hay conflicto, False si no.
     */
    public function verificarConflicto(int $id_consultorio, int $id_especialista, string $horario_inicio, string $horario_fin, array $dias_trabajo): bool
    {
        $pasa_medianoche = strtotime($horario_fin) < strtotime($horario_inicio);

        return Especialista::where('id_consultorio', $id_consultorio)
            ->where('id_especialista', '!=', $id_especialista)
            ->where(function ($query) use ($horario_inicio, $horario_fin, $dias_trabajo, $pasa_medianoche) {
                // Filtro por superposición de horas
                $query->where(function ($subQuery) use ($horario_inicio, $horario_fin, $pasa_medianoche) {
                    if ($pasa_medianoche) {
                        // Caso especial: horario pasa de medianoche (Ejemplo: 20:00 - 02:00)
                        $subQuery->whereBetween('horario_inicio', [$horario_inicio, '23:59:59'])
                            ->orWhereBetween('horario_fin', ['00:00:00', $horario_fin])
                            ->orWhere(function ($nestedQuery) use ($horario_inicio, $horario_fin) {
                            $nestedQuery->where('horario_inicio', '<=', $horario_inicio)
                                ->where('horario_fin', '>=', $horario_fin); // Cubre el rango completo (ej: 19:00 - 03:00 cubre 20:00 - 02:00)
                        });
                    } else {
                        // Caso normal: horario dentro del mismo día
                        $subQuery->whereBetween('horario_inicio', [$horario_inicio, $horario_fin])
                            ->orWhereBetween('horario_fin', [$horario_inicio, $horario_fin])
                            ->orWhere(function ($nestedQuery) use ($horario_inicio, $horario_fin) {
                            $nestedQuery->where('horario_inicio', '<=', $horario_inicio)
                                ->where('horario_fin', '>=', $horario_fin);
                        });
                    }
                })
                    // Filtro por días de trabajo (JSON Overlaps)
                    ->whereRaw("JSON_OVERLAPS(dias_trabajo, ?)", [json_encode($dias_trabajo)]);
            })
            ->exists();
    }
}
