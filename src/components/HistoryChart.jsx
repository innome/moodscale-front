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
  // 1) TERMÓMETRO EMOCIONAL: Calcular el valor combinado por fecha y emoción
  // El valor combinado se define como:
  // (intensidad + promedio de respuestas) / 2
  const datesMap = {};
  entries.forEach((entry) => {
    const { date, emotion, intensity, responses } = entry;
    let avgResponse = 0;
    const responseValues = Object.values(responses || {});
    if (responseValues.length > 0) {
      avgResponse = responseValues.reduce((a, b) => a + b, 0) / responseValues.length;
    }
    const combinedScore = (intensity + avgResponse) / 2;
    if (!datesMap[date]) {
      datesMap[date] = {};
    }
    if (!datesMap[date][emotion]) {
      datesMap[date][emotion] = [];
    }
    datesMap[date][emotion].push(combinedScore);
  });
  
  // Para cada fecha, se calcula el promedio de cada emoción y además un valor general
  const lineChartData = Object.entries(datesMap).map(([date, emotionData]) => {
    const dataPoint = { date };
    let total = 0;
    let count = 0;
    Object.entries(emotionData).forEach(([emotion, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      dataPoint[emotion] = avg;
      total += avg;
      count++;
    });
    dataPoint.general = count > 0 ? total / count : 0;
    return dataPoint;
  });
  // Ordenar cronológicamente
  lineChartData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Extraer la lista de emociones (excluyendo "date" y "general")
  const emotionKeys = new Set();
  lineChartData.forEach((data) => {
    Object.keys(data).forEach((key) => {
      if (key !== "date" && key !== "general") {
        emotionKeys.add(key);
      }
    });
  });
  const emotionList = Array.from(emotionKeys);

  // 2) FRECUENCIA DE EMOCIONES: Conteo de ocurrencias por emoción
  const frequencyMap = {};
  entries.forEach((entry) => {
    frequencyMap[entry.emotion] = (frequencyMap[entry.emotion] || 0) + 1;
  });
  const frequencyData = Object.entries(frequencyMap).map(([emotion, count]) => ({
    emotion,
    count,
  }));

  // 3) PROMEDIO DE PREGUNTAS POR EMOCIÓN: Usando stats.by_question
  const questionAvgData = [];
  if (stats && stats.by_question) {
    for (const [emotion, qIndexes] of Object.entries(stats.by_question)) {
      const values = Object.values(qIndexes);
      const avg = values.reduce((acc, val) => acc + val, 0) / values.length;
      questionAvgData.push({ emotion, avg });
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-4">
      <h2 className="text-xl font-semibold mb-4">Gráficos de Emociones</h2>

      {/* 1) TERMÓMETRO EMOCIONAL: LineChart */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2">
          Termómetro Emocional (Valor combinado por Fecha)
        </h3>
        {lineChartData.length === 0 ? (
          <p>No hay datos de intensidad aún.</p>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                {/* Suponiendo que los valores combinados están en la misma escala */}
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                {/* Líneas para cada emoción */}
                {emotionList.map((emotion, index) => (
                  <Line
                    key={emotion}
                    type="monotone"
                    dataKey={emotion}
                    stroke={`hsl(${(index * 40) % 360}, 70%, 50%)`}
                    dot={false}
                    connectNulls={true}
                    name={emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                  />
                ))}
                {/* Línea general: promedio de todas las emociones */}
                <Line
                  type="monotone"
                  dataKey="general"
                  stroke="#000"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  connectNulls={true}
                  name="General"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 2) FRECUENCIA DE EMOCIONES: BarChart */}
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

      {/* 3) PROMEDIO DE PREGUNTAS POR EMOCIÓN: BarChart */}
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
