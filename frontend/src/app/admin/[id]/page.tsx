"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditarUsuarioAdmin() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [usuario, setUsuario] = useState<any>(null);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const [formData, setFormData] = useState({
    rol_id: "",
    estado: true
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:4000/api/admin/usuarios", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const encontrado = response.data.find((u: any) => u.id.toString() === id);

        if (encontrado) {
          setUsuario(encontrado);
          setFormData({
            rol_id: encontrado.rol_id.toString(),
            estado: encontrado.estado
          });
        } else {
          setError("Usuario no encontrado.");
        }
      } catch (error) {
        setError("Error al cargar los datos del usuario.");
      }
    };
    fetchUsuario();
  }, [id, router]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensajeExito("");

    if (!formData.rol_id || formData.rol_id === "") {
      setError("Error: El campo rol es obligatorio. Ningún usuario puede quedar con el rol vacío.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:4000/api/admin/usuarios/${id}`, {
        rol_id: parseInt(formData.rol_id),
        estado: formData.estado
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensajeExito("¡Usuario actualizado exitosamente!");
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al actualizar el usuario.");
    }
  };

  if (error && !usuario) return <div className="text-red-400 text-center mt-10 text-xl">{error}</div>;
  if (!usuario) return <div className="text-white text-center mt-10">Cargando datos del usuario...</div>;

  const inputClass = "mt-1 block w-full p-2 border border-gray-600 bg-gray-800 rounded text-white focus:ring-amber-500 focus:border-amber-500";

  return (
    <div className="max-w-2xl mx-auto p-8 mt-6 bg-gray-900 rounded-lg shadow-md border border-gray-800">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-amber-500">Editar Usuario</h1>
        <Link href="/admin" className="text-amber-400 hover:text-amber-300 hover:underline transition">
          &larr; Volver al Panel
        </Link>
      </div>

      {error && <p className="bg-red-900/50 text-red-200 p-3 rounded mb-6 text-center border border-red-800">{error}</p>}
      {mensajeExito && (
        <div className="bg-green-900/50 text-green-200 p-4 rounded-lg mb-6 text-center border border-green-800 flex items-center justify-center space-x-2">
          <span>✅</span>
          <span className="font-semibold">{mensajeExito}</span>
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700 text-gray-300">
        <p className="mb-2"><strong className="text-amber-400">ID:</strong> {usuario.id}</p>
        <p className="mb-2"><strong className="text-amber-400">Nombre Completo:</strong> {usuario.nombres} {usuario.apellidos}</p>
        <p><strong className="text-amber-400">Correo Electrónico:</strong> {usuario.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm mb-1 text-gray-400">Modificar Rol *</label>
          <select name="rol_id" value={formData.rol_id} onChange={handleChange} required className={inputClass}>
            <option value="">-- Seleccione un rol (Obligatorio) --</option>
            <option value="1">Administrador</option>
            <option value="2">Estándar</option>
          </select>
        </div>

        <div className="flex flex-col mt-6 p-4 border border-gray-700 rounded bg-gray-900">
          <div className="flex items-center">
            <input type="checkbox" name="estado" checked={formData.estado} onChange={handleChange} className="h-5 w-5 rounded bg-gray-800 border-gray-600 text-amber-600 focus:ring-amber-500" />
            <label className="ml-3 font-medium text-gray-300 cursor-pointer">Usuario Activo en el Sistema</label>
          </div>
          <p className="text-xs text-gray-500 mt-2 ml-8">Si desmarcas esta casilla, el usuario no podrá iniciar sesión.</p>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-700">
          <button type="submit" className="bg-amber-600 text-white font-bold px-8 py-3 rounded hover:bg-amber-500 transition shadow-lg">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}