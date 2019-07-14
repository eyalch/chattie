import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Container from '@material-ui/core/Container'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import React, { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { API_URL } from '../config'
import { LoginError } from '../types'

const GlobalStyles = createGlobalStyle`
  #root {
    align-items: flex-start;
  }
`
const StyledLogin = styled(Container)`
  margin-top: ${p => p.theme.spacing(8)}px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const StyledAvatar = styled(Avatar)`
  margin: ${p => p.theme.spacing(1)}px;
  background-color: ${p => p.theme.palette.secondary.main};
`
const StyledForm = styled.form`
  width: 100%;
  margin-top: ${p => p.theme.spacing(1)}px;
`
const StyledButton = styled(Button)`
  margin: ${p => p.theme.spacing(3, 0, 2)};
`

const Login = ({ onSuccess }: { onSuccess(token: string): void }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [errorCode, setErrorCode] = useState(-1)

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Reset the error
    setErrorCode(-1)

    // Encode the credentials
    const credentials = window.btoa(`${username}:${password}`)

    const res = await fetch(API_URL + '/api/login', {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      method: 'POST',
    })
    const json = await res.json()

    if (res.ok) {
      if (rememberMe) sessionStorage.setItem('token', json.token)

      onSuccess(json.token)
    } else {
      setErrorCode(json.code)
    }
  }

  return (
    <StyledLogin maxWidth="xs">
      <GlobalStyles />

      <StyledAvatar>
        <LockOutlinedIcon />
      </StyledAvatar>
      <Typography component="h1" variant="h5">
        Login
      </Typography>

      <StyledForm noValidate onSubmit={onLogin}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={e => setUsername(e.target.value)}
          error={errorCode === LoginError.UsernameTaken}
          helperText={
            errorCode === LoginError.UsernameTaken
              ? 'Username is already taken'
              : ''
          }
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={errorCode === LoginError.InvalidCredentials}
          helperText={
            errorCode === LoginError.InvalidCredentials
              ? 'Invalid password'
              : ''
          }
        />

        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
          checked={rememberMe}
          onChange={(e, checked) => setRememberMe(checked)}
        />

        <StyledButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary">
          Login
        </StyledButton>
      </StyledForm>
    </StyledLogin>
  )
}

export default Login
