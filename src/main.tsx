import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SearchProvider } from './hooks/useSearch'
import { KeyboardShortcutsProvider } from './hooks/useKeyboardShortcuts'
import App from './App'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <KeyboardShortcutsProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </KeyboardShortcutsProvider>
    </BrowserRouter>
  </StrictMode>,
)
