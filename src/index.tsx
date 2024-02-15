import { Amplify } from '@aws-amplify/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import config from './aws-exports'

import App from './App'
import store from './store/store'

import './index.css'

Amplify.configure({
  ...config,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
})

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('No root element found')

const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
)
