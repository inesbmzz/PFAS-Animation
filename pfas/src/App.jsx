import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ThreeTest from './components/ThreeTest'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <ThreeTest></ThreeTest>
      </div>
    
    </>
  )
}

export default App
