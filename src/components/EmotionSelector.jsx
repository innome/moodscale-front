import React from "react";

const emotionsList = [
  "tristeza",
  "felicidad",
  "frustración",
  "ansiedad",
  "ira",
  "miedo",
  "amor",
  "culpa",
  "sorpresa"
];

function EmotionSelector({ onSelectEmotion, selectedEmotion }) {
  const handleChange = (e) => {
    onSelectEmotion(e.target.value);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <label htmlFor="emotion" className="block text-sm font-medium text-gray-700 mb-2">
        Selecciona una emoción:
      </label>
      <select
        id="emotion"
        value={selectedEmotion}
        onChange={handleChange}
        className="border border-gray-300 rounded p-2 w-full"
      >
        <option value="">-- Selecciona una emoción --</option>
        {emotionsList.map((emotion) => (
          <option key={emotion} value={emotion}>
            {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EmotionSelector;
