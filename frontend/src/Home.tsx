import { User } from 'chattie'
import jwt from 'jsonwebtoken'
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

interface Props {
  token: string
  onLogout(): void
}

let user: User

const Home = ({ token, onLogout }: Props) => {
  // Decode the user from the token
  if (!user) {
    user = jwt.decode(token) as User
  }

  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<string[]>([])

  useEffect(() => {
    const socket = io.connect('http://localhost:8000')

    socket.on('connect', () => {
      // BUG: A new socket is opened after each reconnection

      socket.emit('authenticate', { token })

      socket.on('authenticated', () => setLoading(false))

      socket.on('unauthorized', () => {
        onLogout()
        alert('There has been an error logging in. Please try again.')
      })

      // Update users list
      socket.on('users', (usernames: string) => {
        setUsers(usernames.split(',').filter(u => u !== user.username))
      })
    })

    socket.on('reconnecting', () => setLoading(true))

    return () => {
      socket.close()
    }
  }, [token, onLogout])

  if (loading) return <h1>Please wait...</h1>

  return (
    <>
      <h1>Hi {user.username}</h1>

      <button onClick={onLogout}>Logout</button>

      <h2>Active Users:</h2>
      <ul>
        {users.map(username => (
          <li key={username}>{username}</li>
        ))}
      </ul>
    </>
  )
}

export default Home
