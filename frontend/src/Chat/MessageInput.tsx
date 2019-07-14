import Input from '@material-ui/core/Input'
import React, { useState } from 'react'
import styled from 'styled-components'

const StyledInput = styled(Input)`
  padding: ${p => p.theme.spacing(1)}px;
  background-color: #eee;
`

interface Props {
  onSend(message: string): void
}

const MessageInput = ({ onSend }: Props) => {
  const [message, setMessage] = useState('')

  const _onSend = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return

    onSend(message)

    // Clear the input
    setMessage('')
  }

  return (
    <StyledInput
      value={message}
      onChange={e => setMessage(e.target.value)}
      onKeyDown={_onSend}
      placeholder="Type a message..."
      inputProps={{
        'aria-label': 'Description',
      }}
    />
  )
}

export default MessageInput
