import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Ruta del archivo de datos (ajústala según donde lo ubiques)
const DATA_FILE = path.join(__dirname, 'emotions_log.json')

// Función para cargar los datos del JSON
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error("Error al leer emotions_log.json. Se inicializa como arreglo vacío.")
      return []
    }
  }
  return []
}

// Función para guardar los datos en el JSON
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4))
}

let emotionsLog = loadData()

// Base de datos de preguntas por emoción (igual a la que usas en tu backend original)
const questionsDB = {
  "tristeza": [
    {
      "question": "¿Te sientes así desde hace mucho?",
      "options": { "No": 1, "Poco tiempo": 2, "Sí, bastante": 4, "Siempre": 5 }
    },
    {
      "question": "¿Cómo describirías tu estado de ánimo?",
      "options": { "Leve nostalgia": 2, "Tristeza moderada": 3, "Tristeza profunda": 5 }
    },
    {
      "question": "¿Te sientes solo/a o desconectado/a de los demás?",
      "options": { "No": 1, "A veces": 3, "Frecuentemente": 4, "Siempre": 5 }
    },
    {
      "question": "¿Encuentras difícil disfrutar de actividades que solías amar?",
      "options": { "No": 1, "Pocas veces": 2, "A menudo": 4, "Siempre": 5 }
    }
  ],
  "felicidad": [
    {
      "question": "¿Qué generó esta emoción?",
      "options": { "Un logro": 3, "Alguien especial": 4, "Un evento inesperado": 2, "Nada en especial": 1 }
    },
    {
      "question": "¿Compartiste tu alegría con alguien?",
      "options": { "Sí": 4, "No": 1 }
    },
    {
      "question": "¿Te sientes satisfecho/a con tu vida en general?",
      "options": { "No": 1, "Algo": 2, "Bastante": 4, "Totalmente": 5 }
    },
    {
      "question": "¿Sientes gratitud por lo que tienes?",
      "options": { "Nunca": 1, "Rara vez": 2, "A veces": 4, "Siempre": 5 }
    }
  ],
  "frustración": [
    {
      "question": "¿Qué situación te frustró?",
      "options": { "Trabajo": 4, "Estudio": 3, "Familia": 2, "Otro": 1 }
    },
    {
      "question": "¿Qué tan difícil te resultó manejarla?",
      "options": { "Fácil de sobrellevar": 1, "Algo molesto": 2, "Muy complejo": 4, "Me superó": 5 }
    },
    {
      "question": "¿Con qué frecuencia sientes que tus esfuerzos no son reconocidos?",
      "options": { "Nunca": 1, "Rara vez": 2, "A veces": 4, "Frecuentemente": 5 }
    },
    {
      "question": "¿Sientes que no logras avanzar en tus metas?",
      "options": { "No": 1, "Levemente": 2, "Moderadamente": 4, "En gran medida": 5 }
    }
  ],
  "ansiedad": [
    {
      "question": "¿Sientes síntomas físicos como palpitaciones o sudoración?",
      "options": { "Nunca": 0, "A veces": 2, "Frecuentemente": 4, "Siempre": 5 }
    },
    {
      "question": "¿Te resulta difícil concentrarte?",
      "options": { "No": 1, "Un poco": 2, "Mucho": 4 }
    },
    {
      "question": "¿Te sientes abrumado/a por pensamientos negativos?",
      "options": { "Nunca": 0, "A veces": 2, "Frecuentemente": 4, "Siempre": 5 }
    },
    {
      "question": "¿Te cuesta relajarte incluso en momentos de calma?",
      "options": { "No": 1, "Pocas veces": 2, "A menudo": 4, "Siempre": 5 }
    }
  ],
  "ira": [
    {
      "question": "¿Expresaste tu enojo de forma impulsiva?",
      "options": { "No": 1, "Un poco": 2, "Sí": 4, "Muy impulsivamente": 5 }
    },
    {
      "question": "¿Te resultó difícil calmarte?",
      "options": { "No": 1, "Algo": 3, "Bastante": 5 }
    },
    {
      "question": "¿Te cuesta controlar tus reacciones cuando estás enojado/a?",
      "options": { "No": 1, "Pocas veces": 2, "A veces": 4, "Siempre": 5 }
    },
    {
      "question": "¿Te sientes resentido/a con facilidad?",
      "options": { "No": 1, "Levemente": 2, "Moderadamente": 4, "Muy resentido/a": 5 }
    }
  ],
  "miedo": [
    {
      "question": "¿Con qué frecuencia sientes temor?",
      "options": { "Casi nunca": 1, "A veces": 2, "A menudo": 4, "Siempre": 5 }
    },
    {
      "question": "¿Intentas evitar situaciones que te asustan?",
      "options": { "No": 0, "Algunas veces": 2, "Frecuentemente": 4, "Siempre": 5 }
    },
    {
      "question": "¿Te paralizas ante situaciones desconocidas?",
      "options": { "No": 1, "Rara vez": 2, "A veces": 4, "Siempre": 5 }
    },
    {
      "question": "¿Sientes que tus miedos limitan tus acciones?",
      "options": { "No": 1, "Pocas veces": 2, "A veces": 4, "Constantemente": 5 }
    }
  ],
  "amor": [
    {
      "question": "¿Qué tan cercana te sientes a la otra persona?",
      "options": { "Poco": 1, "Moderado": 3, "Bastante": 4, "Muchísimo": 5 }
    },
    {
      "question": "¿Expresas tu amor con facilidad?",
      "options": { "Rara vez": 1, "A veces": 2, "Casi siempre": 4, "Siempre": 5 }
    },
    {
      "question": "¿Te sientes apoyado/a y comprendido/a por los demás?",
      "options": { "No": 1, "Pocas veces": 2, "A veces": 4, "Siempre": 5 }
    },
    {
      "question": "¿Sientes una conexión profunda con las personas que amas?",
      "options": { "No": 1, "Levemente": 2, "Moderadamente": 4, "Profundamente": 5 }
    }
  ],
  "culpa": [
    {
      "question": "¿Sientes que hiciste algo mal?",
      "options": { "No": 1, "Dudoso": 2, "Un error importante": 4, "Muy grave": 5 }
    },
    {
      "question": "¿Has intentado reparar el daño?",
      "options": { "No": 1, "Parcialmente": 3, "Sí": 5 }
    },
    {
      "question": "¿Te resulta difícil perdonarte a ti mismo/a?",
      "options": { "No": 1, "Levemente": 2, "Moderadamente": 4, "Muy difícil": 5 }
    },
    {
      "question": "¿Crees que la culpa afecta tu bienestar diario?",
      "options": { "No": 1, "Pocas veces": 2, "A veces": 4, "Siempre": 5 }
    }
  ],
  "sorpresa": [
    {
      "question": "¿El evento fue inesperado?",
      "options": { "Leve sorpresa": 2, "Moderado": 3, "Muy sorprendente": 5 }
    },
    {
      "question": "¿Fue una sorpresa agradable?",
      "options": { "No": 1, "Algo": 3, "Sí": 5 }
    },
    {
      "question": "¿Te sientes abrumado/a por la inesperada novedad?",
      "options": { "No": 1, "Levemente": 2, "Moderadamente": 4, "Fuertemente": 5 }
    },
    {
      "question": "¿La sorpresa te deja sin palabras?",
      "options": { "Nunca": 1, "Rara vez": 2, "A veces": 4, "Frecuentemente": 5 }
    }
  ],
  "asco": [
    {
      "question": "¿Sientes repulsión hacia algo en este momento?",
      "options": { "No": 1, "Leve": 2, "Moderado": 3, "Fuerte": 5 }
    },
    {
      "question": "¿Qué tan difícil te resulta tolerar lo que te disgusta?",
      "options": { "Nada difícil": 1, "Poco difícil": 2, "Algo difícil": 4, "Muy difícil": 5 }
    },
    {
      "question": "¿El asco te impide interactuar con ciertas personas o lugares?",
      "options": { "No": 1, "Levemente": 2, "Moderadamente": 4, "Siempre": 5 }
    },
    {
      "question": "¿El asco te provoca reacciones físicas intensas?",
      "options": { "No": 1, "Poco": 2, "Bastante": 4, "Extremadamente": 5 }
    }
  ],
  "desprecio": [
    {
      "question": "¿Sientes desdén hacia ciertas personas o situaciones?",
      "options": { "No": 1, "Rara vez": 2, "A veces": 3, "Frecuentemente": 5 }
    },
    {
      "question": "¿Qué tan marcado es tu sentimiento de superioridad o rechazo?",
      "options": { "Leve": 1, "Moderado": 3, "Alto": 5 }
    },
    {
      "question": "¿Sientes que el desprecio te lleva a aislarte socialmente?",
      "options": { "No": 1, "Levemente": 2, "Moderadamente": 4, "Muy": 5 }
    },
    {
      "question": "¿El desprecio influye en tus relaciones personales?",
      "options": { "No": 1, "Poco": 2, "Algo": 4, "Mucho": 5 }
    }
  ],
  "inseguridad": [
    {
      "question": "¿Te sientes inseguro acerca de tus capacidades o decisiones?",
      "options": { "No": 1, "Rara vez": 2, "A veces": 3, "Frecuentemente": 5 }
    },
    {
      "question": "¿Qué tan afectada te sientes tu autoconfianza?",
      "options": { "Nada": 1, "Poco": 2, "Algo": 4, "Mucho": 5 }
    },
    {
      "question": "¿Te comparas frecuentemente con los demás de forma negativa?",
      "options": { "No": 1, "Rara vez": 2, "A veces": 4, "Siempre": 5 }
    },
    {
      "question": "¿Te cuesta tomar decisiones por miedo a equivocarte?",
      "options": { "No": 1, "Levemente": 2, "Moderadamente": 4, "Mucho": 5 }
    }
  ],
  "alivio": [
    {
      "question": "¿Sientes un cambio positivo tras superar una situación difícil?",
      "options": { "No": 1, "Leve": 2, "Moderado": 4, "Fuerte": 5 }
    },
    {
      "question": "¿Qué tan marcado es el sentimiento de liberación en ti?",
      "options": { "Muy bajo": 1, "Bajo": 2, "Alto": 4, "Muy alto": 5 }
    },
    {
      "question": "¿Sientes que el alivio mejora tu energía y motivación?",
      "options": { "No": 1, "Poco": 2, "Algo": 4, "Mucho": 5 }
    },
    {
      "question": "¿El alivio te ayuda a ver oportunidades donde antes solo había problemas?",
      "options": { "No": 1, "Levemente": 2, "Moderadamente": 4, "En gran medida": 5 }
    }
  ],
  "esperanza": [
    {
      "question": "¿Te sientes optimista acerca del futuro?",
      "options": { "Nada": 1, "Poco": 2, "Algo": 4, "Mucho": 5 }
    },
    {
      "question": "¿Qué tan fuerte es tu deseo de mejorar tu situación?",
      "options": { "Leve": 1, "Moderado": 3, "Fuerte": 5 }
    },
    {
      "question": "¿La esperanza te impulsa a tomar acciones positivas?",
      "options": { "No": 1, "Rara vez": 2, "A veces": 4, "Siempre": 5 }
    },
    {
      "question": "¿Te sientes inspirado/a a mejorar tu situación gracias a la esperanza?",
      "options": { "No": 1, "Levemente": 2, "Moderadamente": 4, "Profundamente": 5 }
    }
  ],
  "desesperación": [
    {
      "question": "¿Te sientes abrumado por la falta de soluciones a tus problemas?",
      "options": { "No": 1, "Rara vez": 2, "A veces": 4, "Frecuentemente": 5 }
    },
    {
      "question": "¿Qué tan marcada es tu sensación de desesperanza?",
      "options": { "Leve": 1, "Moderada": 3, "Fuerte": 5 }
    },
    {
      "question": "¿La desesperación te hace sentir atrapado/a sin salida?",
      "options": { "No": 1, "Levemente": 2, "Moderadamente": 4, "Fuertemente": 5 }
    },
    {
      "question": "¿Sientes que la desesperación afecta tu capacidad de tomar decisiones?",
      "options": { "No": 1, "Poco": 2, "Algo": 4, "Mucho": 5 }
    }
  ],
  "calma": [
    {
      "question": "¿Te sientes tranquilo y en paz?",
      "options": { "No": 1, "Algo": 2, "Bastante": 4, "Totalmente": 5 }
    },
    {
      "question": "¿Qué tan fácil es para ti mantener la serenidad en situaciones estresantes?",
      "options": { "Difícil": 1, "Algo difícil": 2, "Fácil": 4, "Muy fácil": 5 }
    },
    {
      "question": "¿Logras mantener la calma incluso en situaciones caóticas?",
      "options": { "No": 1, "A veces": 2, "Frecuentemente": 4, "Siempre": 5 }
    },
    {
      "question": "¿Sientes que la calma te ayuda a tomar mejores decisiones?",
      "options": { "No": 1, "Pocas veces": 2, "A veces": 4, "Siempre": 5 }
    }
  ]
};


