"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoContacto() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  
  // Estado inicial con todos los campos 
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    celular: "",
    telefono_fijo: "",
    correo: "",
    direccion_casa: "",
    direccion_trabajo: "",
    genero: "",
    fecha_nacimiento: "",
    relacion: "",
    favorito: false
  });

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

    try {
      const token = localStorage.getItem("token");
      
      // FILTRO CLAVE: Convertimos los campos vacíos ("") en null para que PostgreSQL los acepte como opcionales
      const datosLimpios = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        celular: formData.celular === "" ? null : formData.celular,
        telefono_fijo: formData.telefono_fijo === "" ? null : formData.telefono_fijo,
        correo: formData.correo === "" ? null : formData.correo,
        direccion_casa: formData.direccion_casa === "" ? null : formData.direccion_casa,
        direccion_trabajo: formData.direccion_trabajo === "" ? null : formData.direccion_trabajo,
        genero: formData.genero === "" ? null : formData.genero,
        fecha_nacimiento: formData.fecha_nacimiento === "" ? null : formData.fecha_nacimiento,
        relacion: formData.relacion === "" ? null : formData.relacion,
        favorito: formData.favorito
      };

      await axios.post("http://localhost:4000/api/contactos", datosLimpios, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Mostrar mensaje de éxito y esperar 1.5 segundos antes de redirigir
      setExito(true);
      setTimeout(() => {
        router.push("/contactos");
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.error || "Error al guardar el contacto");
    }
  };

  // Clases de Tailwind reutilizables para mantener el diseño oscuro consistente
  const inputClass = "mt-1 block w-full p-2 border border-gray-600 bg-gray-800 rounded text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-medium text-gray-300";

  return (
    <div className="max-w-4xl mx-auto p-8 mt-6">
      <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-200">Agregar Nuevo Contacto</h1>
        <Link href="/contactos" className="text-blue-400 hover:text-blue-300 hover:underline transition">
          &larr; Volver a la lista
        </Link>
      </div>

      {error && <p className="bg-red-900/50 text-red-200 p-3 rounded mb-6 text-center border border-red-800">{error}</p>}
    
      {/* Nuevo mensaje de éxito */}
      {exito && (
        <div className="bg-green-900/50 text-green-200 p-4 rounded-lg mb-6 text-center border border-green-800 flex items-center justify-center space-x-2">
          <span>✅</span>
          <span className="font-semibold">¡Contacto guardado exitosamente!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-md">
        
        {/* Nombres y Apellidos (Obligatorios) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Nombres *</label>
            <input type="text" name="nombres" required onChange={handleChange} className={inputClass} placeholder="Ej. Juan René" />
          </div>
          <div>
            <label className={labelClass}>Apellidos *</label>
            <input type="text" name="apellidos" required onChange={handleChange} className={inputClass} placeholder="Ej. Arévalo" />
          </div>
        </div>

        {/* Teléfonos y Correo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Celular</label>
            <input type="text" name="celular" onChange={handleChange} className={inputClass} placeholder="Ej. 7000-0000" />
          </div>
          <div>
            <label className={labelClass}>Teléfono fijo</label>
            <input type="text" name="telefono_fijo" onChange={handleChange} className={inputClass} placeholder="Ej. 2200-0000" />
          </div>
          <div>
            <label className={labelClass}>Correo Electrónico</label>
            <input type="email" name="correo" onChange={handleChange} className={inputClass} placeholder="correo@ejemplo.com" />
          </div>
        </div>

        {/* Direcciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Dirección de casa</label>
            <input type="text" name="direccion_casa" onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Dirección de trabajo</label>
            <input type="text" name="direccion_trabajo" onChange={handleChange} className={inputClass} />
          </div>
        </div>
        
        {/* Selects y Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Género</label>
            <select name="genero" onChange={handleChange} className={inputClass}>
              <option value="">Seleccione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Fecha de nacimiento</label>
            <input type="date" name="fecha_nacimiento" onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Relación personal</label>
            <select name="relacion" onChange={handleChange} className={inputClass}>
              <option value="">Seleccione...</option>
              <option value="Familia">Familia</option>
              <option value="Amigo">Amigo</option>
              <option value="Trabajo">Trabajo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        {/* Checkbox de Favorito */}
        <div className="flex items-center mt-4 pt-4 border-t border-gray-800">
          <input type="checkbox" name="favorito" id="favorito" onChange={handleChange}
            className="h-5 w-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-900" />
          <label htmlFor="favorito" className="ml-3 block text-md text-gray-300 font-medium cursor-pointer">
            ⭐ Marcar como contacto favorito
          </label>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-blue-600 text-white font-bold px-8 py-3 rounded hover:bg-blue-500 transition shadow-lg">
            Guardar Contacto
          </button>
        </div>
      </form>
    </div>
  );
}