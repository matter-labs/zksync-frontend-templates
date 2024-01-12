import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import { App } from './App'
import { EthereumProvider } from './components/Context'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EthereumProvider>
      <App />
    </EthereumProvider>
  </React.StrictMode>,
)
