import { useState, useEffect, useCallback } from "react";
import './BMICalculator.css';

function BMICalculator() {
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [bmi, setBmi] = useState<number>(0);

  const handleHeightChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(parseInt(event.target.value));
  }, []);

  const handleWeightChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(parseInt(event.target.value));
  }, []);

  const calculateBmi = useCallback(() => {
    const heightInMeters : number = height / 100;
    const bmiValue : number = weight / (heightInMeters * heightInMeters);
    setBmi(parseFloat(bmiValue.toFixed(2)));
  }, [height, weight]);

  return (
    <main className="bmi-calculator">
      <section className="bmi-calculator__inputs">
        <article className="bmi-calculator__input-group">
          <label htmlFor="height">Height (cm)</label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={handleHeightChange}
          />
        </article>
        <article className="bmi-calculator__input-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={handleWeightChange}
          />
        </article>
        <button
          onClick={calculateBmi}
          className="bmi-calculator__calculate-button"
        >
          Calculate BMI
        </button>
      </section>
      <section className="bmi-calculator__result">
        <label className="bmi-calculator__result-label">
          Your BMI is : {bmi}
        </label>
      </section>
    </main>
  );
}

export default BMICalculator;
