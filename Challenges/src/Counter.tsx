import { useState } from 'react';
import './Counter.css';

export default function Counter() {

  const [value, setValue] = useState<number>(0);
  const [input, setInput] = useState<number>(0);
  const increment = () => {
    setValue(value + input);
  }

  const decrement = () => {
    setValue(value - input);
  }

  const reset = () => {
    setValue(0);
  }

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(Number(event.target.value));
  }

  return (
    <div className='counter__container'>
        <div className='counter__content'>
          <h1 className='counter__title'>Counter</h1>
          <h1 className='counter__value'>{value}</h1>
          <div className='counter__buttons'>
            <button className='counter__button__decrement' onClick={decrement}>-</button>
            <button className='counter__button__increment' onClick={increment}>+</button>
          </div>
          <div className='counter__input'>
            <h4 className='counter__input__label'>Increment/Decemremt by </h4>
            <input className='counter__input__value' type="number" onChange={handleInput} value={input}/>
          </div>
          <div className='counter__reset'>
            <button className='counter__reset__button' onClick={reset}>Reset</button>
          </div>
        </div>
    </div>
  )
}