// Función para calcular estadísticas a partir de las entradas registradas
function computeStats() {
  if (emotionsLog.length === 0) return { combined: {} };

  const emotionData = {};

  emotionsLog.forEach(entry => {
    const { emotion, intensity, responses } = entry;
    // Asegurarse de convertir a número
    const intensityNum = Number(intensity);
    let avgResponse = 0;
    const values = Object.values(responses || {}).map(Number);
    if (values.length > 0) {
      avgResponse = values.reduce((a, b) => a + b, 0) / values.length;
    }
    // Valor combinado: se puede ajustar la fórmula según la importancia deseada
    const combinedScore = (intensityNum + avgResponse) / 2;

    if (!emotionData[emotion]) {
      emotionData[emotion] = { scores: [], count: 0 };
    }
    emotionData[emotion].scores.push(combinedScore);
    emotionData[emotion].count++;
  });

  const combinedStats = {};
  Object.keys(emotionData).forEach(emotion => {
    const data = emotionData[emotion];
    const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
    // Aquí podrías calcular intensityAvg y questionsAvg de forma separada si lo deseas.
    combinedStats[emotion] = {
      intensityAvg: avg,    // Por ahora usamos el mismo promedio
      questionsAvg: avg,    // Ajusta si deseas diferenciarlos
      combinedAvg: avg,
      count: data.count
    };
  });
  return { combined: combinedStats };
}



