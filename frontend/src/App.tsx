import React, { useState } from 'react'
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import Chat from './Chat'
import Layout from './Layout'
import Login from './Login'

const initialToken = sessionStorage.getItem('token')

const App = () => {
  const [token, setToken] = useState(initialToken)

  const onLogout = () => {
    sessionStorage.removeItem('token')
    setToken('')
  }

  return (
    <Layout>
      <BrowserRouter>
        {/* Home page (only for authenticated users) */}
        <Route
          exact
          path="/"
          render={() =>
            token ? (
              <Chat token={token} onLogout={onLogout} />
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
            token ? <Redirect to="/" /> : <Login onSuccess={setToken} />
          }
        />
      </BrowserRouter>
    </Layout>
  )
}

export default App
