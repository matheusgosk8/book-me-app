import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../store/store' // ajuste o caminho conforme seu store

// Componente Provider para envolver o app
import type { PropsWithChildren } from 'react'

const ReduxProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default ReduxProvider