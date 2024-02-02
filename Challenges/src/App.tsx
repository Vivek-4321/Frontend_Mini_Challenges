import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Counter from './Counter'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/counter" element={<Counter />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
