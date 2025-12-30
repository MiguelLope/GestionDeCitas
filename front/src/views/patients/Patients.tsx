import React, { useState, useEffect } from 'react';
import { FormPaciente } from './components/FormPatients';
import api from '../../services/api';
import NavBar from '../components/NavBar';
import { ConfirmDialog } from '../components/Dialog';
import { Paciente as PacienteType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Paciente = () => {
  const [pacientes, setPacientes] = useState<PacienteType[]>([]);
  const [formData, setFormData] = useState<Partial<PacienteType>>({
    id_usuario: 0,
    nombre: '',
    email: '',
    telefono: '',
    curp: '',
    contraseña: '',
    tipo_usuario: 'paciente',
  });
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<PacienteType | null>(null);

  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    api
      .get(`/pacientes`)
      .then((response) => {
        setPacientes(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los paciente:', error);
        showError('Error al cargar pacientes');
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.id_usuario) {
      api
        .put(`/usuarios/${formData.id_usuario}`, formData)
        .then((response) => {
          setPacientes((prev) =>
            prev.map((paciente) =>
              paciente.id_usuario === formData.id_usuario ? response.data : paciente
            )
          );
          showSuccess('Paciente actualizado con éxito.');
        })
        .catch((error) => {
          console.error('Error al actualizar paciente:', error);
          showError('Error al actualizar paciente');
        });
    } else {
      api
        .post(`/usuarios`, formData)
        .then((response) => {
          setPacientes((prev) => [...prev, response.data]);
          showSuccess('Paciente agregado con éxito.');
        })
        .catch((error) => {
          console.error('Error al agregar paciente:', error);
          showError('Error al agregar paciente');
        });
    }
    setModalOpen(false);
    setFormData({
      id_usuario: 0,
      nombre: '',
      email: '',
      telefono: '',
      curp: '',
      contraseña: '',
      tipo_usuario: 'paciente',
    });
  };

  const handleEdit = (paciente: PacienteType) => {
    setFormData(paciente);
    setModalOpen(true);
  };

  const handleOpenDeleteDialog = (paciente: PacienteType) => {
    setSelectedPaciente(paciente);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPaciente) {
      api
        .delete(`/usuarios/${selectedPaciente.id_usuario}`)
        .then(() => {
          setPacientes((prev) =>
            prev.filter((paciente) => paciente.id_usuario !== selectedPaciente.id_usuario)
          );
          showSuccess('Paciente eliminado con éxito.');
        })
        .catch((error) => {
          console.error('Error al eliminar el Paciente:', error);
          showError('Error al eliminar paciente');
        });
    }
    setDialogOpen(false);
    setSelectedPaciente(null);
  };

  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nombre.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return null;

  return (
    <div>
      <NavBar select="usuarios" />
      <div className="container my-5">
        <h2 className="text-center mb-4">Pacientes</h2>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex w-100">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar Paciente..."
              value={search}
              onChange={handleSearchChange}
            />
            {user.tipo_usuario === 'admin' && (
              <button
                className="btn btn-success"
                onClick={() => setModalOpen(true)}
              >
                Crear Paciente
              </button>
            )}
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Contraseña</th>
              <th>CURP</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPacientes.map((paciente) => (
              <tr key={paciente.id_usuario}>
                <td>{paciente.nombre}</td>
                <td>{paciente.email}</td>
                <td>{paciente.telefono}</td>
                <td>{'*'.repeat(8)}</td>
                <td>{paciente.curp}</td>
                <td>
                  {
                    user.tipo_usuario === 'admin' && (
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => handleEdit(paciente)}>
                        Editar
                      </button>
                    )
                  }
                  {
                    user.tipo_usuario === 'admin' && (
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => handleOpenDeleteDialog(paciente)}>
                        Eliminar
                      </button>
                    )
                  }
                  <button className="btn btn-success "> Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {modalOpen && (
          <FormPaciente
            title={formData.id_usuario ? 'Editar Paciente' : 'Crear Paciente'}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setModalOpen={setModalOpen}
            setFormData={setFormData}
          />
        )}

        <ConfirmDialog
          isOpen={dialogOpen}
          onCancel={() => setDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar eliminación"
          message={`¿Estás seguro de que deseas eliminar a ${selectedPaciente?.nombre}?`}
        />
      </div>
    </div>
  );
};

export default Paciente;
