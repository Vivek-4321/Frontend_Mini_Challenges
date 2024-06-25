import { useEffect, useCallback, useState } from "react";
import "./Counter.css";

function Counter() {
  const [value, setValue] = useState<number>(0);
  const [number, setNumber] = useState<number>(0);

  const handleIncrement = useCallback(() => {
    setNumber((number) => number + value);
  }, [value, number]);

  const handleDecrement = useCallback(() => {
    setNumber((number) => number - value);
  }, [value, number]);

  const handleReset = () => {
    setNumber(0);
  }

  return (
    <main className="counter">
      <section className="counter__container">
        <div className="counter__value">
          <h1>{number}</h1>
        </div>
        <div className="counter__buttons">
          <button className="counter__button counter__button--increment" onClick={handleIncrement}>
            +
          </button>
          <button className="counter__button counter__button--decrement" onClick={handleDecrement}>
            -
          </button>
        </div>
        <div className="counter__input">
          <label htmlFor="increment">Increment/Decrement by : </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value, 10) ?? 0)}
            id="increment"
          />
        </div>
        <button className="counter__reset" onClick={handleReset}>Reset</button>
      </section>
    </main>
  );
}

export default Counter;
