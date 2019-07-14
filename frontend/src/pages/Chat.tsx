import jwt from 'jsonwebtoken'
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import { API_URL } from '../config'
import Loading from '../Loading'
import { User } from '../types'
import ActiveChat from './Chat/ActiveChat'
import MessageInput from './Chat/MessageInput'
import UserBar from './Chat/UserBar'
import Users from './Chat/Users'

const LOADING_MESSAGES = {
  AUTHENTICATING: 'Authenticating...',
  LOADING: 'Loading...',
  RECONNECTING: 'Reconnecting...',
}

const GlobalStyles = createGlobalStyle`
  body {
    background-color: #dfdfdf;
  }
`
const enterAnimation = keyframes`
  from {
    transform: scale(1.3);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`
const StyledChat = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.2);
  animation: ${enterAnimation} 0.4s ease;
  min-height: 400px;

  ${p => p.theme.breakpoints.down('sm')} {
    height: 100%;
  }

  @media (max-height: 400px) {
    height: 100%;
    min-height: auto;
  }
`
const StyledSidesWrapper = styled.div`
  display: flex;
  flex-grow: 1;
`
const StyledLeft = styled.div`
  flex: 30%;
  background-color: #eee;
  border-right: 1px solid lightgrey;
`
const StyledRight = styled.div`
  flex: 70%;
  background-color: #f7f9fa;
  display: flex;
  flex-direction: column;
`
const StyledInstructions = styled.div`
  font-size: 20px;
  display: flex;
  height: 100%;
  text-align: center;
  justify-content: center;
  padding-top: 50px;
  line-height: 3;
`

interface Props {
  token: string
  onLogout(): void
}

let user: User
let socket: SocketIOClient.Socket

const Home = ({ token, onLogout }: Props) => {
  // Decode the user from the token
  if (!user) {
    user = jwt.decode(token) as User
  }

  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES.LOADING)
  const [users, setUsers] = useState<string[]>([])
  const [recipient, setRecipient] = useState('')

  useEffect(() => {
    socket = io(API_URL)

    socket.on('connect', () => {
      // BUG: A new socket is opened after each reconnection

      setLoadingMessage(LOADING_MESSAGES.AUTHENTICATING)

      socket.emit('authenticate', { token })
    })

    // Handle reconnection
    socket.on('reconnecting', () => {
      setLoadingMessage(LOADING_MESSAGES.RECONNECTING)

      // socket.once('reconnect', () => setLoadingMessage(''))
    })

    socket.on('authenticated', () => setLoadingMessage(''))

    socket.on('unauthorized', () => {
      onLogout()
      alert('There has been an error logging in. Please try again.')
    })

    // Update users list
    socket.on('users', (usernames: string) => {
      setUsers(usernames.split(',').filter(u => u !== user.username))
    })

    return () => {
      socket.close()
    }
  }, [token, onLogout])

  if (loadingMessage) return <Loading message={loadingMessage} />

  return (
    <StyledChat>
      <GlobalStyles />

      <UserBar username={user.username} onLogout={onLogout} />

      <StyledSidesWrapper>
        <StyledLeft>
          <Users
            users={users}
            activeUser={recipient}
            onSelectUser={u => setRecipient(u)}
          />
        </StyledLeft>

        <StyledRight>
          {recipient ? (
            <ActiveChat />
          ) : (
            <StyledInstructions>
              Welcome to Chattie!
              <br />
              Select a user from the list and start chatting!
            </StyledInstructions>
          )}

          {recipient && (
            <MessageInput
              onSend={message => socket.emit('message', recipient, message)}
            />
          )}
        </StyledRight>
      </StyledSidesWrapper>
    </StyledChat>
  )
}

export default Home
