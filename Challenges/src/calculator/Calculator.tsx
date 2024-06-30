import React, { useState, useEffect } from 'react';
import { FaBackspace, FaEquals } from 'react-icons/fa';
import './Calculator.css';

type CalculatorButton =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | '+' | '-' | '*' | '/' | '=' | 'C' | '.' | '←';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [animateDisplay, setAnimateDisplay] = useState(false);

  useEffect(() => {
    setAnimateDisplay(true);
    const timer = setTimeout(() => setAnimateDisplay(false), 150);
    return () => clearTimeout(timer);
  }, [display]);

  const handleButtonClick = (value: CalculatorButton) => {
    switch (value) {
      case 'C':
        setDisplay('0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        break;
      case '←':
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        if (operator && !waitingForOperand) {
          calculate();
        } else {
          setPrevValue(parseFloat(display));
        }
        setOperator(value);
        setWaitingForOperand(true);
        break;
      case '=':
        calculate();
        setOperator(null);
        break;
      case '.':
        if (!display.includes('.')) {
          setDisplay(prev => `${prev}.`);
        }
        break;
      default:
        if (waitingForOperand) {
          setDisplay(value);
          setWaitingForOperand(false);
        } else {
          setDisplay(prev => prev === '0' ? value : `${prev}${value}`);
        }
    }
  };

  const calculate = () => {
    if (prevValue === null || operator === null) return;
    const current = parseFloat(display);
    let result: number;
    switch (operator) {
      case '+': result = prevValue + current; break;
      case '-': result = prevValue - current; break;
      case '*': result = prevValue * current; break;
      case '/': result = prevValue / current; break;
      default: return;
    }
    setDisplay(result.toString());
    setPrevValue(result);
    setWaitingForOperand(true);
  };

  const buttons: CalculatorButton[] = [
    'C', '←', '/', '*',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '=',
    '0', '.'
  ];

  return (
    <div className="calculator">
      <div className={`display ${animateDisplay ? 'animate' : ''}`}>{display}</div>
      <div className="buttons">
        {buttons.map(btn => (
          <button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            className={`btn ${btn === '=' ? 'equals' : ''} ${isNaN(parseInt(btn)) && btn !== '.' ? 'operator' : ''}`}
          >
            {btn === '=' ? <FaEquals /> : btn === '←' ? <FaBackspace /> : btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="calculator-app">
      <Calculator />
         </div>
  );
}