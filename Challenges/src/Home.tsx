import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import "./index.css"

const routes = [
  { path: "/counter", name: "Counter" },
  { path: "/bmi", name: "BMI Calculator" },
  { path: "/canvas", name: "Canvas App" },
  { path: "/typewriter", name: "Type Writer" },
  { path: "/todo", name: "Todo App" },
  { path: "/infiniteScrolling", name: "Infinite Scrolling" },
  { path: "/calendar", name: "Calendar" },
  { path: "/fileExplorer", name: "File Explorer" },
  { path: "/markdownEditor", name: "Markdown Editor" },
  { path: "/tictactoe", name: "Tic Tac Toe" },
  { path: "/snakeGame", name: "Snake Game" },
  { path: "/pingpong", name: "Ping Pong" },
  { path: "/stepper", name: "Stepper" },
  { path: "/progressbar", name: "Progress Bar" },
  { path: "/accordian", name: "Accordian" },
  { path: "/skeletonloader", name: "Skeleton Loader" },
  { path: "/calculator", name: "Calculator" },
  { path: "/linegraph", name: "Line Graph" },
  { path: "/bargraph", name: "Bar Graph" },
  { path: "/piechart", name: "Pie Chart" },
  { path: "/scatterplot", name: "Scatter Plot" },
  { path: "/videoplayer", name: "Video Player" },
  { path: "/fileuploader", name: "File Uploader" },
  { path: "/weather", name: "Weather App" },
  { path: "/bottomnavigation", name: "Bottom Navigation" },
  { path: "/carousel", name: "Carousel" },
  { path: "/video", name: "Video Timeline" },
  { path: "/tetris", name: "Tetris" },
  { path: "/autocomplete", name: "Autocomplete" },
  { path: "/starrating", name: "Star Rating" },
  { path: "/toast", name: "Toast" },
  { path: "/connectfour", name: "Connect Four" },
  { path: "/memorygame", name: "Memory Game" },
  { path: "/otp", name: "OTP Input" },
  { path: "/clock", name: "Analog Clock" },
  { path: "/pagination", name: "Pagination" },
  { path: "/quiz", name: "Quiz App" },
  { path: "/hangman", name: "Hangman" },
  { path: "/password", name: "Password Generator" },
  { path: "/datastructure", name: "Data Structure" },
  { path: "/splitpane", name: "Split Pane" },
  { path: "/sudoku", name: "Sudoku Solver" },
  { path: "/audioplayer", name: "Audio Player" },
  { path: "/texteditor", name: "Text Editor" },
  { path: "/customdraggable", name: "Custom Draggable" },
];

function Home() {
  return (
    <main className="home">
      <h1>Welcome to the React Component Showcase</h1>
      <section className="home_card__container">
        {routes.map((route) => (
          <Link to={route.path} key={route.path} className="card">
            <div className="home_card__content">
              <h2>{route.name}</h2>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

export default Home;