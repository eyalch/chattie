import React from 'react'
import { User } from './types'

interface Props {
  user: User
  onLogout(): void
}

const Home = ({ user, onLogout }: Props) => (
  <>
    <h1>Hi {user.username}</h1>

    <button onClick={onLogout}>Logout</button>
  </>
)

export default Home
