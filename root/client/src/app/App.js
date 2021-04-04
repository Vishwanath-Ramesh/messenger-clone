import React from 'react'
import { SnackbarProvider } from 'notistack'

import ErrorBoundary from '../views/pages/ErrorBoundary/ErrorBoundary'
import Routes from '../views/Routes/Routes'
import './App.css'

const App = () => {
  return (
    <SnackbarProvider>
      <ErrorBoundary>
        <Routes />
      </ErrorBoundary>
    </SnackbarProvider>
  )
}

export default App
