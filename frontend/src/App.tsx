import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import AuthButton from './AuthButton'
import PrivateRoute from './PrivateRoute'

const Home = () => <h1>Home</h1>

const Login = () => <h1>Login</h1>

const App = () => {
  return (
    <BrowserRouter>
      <PrivateRoute path="/" exact component={Home} />
      <Route path="/login" exact component={Login} />

      <AuthButton />
    </BrowserRouter>
  )
}

export default App
