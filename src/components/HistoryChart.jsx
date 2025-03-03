import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

function HistoryChart({ entries, stats }) {
  //
  // 1) GRÁFICO DE INTENSIDAD A LO LARGO DEL TIEMPO
  //
  // Cada entrada: { emotion, intensity, date, responses, note (opcional) }
  // Construimos datos para un LineChart secuencial
  const intensityData = entries.map((entry) => ({
    name: `${entry.date} - ${entry.emotion}`,
    intensity: entry.intensity,
  }));

  //
  // 2) GRÁFICO DE FRECUENCIA DE EMOCIONES
  //
  // Contamos cuántas veces aparece cada emoción
  // Ej: { tristeza: 4, felicidad: 6, ira: 2, ... }
  const frequencyMap = {};
  for (const entry of entries) {
    const emo = entry.emotion;
    if (!frequencyMap[emo]) {
      frequencyMap[emo] = 0;
    }
    frequencyMap[emo]++;
  }
  // Convertimos en array para Recharts
  // Ej: [ { emotion: 'tristeza', count: 4 }, { emotion: 'felicidad', count: 6 }, ... ]
  const frequencyData = Object.entries(frequencyMap).map(([emotion, count]) => ({
    emotion,
    count,
  }));

  //
  // 3) GRÁFICO DE PROMEDIO DE PREGUNTAS POR EMOCIÓN
  //
  // stats.by_question => { emocion: { "0": 3.6, "1": 2.5 }, felicidad: { "0": 4.0, "1": 3.5 } ... }
  // Si queremos un solo valor por emoción (la media de todos los índices de pregunta):
  const questionAvgData = [];
  if (stats && stats.by_question) {
    for (const [emotion, qIndexes] of Object.entries(stats.by_question)) {
      // qIndexes es un objeto: { "0": number, "1": number, ... }
      const values = Object.values(qIndexes); // array de promedios de cada pregunta
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = sum / values.length;
      questionAvgData.push({ emotion, avg });
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-4">
      <h2 className="text-xl font-semibold mb-4">Gráficos de Emociones</h2>

      {/* 1) INTENSIDAD A LO LARGO DEL TIEMPO */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2">Intensidad Registrada (Linea del tiempo)</h3>
        {entries.length === 0 ? (
          <p>No hay datos de intensidad aún.</p>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={intensityData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="intensity" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 2) FRECUENCIA DE EMOCIONES */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2">Frecuencia de Emociones</h3>
        {frequencyData.length === 0 ? (
          <p>No hay datos de frecuencia aún.</p>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={frequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emotion" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 3) PROMEDIO DE PREGUNTAS POR EMOCIÓN */}
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Promedio de Preguntas (por Emoción)</h3>
        {questionAvgData.length === 0 ? (
          <p>No hay datos de preguntas aún.</p>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={questionAvgData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emotion" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryChart;
