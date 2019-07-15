import Snackbar from '@material-ui/core/Snackbar'
import jwt from 'jsonwebtoken'
import React, { Component, createRef } from 'react'
import io from 'socket.io-client'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import { API_URL } from '../config'
import Loading from '../Loading'
import { Message, User } from '../types'
import MessageInput from './Chat/MessageInput'
import Messages from './Chat/Messages'
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
  flex-grow: 1;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.2);
  animation: ${enterAnimation} 0.4s ease;
  height: 600px;
  height: 80%;

  ${p => p.theme.breakpoints.down('sm')} {
    height: 100%;
  }

  @media (max-height: 400px) {
    height: 100%;
  }
`
const StyledSidesWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  max-height: calc(100% - 65px);
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

interface AllMessages {
  [username: string]: Message[]
}

interface State {
  loadingMessage: string
  users: string[]
  recipient: string
  messages: AllMessages
  newMessage: Message | null
}

export default class Chat extends Component<Props, State> {
  user: User
  socket: SocketIOClient.Socket | null = null

  messagesRef = createRef<HTMLDivElement>()

  constructor(props: Props) {
    super(props)

    // Decode the user from the token
    this.user = jwt.decode(props.token) as User

    this.state = {
      loadingMessage: LOADING_MESSAGES.LOADING,
      users: [],
      recipient: '',
      messages: {},
      newMessage: null,
    }
  }

  addMessage = (message: Message) => {
    const { recipient } = this.state

    const otherUser =
      message.sender === this.user.username ? message.recipient : message.sender

    // If the other user is not the current user we're chatting with then notify the user
    if (otherUser !== recipient) {
      this.setState({ newMessage: message })
    }

    this.setState(({ messages: prevMessages }) => ({
      messages: {
        ...prevMessages,
        [otherUser]: (prevMessages[otherUser] || []).concat(message),
      },
    }))
  }

  componentDidMount() {
    this.socket = io(API_URL)

    this.socket.on('connect', () => {
      this.setState({ loadingMessage: LOADING_MESSAGES.AUTHENTICATING })

      this.socket!.emit('authenticate', { token: this.props.token })
    })

    // Handle reconnection
    this.socket.on('reconnecting', () => {
      this.setState({ loadingMessage: LOADING_MESSAGES.RECONNECTING })

      // this.socket.once('reconnect', () => setLoadingMessage(''))
    })

    this.socket.on('authenticated', () => this.setState({ loadingMessage: '' }))

    this.socket.on('unauthorized', () => {
      this.props.onLogout()
      alert('There has been an error logging in. Please try again.')
    })

    // Update users list
    this.socket.on('users', (usernames: string[]) => {
      this.setState({
        users: [...usernames.filter(u => u !== this.user.username)],
      })
    })

    // Listen for messages
    this.socket.on('message', this.addMessage)

    // Check if there are backed-up messages and use them if there are
    const backupMessages = sessionStorage.getItem(
      `messages_${this.user.username}`,
    )
    if (backupMessages) {
      this.setState({ messages: JSON.parse(backupMessages) })
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.messages !== this.state.messages) {
      // Backup messages to local storage
      sessionStorage.setItem(
        `messages_${this.user.username}`,
        JSON.stringify(this.state.messages),
      )

      // Scroll to the bottom of the messages
      if (this.messagesRef.current) {
        this.messagesRef.current.scrollTo({
          top: this.messagesRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    }
  }

  onSend = (message: string) => {
    this.addMessage({
      recipient: this.state.recipient,
      sender: this.user.username,
      text: message,
      timestamp: new Date().toISOString(),
    })
    this.socket!.emit('message', this.state.recipient, message)
  }

  render() {
    const {
      loadingMessage,
      users,
      recipient,
      messages,
      newMessage,
    } = this.state

    if (loadingMessage) return <Loading message={loadingMessage} />

    return (
      <StyledChat>
        <GlobalStyles />

        <UserBar username={this.user.username} onLogout={this.props.onLogout} />

        <StyledSidesWrapper>
          <StyledLeft>
            <Users
              users={users}
              activeUser={recipient}
              onSelectUser={u => this.setState({ recipient: u })}
            />
          </StyledLeft>

          <StyledRight>
            {recipient ? (
              <Messages
                username={this.user.username}
                messages={messages[recipient]}
                ref={this.messagesRef}
              />
            ) : (
              <StyledInstructions>
                Welcome to Chattie!
                <br />
                Select a user from the list and start chatting!
              </StyledInstructions>
            )}

            {recipient && <MessageInput onSend={this.onSend} />}
          </StyledRight>
        </StyledSidesWrapper>

        <Snackbar
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          message={
            newMessage &&
            `New message from ${newMessage.sender}: "${newMessage.text}"`
          }
          open={newMessage !== null}
          onClose={() => this.setState({ newMessage: null })}
          autoHideDuration={3000}
        />
      </StyledChat>
    )
  }
}
