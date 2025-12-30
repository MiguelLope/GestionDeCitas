import React, { useState, useEffect } from 'react';
import { FormEspecialista } from './components/FormSpecialists';
import api from '../../services/api';
import NavBar from '../components/NavBar';
import { ConfirmDialog } from '../components/Dialog';
import { useNavigate } from "react-router-dom";
import { Especialista as EspecialistaType } from '../../types';
import { useToast } from '../../context/ToastContext';

const Especialista = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [especialistas, setEspecialistas] = useState<EspecialistaType[]>([]);
  const [formData, setFormData] = useState<Partial<EspecialistaType>>({
    id_usuario: 0,
    nombre: '',
    especialidad: '',
    email: '',
    telefono: '',
    curp: '',
    contraseña: '',
    tipo_usuario: 'especialista',
  });
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEspecialista, setSelectedEspecialista] = useState<EspecialistaType | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    api
      .get(`/especialistas`)
      .then((response) => {
        setEspecialistas(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los Especialista:', error);
        showError('Error al cargar especialistas');
      });
  }, []); // Correctly closed useEffect

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.id_usuario) {
      api
        .put(`/usuarios/${formData.id_usuario}`, formData)
        .then((response) => {
          setEspecialistas((prev) =>
            prev.map((especialista) =>
              especialista.id_usuario === formData.id_usuario ? response.data : especialista
            )
          );
          showSuccess('Especialista actualizado con éxito.');
        })
        .catch((error) => {
          console.error('Error al actualizar pspecialista:', error);
          showError('Error al actualizar especialista');
        });
    } else {
      api
        .post(`/usuarios`, formData)
        .then((response) => {
          setEspecialistas((prev) => [...prev, response.data]);
          showSuccess('Especialista agregado con éxito.');
        })
        .catch((error) => {
          console.error('Error al agregar especialista:', error);
          showError('Error al agregar especialista');
        });
    }
    setModalOpen(false);
    setFormData({
      id_usuario: 0,
      nombre: '',
      especialidad: '',
      email: '',
      telefono: '',
      curp: '',
      contraseña: '',
      tipo_usuario: 'especialista',
    });
  };

  const handleEdit = (especialista: EspecialistaType) => {
    setFormData(especialista);
    setModalOpen(true);
  };

  const handleOpenDeleteDialog = (especialista: EspecialistaType) => {
    setSelectedEspecialista(especialista);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEspecialista) {
      api
        .delete(`/usuarios/${selectedEspecialista.id_usuario}`)
        .then(() => {
          setEspecialistas((prev) =>
            prev.filter((especialista) => especialista.id_usuario !== selectedEspecialista.id_usuario)
          );
          showSuccess('Especialista eliminado con éxito.');
        })
        .catch((error) => {
          console.error('Error al eliminar el Especialista: ', error);
          showError('Error al eliminar especialista');
        });
    }
    setDialogOpen(false);
    setSelectedEspecialista(null);
  };

  const filtereEspecialistas = especialistas.filter(
    (especialista) =>
      especialista.nombre?.toLowerCase().includes(search.toLowerCase()) ?? false
  );

  const handleNavigationClick = (data: EspecialistaType) => {
    const dataToSend = { data: data };
    navigate('/admin/specialists/view', { state: dataToSend });
  };

  return (
    <div>
      <NavBar select="usuarios" />
      <div className="container my-5">
        <h2 className="text-center mb-4">Especialista</h2>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3">
          <div className="d-flex w-100 mb-3 mb-sm-0">
            <input
              type="text"
              className="form-control me-2 w-100"
              placeholder="Buscar Especialista..."
              value={search}
              onChange={handleSearchChange}
            />
            <button
              className="btn btn-success ms-2 w-100 w-sm-auto"
              onClick={() => setModalOpen(true)}
            >
              Crear Especialista
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Contraseña</th>
                <th>CURP</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtereEspecialistas.map((especialista) => (
                <tr key={especialista.id_usuario}>
                  <td>{especialista.nombre}</td>
                  <td>{especialista.especialidad}</td>
                  <td>{especialista.email}</td>
                  <td>{especialista.telefono}</td>
                  <td>{'*'.repeat(8)}</td>
                  <td>{especialista.curp}</td>
                  <td>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleEdit(especialista)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger me-2"
                      onClick={() => handleOpenDeleteDialog(especialista)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-info"
                      onClick={() => handleNavigationClick(especialista)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <FormEspecialista
            title={formData.id_usuario ? 'Editar Especialista' : 'Crear Especialista'}
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
          message={`¿Estás seguro de que deseas eliminar a ${selectedEspecialista?.nombre}?`}
        />
      </div>
    </div>
  );
};

export default Especialista;
