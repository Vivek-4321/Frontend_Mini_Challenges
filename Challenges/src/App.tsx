import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Counter from './Counter'
import ProgressBar from './ProgressBar'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/counter" element={<Counter />} />
          <Route path="/progress-bar" element={<ProgressBar />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
