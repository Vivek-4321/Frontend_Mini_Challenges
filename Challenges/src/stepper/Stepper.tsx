import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import "./Stepper.css";

interface Step {
  title: string;
  content: string;
}

interface StepperProps {
  steps: Step[];
}

const Stepper: React.FC<StepperProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompleted((prev) => {
        const newCompleted = [...prev];
        newCompleted[currentStep] = true;
        return newCompleted;
      });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCompleted((prev) => {
        const newCompleted = [...prev];
        newCompleted[currentStep - 1] = false;
        return newCompleted;
      });
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setCompleted((prev) => [...prev.slice(0, -1), true]);
    setIsSubmitted(true);
  };

  return (
    <div className="stepper-wrapper">
      <div className="stepper">
        <div className="stepper-header">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step ${index === currentStep ? "active" : ""} ${
                completed[index] ? "completed" : ""
              }`}
            >
              <div className="step-indicator">
                {completed[index] ? <FaCheck /> : index + 1}
              </div>
              <div className="step-title">{step.title}</div>
              {index < steps.length - 1 && (
                <div className="step-progress-container">
                  <div
                    className="step-progress"
                    style={{ transform: `scaleX(${completed[index] ? 1 : 0})` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="stepper-content">
          <h3>{steps[currentStep].title}</h3>
          <p>{steps[currentStep].content}</p>
        </div>
        <div className="stepper-actions">
          <button
            className="stepper-button"
            onClick={handlePrev}
            disabled={currentStep === 0 || isSubmitted}
          >
            Previous
          </button>
          {currentStep === steps.length - 1 ? (
            <button
              className="stepper-button"
              onClick={handleSubmit}
              disabled={isSubmitted}
            >
              Submit
            </button>
          ) : (
            <button
              className="stepper-button"
              onClick={handleNext}
              disabled={isSubmitted}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
