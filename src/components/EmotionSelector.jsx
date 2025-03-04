import React, { useState } from "react";

function EmotionSelector({ onSelectEmotion, selectedEmotion }) {
  // Lista completa de emociones
  const emotionsList = [
    "tristeza",
    "felicidad",
    "frustración",
    "ansiedad",
    "ira",
    "miedo",
    "amor",
    "culpa",
    "sorpresa",
    "asco",
    "desprecio",
    "inseguridad",
    "alivio",
    "esperanza",
    "desesperación",
    "calma"
  ];

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra la lista de emociones según el término de búsqueda
  const filteredEmotions = emotionsList.filter((emotion) =>
    emotion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    onSelectEmotion(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <label htmlFor="emotion-search" className="block text-sm font-medium text-gray-700 mb-2">
        Selecciona una emoción:
      </label>
      {/* Campo de búsqueda */}
      <input
        type="text"
        id="emotion-search"
        placeholder="Buscar emoción..."
        className="border border-gray-300 rounded p-2 w-full mb-2"
        value={searchTerm}
        onChange={handleSearch}
      />
      <select
        id="emotion"
        value={selectedEmotion}
        onChange={handleChange}
        className="border border-gray-300 rounded p-2 w-full"
      >
        <option value="">-- Selecciona una emoción --</option>
        {filteredEmotions.map((emotion) => (
          <option key={emotion} value={emotion}>
            {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EmotionSelector;
