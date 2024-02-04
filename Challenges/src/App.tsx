import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Counter from './Counter'
import ProgressBar from './ProgressBar'
import FileExplorer from './FileExplorer';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/counter" element={<Counter />} />
          <Route path="/progress-bar" element={<ProgressBar />} />
          <Route path='/file-explorer' element={<FileExplorer />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
