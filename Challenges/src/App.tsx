import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Counter from './Counter'
import ProgressBar from './ProgressBar'
import FileExplorer from './FileExplorer/FileExplorer';
import DependentDropDown from './DependentDropDown';
import MultiStepForm from './MultiStepForm/MultiStepForm';
import Stepper from './Stepper/Stepper';
import InfinitelyNestedComments from './InfinitelyNestedComments/InfinitelyNestedComments';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/counter" element={<Counter />} />
          <Route path="/progress-bar" element={<ProgressBar />} />
          <Route path='/file-explorer' element={<FileExplorer />} />
          <Route path='/dropdown' element={<DependentDropDown/>} />
          <Route path='/multi-step-form' element={<MultiStepForm />} />
          <Route path='/react-stepper' element={<Stepper/>} />
          <Route path="/infinitely-nested-comments" element={<InfinitelyNestedComments/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
