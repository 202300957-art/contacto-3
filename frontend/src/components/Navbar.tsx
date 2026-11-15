"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Para que el menú se actualice al cambiar de página
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        // Decodificamos la carga útil (payload) del JWT para leer los datos del usuario
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        
        // Verificamos si el rol es Administrador (asumiendo que rol_id 1 es Admin)
        if (decodedPayload.rol_id === 1) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error al leer el token JWT");
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push("/login");
  };

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md border-b border-slate-800">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wide text-blue-400">
          📇 Contactos UJMD
        </Link>
        
        <div className="space-x-6 flex items-center">
          {isLoggedIn ? (
            <>
              <Link href="/contactos" className="hover:text-blue-300 transition text-gray-200">
                Mis Contactos
              </Link>
              
              {/* Botón exclusivo para Administradores */}
              {isAdmin && (
                <Link href="/admin" className="hover:text-amber-400 transition text-amber-500 font-medium flex items-center gap-1">
                  🛡️ Panel Admin
                </Link>
              )}
              
              {/* Botón de Cerrar Sesión */}
              <button 
                onClick={handleLogout} 
                className="bg-red-600/20 text-red-400 border border-red-800/50 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition font-medium">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}