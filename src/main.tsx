import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import { AmbientSoundProvider } from './hooks/useAmbientSound'
import { FavoritesProvider } from './hooks/useFavorites'
import { SearchProvider } from './hooks/useSearch'
import App from './App'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AmbientSoundProvider>
          <FavoritesProvider>
            <SearchProvider>
              <App />
            </SearchProvider>
          </FavoritesProvider>
        </AmbientSoundProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
