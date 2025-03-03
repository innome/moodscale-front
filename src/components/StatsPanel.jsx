// StatsPanel.jsx
import React from "react";

function StatsPanel({ stats, entries }) {
  const { overall, by_question } = stats;
  const hasData = Object.keys(overall).length > 0;

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold">Estadísticas</h2>

      {!hasData ? (
        <p>No hay datos registrados aún</p>
      ) : (
        <>
          {/* PROMEDIO GENERAL */}
          <h3 className="text-lg font-medium mt-4">Promedio General (overall)</h3>
          <ul>
            {Object.entries(overall).map(([emotion, avg]) => {
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
                  {/* Mostramos el nombre y promedio */}
                  <strong>{emotion}:</strong>{" "}
                  {typeof avg === "number" ? avg.toFixed(2) : avg}

                  {/* Si existen notas, las listamos debajo */}
                  {notesForEmotion.length > 0 && (
                    <ul className="list-disc">{notesForEmotion}</ul>
                  )}
                </li>
              );
            })}
          </ul>

          {/* PROMEDIO POR PREGUNTA */}
          <h3 className="text-lg font-medium mt-4">Promedio por Pregunta (by_question)</h3>
          {Object.entries(by_question).map(([emotion, questionsObj]) => (
            <div key={emotion} className="border border-gray-300 rounded p-2 my-2">
              <h4 className="font-semibold">
                {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
              </h4>
              <ul className="ml-4 list-disc">
                {Object.entries(questionsObj).map(([qIndex, qAvg]) => (
                  <li key={qIndex}>
                    Pregunta {qIndex}: {qAvg.toFixed(2)}
                  </li>
                ))}
              </ul>

              {/* Mostrar las notas de esa emoción */}
              {entries
                .filter((entry) => entry.emotion === emotion && entry.note)
                .map((entry, idx) => (
                  <p key={idx} className="mt-1 italic">
                    Nota: {entry.note}
                  </p>
                ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default StatsPanel;
