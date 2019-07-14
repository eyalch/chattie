import Input from '@material-ui/core/Input'
import React, { useState } from 'react'
import styled from 'styled-components'

const StyledInput = styled(Input)`
  padding: 10px 15px;
  background-color: #eee;
  font-size: 18px;
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
      disableUnderline
    />
  )
}

export default MessageInput
