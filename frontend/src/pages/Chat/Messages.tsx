import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { Message } from '../../types'

const StyledMessages = styled.div`
  flex-grow: 1;
  padding: 18px;
  display: flex;
  flex-direction: column;
  overflow: auto;
`
const StyledMessage = styled.div<{ outgoing: boolean }>`
  font-size: 22px;
  text-align: ${p => (p.outgoing ? 'end' : 'start')};
  align-self: ${p => (p.outgoing ? 'flex-end' : 'flex-start')};
  max-width: 60%;
  padding-bottom: 10px;
`

interface Props {
  username: string
  messages: Message[] | undefined
}

const Messages = forwardRef<HTMLDivElement, Props>(
  ({ username, messages }, ref) => (
    <StyledMessages ref={ref}>
      {(messages || []).map(message => (
        <StyledMessage
          key={message.timestamp}
          outgoing={message.sender === username}>
          {message.text}
        </StyledMessage>
      ))}
    </StyledMessages>
  ),
)

export default Messages
