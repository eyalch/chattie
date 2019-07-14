import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme } from '@material-ui/core/styles'
import { StylesProvider } from '@material-ui/styles'
import React from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

const theme = createMuiTheme()

const GlobalStyles = createGlobalStyle`
html,
body,
#root {
  height: 100%;
}

#root {
  display: flex;
  align-items: center;
}
`

const Layout: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    <StylesProvider injectFirst>
      <GlobalStyles />

      <Container component="main" maxWidth="md">
        <CssBaseline />

        {children}
      </Container>
    </StylesProvider>
  </ThemeProvider>
)

export default Layout
