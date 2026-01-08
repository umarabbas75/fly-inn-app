// providers/ReduxProvider.tsx
'use client' // This must be a Client Component

import { Provider } from 'react-redux';
import { store } from '../redux/store';
// import { makeStore, AppStore } from '@/lib/store'

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode
}) {
   const reduxStore = store; 


  return <Provider store={reduxStore}>{children}</Provider>
}