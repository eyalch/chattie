import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import SocketIO from 'socket.io'
import socketioJwt from 'socketio-jwt'
import { loginHandler } from './auth'
import { DEV, FRONTEND_DEV_URL, FRONTEND_DIR, PORT, SECRET } from './config'
import { errorHandler } from './errors'
import * as users from './models/users'
import { User } from './types'

const nameof = <T>(name: keyof T) => name

const app = express()
const server = http.createServer(app)
const io = SocketIO(server)

interface SocketWithUser extends SocketIO.Socket {
  user: User
}

const socketMap: { [username: string]: SocketWithUser } = {}

io.on(
  'connection',
  socketioJwt.authorize({
    decodedPropertyName: nameof<SocketWithUser>('user'),
    secret: SECRET,
  }),
)

io.on('authenticated', (socket: SocketWithUser) => {
  const { username } = socket.user
  users.login(username)

  socket.on('message', (recipient, message) => {
    console.log(`From '${username}' to '${recipient}': "${message}"`)
  })

  socket.on('disconnect', () => users.logout(username))
})

// Listen for user logins/logouts and notify the connected users
users.subscribe(usernames => {
  io.emit('users', usernames)
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
  if (DEV) return res.redirect(FRONTEND_DEV_URL)

  res.sendFile(path.join(__dirname, FRONTEND_DIR, 'index.html'))
})

// Error handler
app.use(errorHandler)

server.listen(PORT, () => console.log(`Running at http://localhost:${PORT}/`))
