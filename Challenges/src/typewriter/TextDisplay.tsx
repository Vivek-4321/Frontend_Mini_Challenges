import React from 'react';

interface TextDisplayProps {
  text: string;
  userInput: string;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ text, userInput }) => {
  return (
    <div className="text-display">
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`text-display__char ${
            index < userInput.length
              ? char === userInput[index]
                ? 'text-display__char--correct'
                : 'text-display__char--incorrect'
              : ''
          } ${char === ' ' ? 'text-display__char--space' : ''}`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export default TextDisplay;
