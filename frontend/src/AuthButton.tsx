import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { fakeAuth } from './fakeAuth'

const AuthButton = withRouter(({ history }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const onClick = async () => {
    if (fakeAuth.isAuthenticated) {
      await fakeAuth.logout()
      setIsAuthenticated(false)
      history.push('/login')
    } else {
      await fakeAuth.login()
      setIsAuthenticated(true)
      history.push('/')
    }
  }

  return (
    <button onClick={() => onClick()}>
      {isAuthenticated ? 'Logout' : 'Login'}
    </button>
  )
})

export default AuthButton
