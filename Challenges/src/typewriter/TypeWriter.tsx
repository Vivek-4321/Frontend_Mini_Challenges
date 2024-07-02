// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import './TypeWriter.css';
// import Stats from './Stats';
// import Timer from './Timer';
// import { wordList } from './WordList';
// import { VscDebugRestart } from "react-icons/vsc";

// const TypeWriter: React.FC = () => {
//     const [text, setText] = useState<string>('');
//     const [displayText, setDisplayText] = useState<string[]>([]);
//     const [userInput, setUserInput] = useState<string>('');
//     const [startTime, setStartTime] = useState<number | null>(null);
//     const [wpm, setWpm] = useState<number>(0);
//     const [accuracy, setAccuracy] = useState<number>(100);
//     const [timeLimit, setTimeLimit] = useState<number>(30);
//     const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
//     const [isActive, setIsActive] = useState<boolean>(false);
//     const [isFocused, setIsFocused] = useState<boolean>(false);
//     const [cursorPosition, setCursorPosition] = useState<number>(0);
//     const [scrollPosition, setScrollPosition] = useState<number>(0);
//     const inputRef = useRef<HTMLInputElement>(null);
//     const textDisplayRef = useRef<HTMLDivElement>(null);
//     const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
//     const [isReady, setIsReady] = useState<boolean>(false);

//     const generateText = useCallback(() => {
//       const shuffled = [...wordList].sort(() => 0.5 - Math.random());
//       const selectedWords = shuffled.slice(0, 500); // Increased for more content
//       return selectedWords.join(' ');
//     }, []);

//     const startTyping = useCallback(() => {
//       if (!isReady) {
//         setIsReady(true);
//         inputRef.current?.focus();
//       }
//     }, [isReady]);

  
//     useEffect(() => {
//       const newText = generateText();
//       setText(newText);
//       updateDisplayText(newText);
//     }, [generateText]);
  
//     const updateDisplayText = (fullText: string) => {
//       const words = fullText.split(' ');
//       const lines: string[] = [];
//       let currentLine = '';
      
//       words.forEach(word => {
//         if ((currentLine + word).length <= 60) {
//           currentLine += (currentLine ? ' ' : '') + word;
//         } else {
//           lines.push(currentLine + '\n');  // Add line break
//           currentLine = word;
//         }
//       });
      
//       if (currentLine) {
//         lines.push(currentLine + '\n');  // Add line break to the last line
//       }
      
//       setDisplayText(lines);
//     };
  
//     useEffect(() => {
//       let interval: NodeJS.Timeout | null = null;
//       if (isActive && timeLeft > 0) {
//         interval = setInterval(() => {
//           setTimeLeft((time) => time - 1);
//         }, 1000);
//       } else if (timeLeft === 0) {
//         setIsActive(false);
//         calculateStats();
//         if (interval) clearInterval(interval);
//       }
//       return () => {
//         if (interval) clearInterval(interval);
//       };
//     }, [isActive, timeLeft]);
  
//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//       if (!isActive) {
//         setIsActive(true);
//         setStartTime(Date.now());
//       }
    
//       const input = event.target.value;
//       setUserInput(input);
//       setCursorPosition(input.length);
      
//       const fullText = displayText.join('');
//       if (input.length >= fullText.length) {
//         const remainingText = text.slice(fullText.length);
//         updateDisplayText(remainingText);
//       }
    
//       // Calculate the current line based on input length
//       const currentLineIndex = input.split('\n').length - 1;
//       if (currentLineIndex > scrollPosition + 2) {
//         setScrollPosition(currentLineIndex - 2);
//       }
//     };
  
//     const calculateStats = () => {
//       const endTime = Date.now();
//       const timeInMinutes = (endTime - (startTime || endTime)) / 60000;
//       const wordsTyped = userInput.trim().split(/\s+/).length;
//       const newWpm = Math.round(wordsTyped / timeInMinutes);
//       setWpm(newWpm);
    
//       const correctChars = userInput.split('').filter((char, index) => 
//         char === text[index] || (char === '\n' && text[index] === '\n')
//       ).length;
//       const newAccuracy = Math.round((correctChars / userInput.length) * 100);
//       setAccuracy(newAccuracy);
//     };
  
//     const resetTest = () => {
//       setIsActive(false);
//       setIsReady(false);
//       setTimeLeft(timeLimit);
//       setUserInput('');
//       setWpm(0);
//       setAccuracy(100);
//       const newText = generateText();
//       setText(newText);
//       updateDisplayText(newText);
//       setCursorPosition(0);
//       setScrollPosition(0);
//     };

//     useEffect(() => {
//       const handleKeyDown = (event: KeyboardEvent) => {
//         if (!isReady) {
//           startTyping();
//           event.preventDefault();
//         }
//       };
    
