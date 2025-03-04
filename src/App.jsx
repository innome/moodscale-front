import React, { useState, useEffect } from "react";
import Landing from "./components/Landing";
import EmotionSelector from "./components/EmotionSelector";
import QuestionsForm from "./components/QuestionsForm";
import HistoryChart from "./components/HistoryChart";
import StatsPanel from "./components/StatsPanel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [loading, setLoading] = useState(true);

  // Ejemplo de tabs
  const [activeTab, setActiveTab] = useState("addEmotion");
  
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({
    overall: {},
    by_question: {}
  });

  // Ocultar la pantalla de bienvenida tras 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchEntries();
    fetchStatistics();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/entries/");
      if (!response.ok) throw new Error("Error al obtener entradas");
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch("/api/stats/");
      if (!response.ok) throw new Error("Error al obtener estadísticas");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectEmotion = async (emotion) => {
    setSelectedEmotion(emotion);
    if (emotion) {
      try {
        const response = await fetch(`/api/questions/${emotion}`);
        if (!response.ok) throw new Error("Error al obtener preguntas");
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error(error);
        setQuestions([]);
      }
    } else {
      setQuestions([]);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch("/api/log_emotion/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Error al registrar emoción");
      await response.json();

      fetchEntries();
      fetchStatistics();
      toast.success("¡Emoción registrada exitosamente!");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al registrar la emoción.");
    }
  };

  // Si está la pantalla de bienvenida
  if (loading) {
    return <Landing onDone={() => setLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenedor centrado */}
      <div className="container mx-auto px-4 py-6">
        <ToastContainer />

        {/* Encabezado principal */}
        <h1 className="text-3xl font-bold mb-6">MoodScale</h1>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab("addEmotion")}
            className={
              activeTab === "addEmotion"
                ? "px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-semibold"
                : "px-4 py-2 text-gray-600 hover:text-blue-500"
            }
          >
            Agregar Emociones
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={
              activeTab === "history"
                ? "px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-semibold"
                : "px-4 py-2 text-gray-600 hover:text-blue-500"
            }
          >
            Ver Historial
          </button>
        </div>

        {/* Layout responsive: 2 columnas en md, 1 en pantallas pequeñas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Col principal (ocupa 2/3 en pantallas md) */}
          <div className="md:col-span-2 bg-white shadow p-4 rounded">
            {activeTab === "addEmotion" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Selecciona una Emoción</h2>
                <EmotionSelector
                  onSelectEmotion={handleSelectEmotion}
                  selectedEmotion={selectedEmotion}
                />
                {selectedEmotion && questions.length > 0 && (
                  <QuestionsForm
                    emotion={selectedEmotion}
                    questions={questions}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Historial de Emociones</h2>
                {entries.length === 0 ? (
                  <p className="text-gray-600">No hay datos registrados aún.</p>
                ) : (
                  entries.map((entry, idx) => (
                    <div key={idx} className="border-b border-gray-300 py-2">
                      <p className="font-semibold capitalize">
                        {entry.date} - {entry.emotion}
                      </p>
                      <p>Intensidad: {entry.intensity}</p>
                      {entry.note && <p>Nota: {entry.note}</p>}
                    </div>
                  ))
                )}

                <div className="mt-4">
                  <StatsPanel stats={stats} entries={entries} />
                </div>
              </div>
            )}
          </div>

          {/* Col lateral (ocupa 1/3 en md) */}
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Gráficos</h2>
            <p className="text-gray-600 mb-2">
              Evolución de intensidades y estadísticas
            </p>
            {/* HistoryChart recibe entries y stats */}
            <HistoryChart entries={entries} stats={stats} />
          </div>
        </div>
      </div>
      <footer className="bg-white text-center py-4 border-t border-gray-300">
        <p className="text-gray-600">
          <a href="https://www.instagram.com/_innome_/"><span className="font-semibold">🐢 @_innome_ 🐢</span></a> 
        </p>
      </footer>
    </div>
  );
}

export default App;
