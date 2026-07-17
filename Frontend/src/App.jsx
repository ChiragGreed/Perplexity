import React from 'react'
import Dashboard from './Features/Chat/Pages/Dashboard'
import Protected from './Features/Auth/Components/Protected'

const App = () => {
  return (
    <main>
      <Protected>
        <Dashboard />
      </Protected>
    </main>
  )
}

export default App
