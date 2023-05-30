import "./styles.css";
import React, {useState} from 'react';

export default function App() {
  const [counter, setCounter] = useState(0)
  const [inputValue, setInputValue] = useState(1);

  const handleInput = (event) => {
    const parsedValue = parseInt(event.target.value, 10) || 1;
    setInputValue(parsedValue);
  }

  const increment = () => {
    setCounter(counter+inputValue);
  }

  const decrement = () => {
    setCounter(counter-inputValue);
  }

  return (
    <div className="App">
      <h1>{counter}</h1>
      <div className="container-top">
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
      </div>
      <div className="container-middle">
        <p>Increment or Decrement by: </p>
        <input value={inputValue} onChange={handleInput} type="number"/>
      </div>
      <div className="container-bottom">
        <button onClick={()=> {setCounter(0)}}>Reset</button>
      </div>
    </div>
  );
}
