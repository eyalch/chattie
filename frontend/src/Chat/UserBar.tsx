import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import styled from 'styled-components'

const StyledAppBar = styled(AppBar)`
  background-color: #eee;
  box-shadow: none;
`
const StyledGreeting = styled(Typography)`
  flex-grow: 1;
  font-weight: normal;

  .username {
    font-weight: bold;
  }
`

interface Props {
  username: string
  onLogout(): void
}

const UserBar = ({ username, onLogout }: Props) => (
  <StyledAppBar position="static" color="inherit">
    <Toolbar>
      <StyledGreeting variant="h6">
        Hello <span className="username">{username}</span>
      </StyledGreeting>

      <Button color="inherit" onClick={onLogout}>
        Logout
      </Button>
    </Toolbar>
  </StyledAppBar>
)

export default UserBar
