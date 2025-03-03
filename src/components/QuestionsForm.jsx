import React, { useState } from "react";

function QuestionsForm({ emotion, questions, onSubmit }) {
  const [intensity, setIntensity] = useState(1);
  const [responses, setResponses] = useState({});
  const [note, setNote] = useState("");

  const handleOptionChange = (questionIndex, optionValue) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: optionValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      emotion,
      intensity: parseInt(intensity, 10),
      responses,
      date: new Date().toISOString().split("T")[0],
      note,
    };
    onSubmit(formData);
    setIntensity(1);
    setResponses({});
    setNote("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-xl font-semibold mb-4 capitalize">
        Preguntas para: {emotion}
      </h3>

      <label className="block mb-2 font-medium">
        Intensidad general (1-5):
      </label>
      <input
        type="range"
        min="1"
        max="5"
        value={intensity}
        onChange={(e) => setIntensity(e.target.value)}
        className="w-full mb-2"
      />
      <div className="text-sm text-gray-600 mb-4">
        Valor seleccionado: {intensity}
      </div>

      {questions.map((q, index) => (
        <div key={index} className="mb-4">
          <p className="font-semibold mb-2">{q.question}</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(q.options).map(([optionText, optionValue]) => (
              <label
                key={optionText}
                className="flex items-center space-x-1 bg-gray-200 rounded px-2 py-1 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={optionValue}
                  checked={responses[index] === optionValue}
                  onChange={() => handleOptionChange(index, optionValue)}
                />
                <span>{optionText} ({optionValue})</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <label className="block mb-2 font-medium">
        Nota (¿Qué fue lo que ocurrió?):
      </label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full border border-gray-300 rounded p-2 mb-4"
        rows="3"
        placeholder="Describe brevemente la situación..."
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Enviar
      </button>
    </form>
  );
}

export default QuestionsForm;
