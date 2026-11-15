"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Definimos la estructura del contacto
interface Contacto {
  id: number;
  nombres: string;
  apellidos: string;
  celular: string;
  correo: string;
  favorito: boolean;
}

export default function ContactosPage() {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Función para ir a traer los contactos al backend
    const fetchContactos = async () => {
      const token = localStorage.getItem("token"); // Sacamos la llave
      
      // Si alguien intenta entrar sin token, lo regresamos al login
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:4000/api/contactos", {
          headers: { Authorization: `Bearer ${token}` } // Enviamos el token al portero
        });
        setContactos(response.data);
      } catch (error) {
        console.error("Error al cargar contactos:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchContactos();
  }, [router]);

  // Lógica del buscador: Filtra por nombre o apellido mientras escribes
  const contactosFiltrados = contactos.filter(c => 
    `${c.nombres} ${c.apellidos}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-200">Mis Contactos</h1>
        <Link 
          href="/contactos/nuevo" 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-medium"
        >
          + Nuevo Contacto
        </Link>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o apellido..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          // Cambiamos a bg-gray-800 y text-white para el modo oscuro
          className="w-full p-3 border border-gray-600 bg-gray-800 rounded shadow-sm text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Cuadrícula de Contactos */}
      {contactosFiltrados.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">No se encontraron contactos en tu agenda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contactosFiltrados.map((contacto) => (
            <div key={contacto.id} className="bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-700 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-blue-100">
                    {contacto.nombres} {contacto.apellidos}
                  </h2>
                  <span className="text-2xl" title={contacto.favorito ? "Favorito" : ""}>
                    {contacto.favorito ? "⭐" : "☆"}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">📱 {contacto.celular || "Sin celular registrado"}</p>
                <p className="text-gray-300 text-sm">✉️ {contacto.correo || "Sin correo registrado"}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-600">
                <Link href={`/contactos/${contacto.id}`} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Ver detalles completos &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}