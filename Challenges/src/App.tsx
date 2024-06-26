import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.tsx";
import Navbar from "./Navbar.tsx";
import Counter from "./counter/Counter.tsx";
import BMICalculator from "./bmi/BMICalculator.tsx";
import CanvasApp from "./canvas/CanvasApp.tsx";
import TypeWriter from "./typewriter/TypeWriter.tsx";
import TodoApp from "./draggableTodo/TodoApp.tsx";
import InfiniteScrolling from "./infiniteScrolling/InfiniteScrolling.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/counter" element={<Counter />} />
          <Route path="/bmi" element={<BMICalculator />} />
          <Route path="/canvas" element={<CanvasApp/>} />
          <Route path="/typewriter" element={<TypeWriter />} />
          <Route path="/todo" element={<TodoApp />} />
          <Route path="/infiniteScrolling" element={<InfiniteScrolling/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