//       window.addEventListener('keydown', handleKeyDown);
//       return () => {
//         window.removeEventListener('keydown', handleKeyDown);
//       };
//     }, [isReady, startTyping]);
  
//     const handleTimeLimitChange = (newTimeLimit: number) => {
//       setTimeLimit(() => {
//         setTimeLeft(newTimeLimit);
//         const newText = generateText();
//         setText(newText);
//         updateDisplayText(newText);
//         setIsActive(false);
//         setUserInput('');
//         setWpm(0);
//         setAccuracy(100);
//         setIsFocused(false);
//         setCursorPosition(0);
//         setScrollPosition(0);
//         return newTimeLimit;
//       });
//     };

//     const handleTextClick = () => {
//       setIsFocused(true);
//       inputRef.current?.focus();
//     };


//     const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//       if (event.key === 'Enter') {
//         event.preventDefault();
//         const newInput = userInput + '\n';
//         setUserInput(newInput);
//         setCursorPosition(newInput.length);
//       }
//     };
    
  
//     return (
//       <div className="app">
//         <div className="app__time-options">
//           <button 
//             className={`app__time-button ${timeLimit === 30 ? 'app__time-button--active' : ''}`} 
//             onClick={() => handleTimeLimitChange(30)}
//           >
//             30s
//           </button>
//           <button 
//             className={`app__time-button ${timeLimit === 60 ? 'app__time-button--active' : ''}`} 
//             onClick={() => handleTimeLimitChange(60)}
//           >
//             60s
//           </button>
//         </div>
//         <Timer timeLeft={timeLeft} />
//         <div 
//           className={`text-display-container ${!isFocused ? 'glassmorphism' : ''}`} 
//           onClick={handleTextClick}
//           ref={textDisplayRef}
//         >
//           <div 
//             className="text-display" 
//             style={{
//               transform: `translateY(${-scrollPosition * 1.9}em)`,
//               transition: 'transform 0.3s ease-out'
//             }}
//           >
//             {displayText.map((line, lineIndex) => (
//               <p key={lineIndex}>
//                 {line.split('').map((char, charIndex) => {
//                   const overallIndex = displayText.slice(0, lineIndex).join('').length + charIndex;
//                   return (
//                     <span
//                       key={overallIndex}
//                       ref={el => charRefs.current[overallIndex] = el}
//                       className={`text-display__char ${
//                         overallIndex < userInput.length
//                           ? char === userInput[overallIndex]
//                             ? 'text-display__char--correct'
//                             : 'text-display__char--incorrect'
//                           : ''
//                       } ${char === ' ' ? 'text-display__char--space' : ''}`}
//                     >
//                       {char === '\n' ? '↵' : char}
//                       {overallIndex === cursorPosition && <span className="blinking-cursor">|</span>}
//                     </span>
//                   );
//                 })}
//               </p>
//             ))}
//           </div>
//           {!isReady && (
//     <div className="start-typing-overlay">
//       Press any key to start typing...
//     </div>
//   )}
//           <input
//   ref={inputRef}
//   type="text"
//   className="hidden-input"
//   value={userInput}
//   onChange={handleInputChange}
//   onKeyDown={handleKeyDown}
//   disabled={!isActive && timeLeft !== timeLimit}
// />
//         </div>
//         {timeLeft === 0 && <Stats wpm={wpm} accuracy={accuracy} />}
//         <button className="app__reset-button" onClick={resetTest}><VscDebugRestart/></button>
//       </div>
//     );
// };
  
// export default TypeWriter;


import React, { useState, useEffect, useCallback, useRef } from 'react';
import './TypeWriter.css';
import Stats from './Stats';
import Timer from './Timer';
import { wordList } from './WordList';
import { VscDebugRestart } from "react-icons/vsc";

