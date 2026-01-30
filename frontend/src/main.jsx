import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './app/store.jsx'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './Components/UI/ToastProvider.jsx'
import ErrorBoundary from './Components/UI/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
