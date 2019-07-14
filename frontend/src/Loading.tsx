import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'
import styled from 'styled-components'

const StyledLoading = styled.div`
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    font-size: 32px;
  }
`

const Loading = ({ message }: { message: string }) => {
  return (
    <StyledLoading>
      <CircularProgress />
      <p>{message}</p>
    </StyledLoading>
  )
}

export default Loading
