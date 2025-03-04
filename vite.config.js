// vite.config.js
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
    }
  ]
}

// Función para calcular estadísticas a partir de las entradas registradas
function computeStats() {
  if (emotionsLog.length === 0) return { overall: {}, by_question: {} }
  const stats = {}
  const questionStats = {}

  emotionsLog.forEach(entry => {
    const { emotion, intensity, responses } = entry
    stats[emotion] = stats[emotion] || []
    stats[emotion].push(intensity)

    questionStats[emotion] = questionStats[emotion] || {}
    for (const qIdx in responses) {
      questionStats[emotion][qIdx] = questionStats[emotion][qIdx] || []
      questionStats[emotion][qIdx].push(responses[qIdx])
    }
  })

  const avgStats = {}
  Object.keys(stats).forEach(emotion => {
    avgStats[emotion] = stats[emotion].reduce((a, b) => a + b, 0) / stats[emotion].length
  })

  const avgQuestionStats = {}
  Object.keys(questionStats).forEach(emotion => {
    avgQuestionStats[emotion] = {}
    Object.keys(questionStats[emotion]).forEach(q => {
      const arr = questionStats[emotion][q]
      avgQuestionStats[emotion][q] = arr.reduce((a, b) => a + b, 0) / arr.length
    })
  })

  return { overall: avgStats, by_question: avgQuestionStats }
}

// Middleware para la API. Se activará para rutas que comiencen con "/api/"
function apiMiddleware() {
  return (req, res, next) => {
    if (!req.url.startsWith('/api/')) {
      return next()
    }
    res.setHeader('Content-Type', 'application/json')
    const url = req.url.replace('/api', '')
    if (req.method === 'GET') {
      if (url === '/ping') {
        res.end(JSON.stringify({ res: 'pong', time: Date.now() }))
        return
      }
      if (url.startsWith('/questions/')) {
        const parts = url.split('/')
        const emotion = parts[2]
        if (!questionsDB[emotion]) {
          res.statusCode = 404
          res.end(JSON.stringify({ detail: "No hay preguntas para esta emoción" }))
          return
        }
        res.end(JSON.stringify(questionsDB[emotion]))
        return
      }
      if (url === '/stats') {
        res.end(JSON.stringify(computeStats()))
        return
      }
      if (url === '/entries') {
        res.end(JSON.stringify(emotionsLog))
        return
      }
    } else if (req.method === 'POST') {
      if (url === '/log_emotion') {
        let body = ''
        req.on('data', chunk => {
          body += chunk
        })
        req.on('end', () => {
          try {
            const entry = JSON.parse(body)
            if (!entry || !entry.emotion || !questionsDB[entry.emotion]) {
              res.statusCode = 400
              res.end(JSON.stringify({ detail: "Emoción no válida" }))
              return
            }
            entry.date = String(entry.date)
            emotionsLog.push(entry)
            saveData(emotionsLog)
            res.end(JSON.stringify({ message: "Emoción registrada exitosamente" }))
          } catch (error) {
            res.statusCode = 400
            res.end(JSON.stringify({ detail: "Error en los datos enviados" }))
          }
        })
        return
      }
    }
    res.statusCode = 404
    res.end(JSON.stringify({ detail: "Endpoint no encontrado" }))
  }
}

export default defineConfig({
  server: {
    port: 5173,
    // Se agrega el middleware personalizado para manejar la API
    setupMiddlewares(middlewares, devServer) {
      middlewares.use(apiMiddleware())
      return middlewares
    }
  },
  plugins: [react()]
})
