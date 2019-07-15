import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme } from '@material-ui/core/styles'
import { StylesProvider } from '@material-ui/styles'
import React from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'

const theme = createMuiTheme()

const GlobalStyles = createGlobalStyle`
html,
body,
#root {
  height: 100%;
}
`
const StyledContainer = styled(Container)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${p => p.theme.breakpoints.down('sm')} {
    padding: 0;
  }
`

const Layout: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    <StylesProvider injectFirst>
      <GlobalStyles />

      <StyledContainer component="main" maxWidth="md">
        <CssBaseline />

        {children}
      </StyledContainer>
    </StylesProvider>
  </ThemeProvider>
)

export default Layout
