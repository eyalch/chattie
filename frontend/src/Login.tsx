import React, { useState } from 'react'

const API_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : ''

const Login = ({ onSuccess }: { onSuccess(token: string): void }) => {
  const [username, setUsername] = useState('user')
  const [password, setPassword] = useState('pass')
  const [error, setError] = useState('')

  const onLogin = async () => {
    // Reset the error
    setError('')

    // Encode the credentials
    const credentials = window.btoa(`${username}:${password}`)

    const res = await fetch(API_URL + '/api/login', {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      method: 'POST',
    })
    const json = await res.json()

    if (res.ok) {
      sessionStorage.setItem('token', json.token)
      onSuccess(json.token)
    } else {
      setError(json.error)
    }
  }

  return (
    <>
      <h1>Login</h1>

      <form
        onSubmit={e => {
          e.preventDefault()
          onLogin()
        }}>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <span>{error}</span>
      </form>
    </>
  )
}

export default Login
