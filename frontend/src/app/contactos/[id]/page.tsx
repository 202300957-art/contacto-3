"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function DetallesContacto() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [contacto, setContacto] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  
  // Nuevo estado para manejar los mensajes de éxito (verde)
  const [mensajeExito, setMensajeExito] = useState(""); 
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchContacto = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:4000/api/contactos", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const encontrado = response.data.find((c: any) => c.id.toString() === id);
        
        if (encontrado) {
          setContacto(encontrado);
          setFormData(encontrado);
        } else {
          setError("Contacto no encontrado.");
        }
      } catch (error) {
        setError("Error al cargar los datos del contacto.");
      }
    };
    fetchContacto();
  }, [id, router]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensajeExito("");

    try {
      const token = localStorage.getItem("token");
      
      // FILTRO CLAVE: Convertimos los campos vacíos ("") en null para que PostgreSQL los acepte
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

      await axios.put(`http://localhost:4000/api/contactos/${id}`, datosLimpios, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setContacto(datosLimpios); // Actualizamos la vista de detalles con los datos limpios
      setIsEditing(false); // Cerramos el modo edición
      
      // Mostramos el mensaje de éxito
      setMensajeExito("¡Contacto actualizado exitosamente!");
      
      // Ocultamos el mensaje después de 3 segundos
      setTimeout(() => {
        setMensajeExito("");
      }, 3000);

    } catch (err: any) {
      setError(err.response?.data?.error || "Error al actualizar");
    }
  };

  const handleDelete = async () => {
    // 1. Mostrar la advertencia de confirmación del navegador
    const confirmar = window.confirm("⚠️ ¿Estás seguro de que deseas ELIMINAR este contacto? Esta acción no se puede deshacer.");
    
    // Si el usuario le da a "Cancelar", detenemos la función aquí
    if (!confirmar) return;

    // Si le da a "Aceptar", procedemos a borrarlo
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/contactos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // 2. Mostramos mensaje de éxito y esperamos 1.5 segundos antes de salir
      setMensajeExito("¡Contacto eliminado correctamente!");
      setTimeout(() => {
        router.push("/contactos"); 
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.error || "Error al eliminar");
    }
  };

  if (error && !contacto) return <div className="text-red-400 text-center mt-10 text-xl">{error}</div>;
  if (!contacto) return <div className="text-white text-center mt-10">Cargando detalles...</div>;

  const inputClass = "mt-1 block w-full p-2 border border-gray-600 bg-gray-800 rounded text-white focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="max-w-4xl mx-auto p-8 mt-6 bg-gray-900 rounded-lg shadow-md border border-gray-800">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-200">
          {isEditing ? "Editar Contacto" : "Detalles del Contacto"}
        </h1>
        <Link href="/contactos" className="text-blue-400 hover:text-blue-300 hover:underline transition">
          &larr; Volver
        </Link>
      </div>

      {error && <p className="bg-red-900/50 text-red-200 p-3 rounded mb-6 text-center border border-red-800">{error}</p>}
      
      {mensajeExito && (
        <div className="bg-green-900/50 text-green-200 p-4 rounded-lg mb-6 text-center border border-green-800 flex items-center justify-center space-x-2 transition-all">
          <span>✅</span>
          <span className="font-semibold">{mensajeExito}</span>
        </div>
      )}

      {!isEditing ? (
        /* --- VISTA DE DETALLES (SOLO LECTURA) --- */
        <div className="space-y-4 text-gray-300">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">
              {contacto.nombres} {contacto.apellidos} {contacto.favorito && "⭐"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p><strong className="text-blue-300">Celular:</strong> {contacto.celular || "N/A"}</p>
            <p><strong className="text-blue-300">Teléfono Fijo:</strong> {contacto.telefono_fijo || "N/A"}</p>
            <p><strong className="text-blue-300">Correo:</strong> {contacto.correo || "N/A"}</p>
            <p><strong className="text-blue-300">Género:</strong> {contacto.genero || "N/A"}</p>
            <p><strong className="text-blue-300">Relación:</strong> {contacto.relacion || "N/A"}</p>
            <p><strong className="text-blue-300">Cumpleaños:</strong> {contacto.fecha_nacimiento || "N/A"}</p>
            <p className="col-span-1 md:col-span-2"><strong className="text-blue-300">Dirección de casa:</strong> {contacto.direccion_casa || "N/A"}</p>
            <p className="col-span-1 md:col-span-2"><strong className="text-blue-300">Dirección de trabajo:</strong> {contacto.direccion_trabajo || "N/A"}</p>
          </div>
          
          <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-700">
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500 transition shadow-lg">
              Editar Contacto
            </button>
            <button onClick={handleDelete} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500 transition shadow-lg">
              Eliminar Contacto
            </button>
          </div>
        </div>
      ) : (
        /* --- FORMULARIO DE EDICIÓN COMPLETO --- */
        <form onSubmit={handleUpdate} className="space-y-6 text-gray-300 bg-gray-800 p-6 rounded-lg border border-gray-700">
          
          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1 text-gray-400">Nombres *</label>
              <input type="text" name="nombres" value={formData.nombres || ""} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-400">Apellidos *</label>
              <input type="text" name="apellidos" value={formData.apellidos || ""} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          {/* Teléfonos y Correo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm mb-1 text-gray-400">Celular</label>
              <input type="text" name="celular" value={formData.celular || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-400">Teléfono fijo</label>
              <input type="text" name="telefono_fijo" value={formData.telefono_fijo || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-400">Correo Electrónico</label>
              <input type="email" name="correo" value={formData.correo || ""} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Direcciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1 text-gray-400">Dirección de casa</label>
              <input type="text" name="direccion_casa" value={formData.direccion_casa || ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-400">Dirección de trabajo</label>
              <input type="text" name="direccion_trabajo" value={formData.direccion_trabajo || ""} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          
          {/* Selects y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm mb-1 text-gray-400">Género</label>
              <select name="genero" value={formData.genero || ""} onChange={handleChange} className={inputClass}>
                <option value="">Seleccione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-400">Fecha de nacimiento</label>
              {/* Ajuste para que la fecha cargue correctamente si ya existe */}
              <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento ? formData.fecha_nacimiento.split('T')[0] : ""} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-400">Relación personal</label>
              <select name="relacion" value={formData.relacion || ""} onChange={handleChange} className={inputClass}>
                <option value="">Seleccione...</option>
                <option value="Familia">Familia</option>
                <option value="Amigo">Amigo</option>
                <option value="Trabajo">Trabajo</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          {/* Favorito */}
          <div className="flex items-center mt-6 p-4 border border-gray-700 rounded bg-gray-900">
            <input type="checkbox" name="favorito" checked={formData.favorito || false} onChange={handleChange} className="h-5 w-5 rounded bg-gray-800 border-gray-600 text-blue-600" />
            <label className="ml-3 font-medium text-gray-300 cursor-pointer">Marcar como favorito ⭐</label>
          </div>

          {/* Botones */}
          <div className="flex space-x-4 mt-6 pt-4 border-t border-gray-700">
            <button type="submit" className="bg-green-600 text-white font-bold px-6 py-2 rounded hover:bg-green-500 transition shadow-lg">
              Guardar Cambios
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-500 transition">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}