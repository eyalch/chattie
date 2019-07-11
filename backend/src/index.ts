import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import path from 'path'
import { parseAuthorization } from './helpers'

const PORT = process.env.PORT || 8000
const SECRET = 'Chatt1e_s3cret'
const FRONTEND_DIR = 'frontend'

const app = express()

app.use(cors({ origin: 'http://localhost:3000' }))

app.post('/api/login', (req, res) => {
  // Parse the HTTP Authorization header to get the encoded username & password
  const credentials = parseAuthorization(req.headers.authorization)

  if (!credentials) {
    res
      .set('WWW-Authenticate', 'Basic')
      .status(401)
      .json({ error: 'A valid Authorization header is required!' })
    return
  }

  const [username, password] = credentials

  if (password !== 'chattie') {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const token = jwt.sign({ username }, SECRET)

  res.json({ token })
})

// Serve the static files
app.use(express.static(path.join(__dirname, FRONTEND_DIR)))

// Serve the frontend React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, FRONTEND_DIR, 'index.html'))
})

app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}/`))