// Middleware para la API. Se activará para rutas que comiencen con "/api/"
function apiMiddleware() {
  return (req, res, next) => {
    if (!req.url.startsWith('/api/')) {
      return next();
    }
    res.setHeader('Content-Type', 'application/json');
    // Normaliza la URL: quita el prefijo /api y la barra extra si existe
    let url = req.url.replace(/^\/api\/?/, '/');
    if (url.length > 1 && url.endsWith('/')) {
      url = url.slice(0, -1);
    }

    if (req.method === 'GET') {
      if (url === '/ping') {
        res.end(JSON.stringify({ res: 'pong', time: Date.now() }));
        return;
      }
      if (url.startsWith('/questions/')) {
        const parts = url.split('/');
        const emotion = parts[2];
        if (!questionsDB[emotion]) {
          res.statusCode = 404;
          res.end(JSON.stringify({ detail: "No hay preguntas para esta emoción" }));
          return;
        }
        res.end(JSON.stringify(questionsDB[emotion]));
        return;
      }
      if (url === '/stats') {
        res.end(JSON.stringify(computeStats()));
        return;
      }
      if (url === '/entries') {
        res.end(JSON.stringify(emotionsLog));
        return;
      }
    } else if (req.method === 'POST') {
      if (url === '/log_emotion') {
        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const entry = JSON.parse(body);
            if (!entry || !entry.emotion || !questionsDB[entry.emotion]) {
              res.statusCode = 400;
              res.end(JSON.stringify({ detail: "Emoción no válida" }));
              return;
            }
            entry.date = String(entry.date);
            emotionsLog.push(entry);
            saveData(emotionsLog);
            res.end(JSON.stringify({ message: "Emoción registrada exitosamente" }));
          } catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({ detail: "Error en los datos enviados" }));
          }
        });
        return;
      }
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ detail: "Endpoint no encontrado" }));
  };
}

export default defineConfig({
  server: {
    port: 5173
  },
  plugins: [
    react(),
    {
      name: 'api-middleware',
      configureServer(server) {
        server.middlewares.use(apiMiddleware())
      }
    }
  ]
})
