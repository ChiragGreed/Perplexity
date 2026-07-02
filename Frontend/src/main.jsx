import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AppRoutes from './AppRoutes.jsx'
import store from './AppStore.js'
import { Provider } from 'react-redux'
import './index.css'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppRoutes>
      <App />
    </AppRoutes>
  </Provider>
)
