// StatsPanel.jsx
import React from "react";

function StatsPanel({ stats, entries }) {
  // Usamos stats.combined
  const combined = stats.combined || {};
  const hasData = Object.keys(combined).length > 0;

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold">Estadísticas</h2>
      {!hasData ? (
        <p>No hay datos registrados aún</p>
      ) : (
        <ul>
          {Object.entries(combined).map(([emotion, { intensityAvg, questionsAvg, combinedAvg, count }]) => {
            // Filtramos las notas de las entradas con esta emoción
            const notesForEmotion = entries
              .filter((en) => en.emotion === emotion && en.note)
              .map((en, i) => (
                <li key={i} className="ml-4">
                  Nota: {en.note}
                </li>
              ));
            return (
              <li key={emotion} className="mt-2">
                <strong>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}:</strong>
                <ul className="ml-4 list-disc">
                  <li>Intensidad Promedio: {intensityAvg.toFixed(2)}</li>
                  <li>Promedio de Preguntas: {questionsAvg.toFixed(2)}</li>
                  <li>Promedio Combinado: {combinedAvg.toFixed(2)}</li>
                  <li>Total Registros: {count}</li>
                </ul>
                {notesForEmotion.length > 0 && (
                  <ul className="list-disc">{notesForEmotion}</ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default StatsPanel;