const TypeWriter: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [displayText, setDisplayText] = useState<string[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState<number>(0);
    const [accuracy, setAccuracy] = useState<number>(100);
    const [timeLimit, setTimeLimit] = useState<number>(30);
    const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState<{left: number, top: number}>({left: 0, top: 0});
    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const textDisplayRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState<boolean>(false);

    const CHAR_WIDTH = 14.4;
    const LINE_HEIGHT = 45.6;
    const CURSOR_OFFSET_LEFT = -1;
    const CURSOR_OFFSET_TOP = 6;

    const generateText = useCallback(() => {
        const shuffled = [...wordList].sort(() => 0.5 - Math.random());
        const selectedWords = shuffled.slice(0, 500);
        return selectedWords.join(' ');
    }, []);

    const startTyping = useCallback(() => {
        if (!isReady) {
            setIsReady(true);
            inputRef.current?.focus();
        }
    }, [isReady]);

    useEffect(() => {
        const newText = generateText();
        setText(newText);
        updateDisplayText(newText);
    }, [generateText]);

    const updateDisplayText = (fullText: string) => {
        const words = fullText.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        
        words.forEach(word => {
            if ((currentLine + word).length <= 60) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        });
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        setDisplayText(lines);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            calculateStats();
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isActive) {
            setIsActive(true);
            setStartTime(Date.now());
        }
    
        const input = event.target.value;
        setUserInput(input);
        
        const fullText = displayText.join(' ');
        if (input.length >= fullText.length) {
            const remainingText = text.slice(fullText.length);
            updateDisplayText(remainingText);
        }
    
        const cursorLeft = (input.length % 60) * CHAR_WIDTH + CURSOR_OFFSET_LEFT;
        const cursorTop = Math.floor(input.length / 60) * LINE_HEIGHT + CURSOR_OFFSET_TOP;
        setCursorPosition({ left: cursorLeft, top: cursorTop });
    
        const currentLineIndex = Math.floor(input.length / 60);
        if (currentLineIndex > scrollPosition + 2) {
            setScrollPosition(currentLineIndex - 2);
        }
    };

    const calculateStats = () => {
        const endTime = Date.now();
        const timeInMinutes = (endTime - (startTime || endTime)) / 60000;
        const wordsTyped = userInput.trim().split(/\s+/).length;
        const newWpm = Math.round(wordsTyped / timeInMinutes);
        setWpm(newWpm);
    
        const correctChars = userInput.split('').filter((char, index) => char === text[index]).length;
        const newAccuracy = Math.round((correctChars / userInput.length) * 100);
        setAccuracy(newAccuracy);
    };

    const resetTest = () => {
        setIsActive(false);
        setIsReady(false);
        setTimeLeft(timeLimit);
        setUserInput('');
        setWpm(0);
        setAccuracy(100);
        const newText = generateText();
        setText(newText);
        updateDisplayText(newText);
        setCursorPosition({left: 0, top: 0});
        setScrollPosition(0);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isReady) {
                startTyping();
                event.preventDefault();
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isReady, startTyping]);

    const handleTimeLimitChange = (newTimeLimit: number) => {
        setTimeLimit(() => {
            setTimeLeft(newTimeLimit);
            const newText = generateText();
            setText(newText);
            updateDisplayText(newText);
            setIsActive(false);
            setUserInput('');
            setWpm(0);
            setAccuracy(100);
            setIsFocused(false);
            setCursorPosition({left: 0, top: 0});
            setScrollPosition(0);
            return newTimeLimit;
        });
    };

    const handleTextClick = () => {
        setIsFocused(true);
        inputRef.current?.focus();
    };

    return (
        <div className="app">
            <div className="app__time-options">
                <button 
                    className={`app__time-button ${timeLimit === 30 ? 'app__time-button--active' : ''}`} 
                    onClick={() => handleTimeLimitChange(30)}
                >
                    30s
                </button>
                <button 
                    className={`app__time-button ${timeLimit === 60 ? 'app__time-button--active' : ''}`} 
                    onClick={() => handleTimeLimitChange(60)}
                >
                    60s
                </button>
            </div>
            <Timer timeLeft={timeLeft} />
            <div 
                className={`text-display-container ${!isFocused ? 'glassmorphism' : ''}`} 
                onClick={handleTextClick}
                ref={textDisplayRef}
            >
                <div 
                    className="text-display" 
                    style={{
                        transform: `translateY(${-scrollPosition * LINE_HEIGHT}px)`,
                        transition: 'transform 0.3s ease-out'
                    }}
                >
                    {displayText.map((line, lineIndex) => (
                        <p key={lineIndex}>
                            {line.split('').map((char, charIndex) => {
                                const overallIndex = displayText.slice(0, lineIndex).join('').length + charIndex;
                                return (
                                    <span
                                        key={overallIndex}
                                        className={`text-display__char ${
                                            overallIndex < userInput.length
                                                ? char === userInput[overallIndex]
                                                    ? 'text-display__char--correct'
                                                    : 'text-display__char--incorrect'
                                                : ''
                                        } ${char === ' ' ? 'text-display__char--space' : ''}`}
                                    >
                                        {char}
                                    </span>
                                );
                            })}
                        </p>
                    ))}
                    <span 
                        className="cursor"
                        style={{
                            left: `${cursorPosition.left}px`,
                            top: `${cursorPosition.top}px`,
                        }}
                    />
                </div>
                {!isReady && (
                    <div className="start-typing-overlay">
                        Press any key to start typing...
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="text"
                    className="hidden-input"
                    value={userInput}
                    onChange={handleInputChange}
                    disabled={!isActive && timeLeft !== timeLimit}
                />
            </div>
            {timeLeft === 0 && <Stats wpm={wpm} accuracy={accuracy} />}
            <button className="app__reset-button" onClick={resetTest}><VscDebugRestart/></button>
        </div>
    );
};

export default TypeWriter;