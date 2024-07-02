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
import steps from "./stepper/stepper.ts";
import ProgressBar from "./progressbar/ProgressBar.tsx";
import Accordian from "./accordian/Accordian.tsx";
import SkeletonLoader from "./skeletonloader/SkeletonLoader.tsx";
import Calculator from "./calculator/Calculator.tsx";
import AnimatedLineGraph from "./linegraph/AnimatedLineGraph.tsx";
import AnimatedBarGraph from "./bargraph/AnimatedBarGraph.tsx";
import AnimatedPieChartWrapper from "./piechart/AnimatedPiChartWrapper.tsx";
import AnimatedScatterPlot from "./scatterplot/AnimatedScatterPlot.tsx";
import Wrapper from "./videoplayer/Wrapper.tsx";
import FileWrapper from "./fileuploader/FileWrapper.tsx";
import WeatherWrapper from "./weatherapp/WeatherWrapper.tsx";
import BottomNavigation from "./bottomnavigation/BottomNavBar.tsx";
import CarouselWrapper from "./carousel/CarouselWrapper.tsx";
import VideoTimelineWrapper from "./videotimeline/VideoTimelineWrapper.tsx";
import Tetris from "./tetris/Tetris.tsx"
import AutocompleteComponent from "./autocomplete/AutoComplete.tsx";
import StarRating from "./starrating/StarRating.tsx";
import ToastWrapper from "./toast/ToastWrapper.tsx";
import ConnectFour from "./connectfour/ConnectFour.tsx";
import MemoryGame from "./memorygame/MemoryGame.tsx";
import OTPInput from "./otp/OtpInput.tsx";
import AnalogClock from "./analogclock/AnalogClock.tsx";
import Pagination from "./pagination/Pagination.tsx";

function App() {
  const data = [
    { label: "A", value: 10 },
    { label: "B", value: 20 },
    { label: "C", value: 15 },
    { label: "D", value: 25 },
    { label: "E", value: 30 },
    { label: "F", value: 20 },
  ];

 
  const DaTa = [
    { x: 1, y: 2, label: 'Point A', color: '#ff0000' },
    { x: 2, y: 3, label: 'Point B', color: '#00ff00' },
    { x: 3, y: 1, label: 'Point C', color: '#0000ff' },
    { x: 4, y: 4, label: 'Point D' },
    { x: 5, y: 2, label: 'Point E' },
    { x: 3, y: 3, label: 'Point F' },
    { x: 4, y: 2, label: 'Point G' },
  ];

  const handleOTPComplete = (otp: string) => {
    console.log('Completed OTP:', otp);
    // You can add your verification logic here
  };

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/counter" element={<Counter />} />
          <Route path="/bmi" element={<BMICalculator />} />
          <Route path="/canvas" element={<CanvasApp />} />
          <Route path="/typewriter" element={<TypeWriter />} />
          <Route path="/todo" element={<TodoApp />} />
          <Route path="/infiniteScrolling" element={<InfiniteScrolling />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/fileExplorer" element={<FileExplorer />} />
          <Route path="/markdownEditor" element={<MarkdownEditor />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/snakeGame" element={<SnakeGame />} />
          <Route path="/pingpong" element={<PingPong />} />
          <Route path="/stepper" element={<Stepper steps={steps} />} />
          <Route path="/progressbar" element={<ProgressBar />} />
          <Route path="/accordian" element={<Accordian />} />
          <Route path="/skeletonloader" element={<SkeletonLoader />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/linegraph" element={<AnimatedLineGraph />} />
          <Route path="/fileuploader" element={<FileWrapper />} />
          <Route path="/weather" element={<WeatherWrapper />} />
          <Route path="/bottomnavigation" element={<BottomNavigation />} />
          <Route path="/carousel" element={<CarouselWrapper />} />
          <Route path="/video" element={<VideoTimelineWrapper />} />
          <Route path="/tetris" element={<Tetris/>} />
          <Route path="/autocomplete" element={<AutocompleteComponent/>} />
          <Route path="/starrating" element={<StarRating/>} />
          <Route path="/toast" element={<ToastWrapper/>} />
          <Route path="/connectfour" element={<ConnectFour/>} />
          <Route path="/memorygame" element={<MemoryGame />} />
          <Route path="/clock" element={<AnalogClock />} />
          <Route path="/otp" element={<OTPInput length={6} onComplete={handleOTPComplete} />} />
          <Route path="/pagination" element={<Pagination />} />
          <Route
            path="/bargraph"
            element={
              <AnimatedBarGraph
                data={data}
                width={800}
                height={400}
                title="Sample Bar Chart"
                
              />
            }
          />
          <Route path="/piechart" element={<AnimatedPieChartWrapper />} />
            <Route path="/scatterplot" element={<AnimatedScatterPlot   data={DaTa}
        width={800}
        height={600}
        title="Sample Scatter Plot"
        backgroundColor="#f9f9f9"
        pointColor="#e74c3c"
        axisColor="#3498db"
        xAxisLabel="X Values"
        yAxisLabel="Y Values"
        animationDuration={1500}/>} />
        
        <Route path="/videoplayer" element={<Wrapper/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
