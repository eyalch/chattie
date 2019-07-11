import jwt from 'jsonwebtoken'
import React, { useState } from 'react'
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import { User } from './types'

const initialToken = sessionStorage.getItem('token')
const initialUser = initialToken ? (jwt.decode(initialToken) as User) : null

const App = () => {
  const [user, setUser] = useState(initialUser)
  const isAuthenticated = user !== null

  const onLoginSuccess = (token: string) => {
    const _user = jwt.decode(token) as User
    setUser(_user)
  }

  const onLogout = () => {
    sessionStorage.removeItem('token')
    setUser(null)
  }

  return (
    <BrowserRouter>
      {/* Home page (only for authenticated users) */}
      <Route
        exact
        path="/"
        render={() =>
          isAuthenticated ? (
            <Home user={user as User} onLogout={onLogout} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />

      {/* Login page (only for NOT authenticated users) */}
      <Route
        exact
        path="/login"
        render={() =>
          isAuthenticated ? (
            <Redirect to="/" />
          ) : (
            <Login onSuccess={onLoginSuccess} />
          )
        }
      />
    </BrowserRouter>
  )
}

export default App
