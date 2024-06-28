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
import Calendar from "./calendar/Calendar.tsx";
import FileExplorer from "./fileExplorer/FileExplorer.tsx";
import MarkdownEditor from "./mardownEditor/MarkdownEditor.tsx";
import TicTacToe from "./tictactoe/TicTacToe.tsx";
import SnakeGame from "./snakeGame/SnakeGame.tsx";
import PingPong from "./pingpong/PingPong.tsx";
import Stepper from "./stepper/Stepper.tsx";
import data from "./stepper/stepper.ts";
import ProgressBar from "./progressbar/ProgressBar.tsx";
import Accordian from "./accordian/Accordian.tsx";

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
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/fileExplorer" element={<FileExplorer />} />
          <Route path="/markdownEditor" element={<MarkdownEditor />} />
          <Route path="/tictactoe" element={<TicTacToe/>} />
          <Route path="/snakeGame" element={<SnakeGame/>} />
          <Route path="/pingpong" element={<PingPong />} />
          <Route path='/stepper' element={<Stepper steps={data}/>} />
          <Route path="/progressbar" element={<ProgressBar/>} />
          <Route path="/accordian" element={<Accordian/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
