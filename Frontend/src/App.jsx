import React from 'react'
import Dashboard from './Features/Chat/Components/Dashboard'
import Protected from './Features/Auth/Components/Protected'

const App = () => {
  return (
    <div>
      <Protected>
        <Dashboard />
      </Protected>
    </div>
  )
}

export default App
