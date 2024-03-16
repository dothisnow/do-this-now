import { Amplify } from '@aws-amplify/core'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
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
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
})

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('No root element found')

const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistQueryClientProvider
        persistOptions={{ persister: localStoragePersister }}
        client={queryClient}>
        <App />
      </PersistQueryClientProvider>
    </Provider>
  </React.StrictMode>
)
