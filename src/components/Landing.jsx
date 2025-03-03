// src/components/Landing.jsx
import React, { useEffect } from "react";

function Landing({ onDone }) {
  useEffect(() => {
    // Tras 3s, ocultamos la pantalla de bienvenida
    const timer = setTimeout(() => {
      onDone();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-blue-200 to-white">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-slate-700 animate-pulse">
          ¡Bienvenido!
        </h1>
        <p className="text-lg text-gray-600">Cargando la experiencia...</p>
      </div>
    </div>
  );
}

export default Landing;
