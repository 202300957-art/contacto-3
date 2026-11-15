"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoUsuarioAdmin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    rol_id: "" // Lo iniciamos vacío para forzar la validación de la rúbrica
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensajeExito("");

    // Validación estricta en el Frontend exigida por la rúbrica
    if (!formData.rol_id || formData.rol_id === "") {
      setError("Error: El campo rol es obligatorio. Ningún usuario puede quedar con el rol vacío.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // EMPAQUETAMOS LOS DATOS Y CONVERTIMOS EL ROL A NÚMERO (Integer)
      const datosAEnviar = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        password: formData.password,
        rol_id: parseInt(formData.rol_id) // <-- Esta es la corrección clave
      };

      // Enviamos la petición POST 
      await axios.post("http://localhost:4000/api/admin/usuarios", datosAEnviar, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMensajeExito("¡Usuario creado exitosamente!");
      
      // Redirigir de vuelta a la tabla después de 1.5 segundos
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
      
    } catch (err: any) {
      console.error(err); // Para ver el error exacto en la consola del navegador
      setError(err.response?.data?.error || "Error al crear el usuario. Revisa los datos.");
    }
  };

  const inputClass = "mt-1 block w-full p-2 border border-gray-600 bg-gray-800 rounded text-white focus:ring-amber-500 focus:border-amber-500";

  return (
    <div className="max-w-3xl mx-auto p-8 mt-6 bg-gray-900 rounded-lg shadow-md border border-gray-800">
      
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-amber-500">Crear Nuevo Usuario</h1>
        <Link href="/admin" className="text-amber-400 hover:text-amber-300 hover:underline transition">
          &larr; Volver al Panel
        </Link>
      </div>

      {/* Mensajes de error o éxito */}
      {error && <p className="bg-red-900/50 text-red-200 p-3 rounded mb-6 text-center border border-red-800">{error}</p>}
      {mensajeExito && (
        <div className="bg-green-900/50 text-green-200 p-4 rounded-lg mb-6 text-center border border-green-800 flex items-center justify-center space-x-2">
          <span>✅</span>
          <span className="font-semibold">{mensajeExito}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Nombres *</label>
            <input type="text" name="nombres" required onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Apellidos *</label>
            <input type="text" name="apellidos" required onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Correo Electrónico *</label>
            <input type="email" name="email" required onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Definir Contraseña *</label>
            <input type="password" name="password" required minLength={6} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {/* Selección de Rol con Validación */}
        <div>
          <label className="block text-sm mb-1 text-gray-400">Asignar Rol *</label>
          <select name="rol_id" required value={formData.rol_id} onChange={handleChange} className={inputClass}>
            <option value="">-- Seleccione un rol (Obligatorio) --</option>
            <option value="1">Administrador</option>
            <option value="2">Estándar</option>
          </select>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-700">
          <button type="submit" className="bg-amber-600 text-white font-bold px-8 py-3 rounded hover:bg-amber-500 transition shadow-lg">
            Guardar Usuario
          </button>
        </div>
      </form>
    </div>
  );
}