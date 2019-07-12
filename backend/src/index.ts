import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import SocketIO from 'socket.io'
import socketioJwt from 'socketio-jwt'
import { User } from '../../types'
import { loginHandler } from './auth'
import { DEV, FRONTEND_DEV_URL, FRONTEND_DIR, PORT, SECRET } from './config'

const app = express()
const server = http.createServer(app)
const io = SocketIO(server)

interface SocketWithUser extends SocketIO.Socket {
  user: User
}

io.sockets
  .on(
    'connection',
    socketioJwt.authorize({ decodedPropertyName: 'user', secret: SECRET }),
  )
  .on('authenticated', (socket: SocketWithUser) => {
    console.log(`User '${socket.user.username}' has logged in`)
  })

// Use CORS only in development
if (DEV) {
  app.use(cors({ origin: FRONTEND_DEV_URL }))
}

app.post('/api/login', loginHandler)

// Serve the static files
app.use(express.static(path.join(__dirname, FRONTEND_DIR)))

// Serve the frontend React app
app.get('*', (req, res) => {
  // When in development, redirect to the React dev server
  if (DEV) {
    return res.redirect(FRONTEND_DEV_URL)
  }

  res.sendFile(path.join(__dirname, FRONTEND_DIR, 'index.html'))
})

server.listen(PORT, () => console.log(`Running at http://localhost:${PORT}/`))
