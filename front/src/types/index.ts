export interface Usuario {
    id_usuario: number;
    nombre: string;
    email: string;
    telefono?: string;
    curp?: string;
    tipo_usuario: 'admin' | 'paciente' | 'especialista';
    contraseña?: string; // Optional for updates
}

export interface Especialista extends Usuario {
    especialidad: string;
    id_consultorio?: number;
    horario_inicio?: string;
    horario_fin?: string;
    dias_trabajo?: string[]; // Or JSON string depending on usage, better to parse it in service
}

export interface Paciente extends Usuario {
    fecha_nacimiento?: string;
}

export interface Consultorio {
    id_consultorio: number;
    nombre: string;
    ubicacion?: string;
}

export interface Cita {
    id_cita: number;
    id_usuario: number;
    id_especialista: number;
    id_consultorio: number;
    fecha_hora: string;
    estado: 'pendiente' | 'confirmada' | 'cancelada';
    motivo?: string;
    paciente?: Paciente;
    especialista?: Especialista;
    consultorio?: Consultorio;
}
