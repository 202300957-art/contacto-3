"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol_id: number;
  estado: boolean;
}

export default function PanelAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Validación de seguridad extra en el frontend
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        if (decodedPayload.rol_id !== 1) {
          router.push("/contactos"); // Si no es admin, lo expulsamos a sus contactos
          return;
        }

        // Si es admin, traemos la lista de usuarios
        const response = await axios.get("http://localhost:4000/api/admin/usuarios", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsuarios(response.data);
      } catch (err: any) {
        setError("No tienes permisos para ver esta página o tu sesión expiró.");
      }
    };

    fetchUsuarios();
  }, [router]);

  const handleDarDeBaja = async (id: number) => {
    const confirmar = window.confirm("⚠️ ¿Estás seguro de dar de baja (eliminar) a este usuario? Perderá acceso al sistema y se borrarán sus contactos.");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/admin/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Actualizamos la lista quitando al usuario eliminado
      setUsuarios(usuarios.filter(user => user.id !== id));
      setMensajeExito("Usuario dado de baja correctamente.");
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al eliminar el usuario");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-500 flex items-center gap-2">
            🛡️ Panel de Administración
          </h1>
          <p className="text-gray-400 mt-1">Gestión de usuarios y roles del sistema</p>
        </div>
        <Link 
          href="/admin/nuevo" 
          className="bg-amber-600 text-white px-5 py-2 rounded hover:bg-amber-500 transition font-bold shadow-lg"
        >
          + Nuevo Usuario
        </Link>
      </div>

      {error && <p className="bg-red-900/50 text-red-200 p-3 rounded mb-6 text-center border border-red-800">{error}</p>}
      {mensajeExito && <p className="bg-green-900/50 text-green-200 p-3 rounded mb-6 text-center border border-green-800">{mensajeExito}</p>}

      <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 overflow-hidden">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-800 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Nombre Completo</th>
              <th className="p-4 font-semibold">Correo Electrónico</th>
              <th className="p-4 font-semibold">Rol</th>
              <th className="p-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">Cargando usuarios...</td>
              </tr>
            ) : (
              usuarios.map((user) => (
                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="p-4">{user.id}</td>
                  <td className="p-4 font-medium text-white">{user.nombres} {user.apellidos}</td>
                  <td className="p-4 text-blue-300">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.rol_id === 1 ? "bg-amber-900/50 text-amber-400 border border-amber-800" : "bg-blue-900/50 text-blue-400 border border-blue-800"
                    }`}>
                      {user.rol_id === 1 ? "Administrador" : "Estándar"}
                    </span>
                  </td>
                  <td className="p-4 text-center space-x-3">
                    <Link 
                      href={`/admin/${user.id}`} 
                      className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Editar
                    </Link>
                    <button 
                      onClick={() => handleDarDeBaja(user.id)}
                      className="text-red-400 hover:text-red-300 font-medium"
                    >
                      Dar de baja
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}