import jwt from 'jsonwebtoken'
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { User } from '../../types'

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

  useEffect(() => {
    const socket = io.connect('http://localhost:8000')
    socket
      .on('connect', () => {
        // BUG: A new socket is opened after each reconnection

        socket
          .emit('authenticate', { token })
          .on('authenticated', () => {
            setLoading(false)
          })
          .on('unauthorized', () => {
            onLogout()
            alert('There has been an error logging in. Please try again.')
          })
      })
      .on('reconnecting', () => {
        setLoading(true)
      })

    return () => {
      socket.close()
    }
  }, [token, onLogout])

  if (loading) return <h1>Please wait...</h1>

  return (
    <>
      <h1>Hi {user.username}</h1>

      <button onClick={onLogout}>Logout</button>
    </>
  )
}

export default Home
