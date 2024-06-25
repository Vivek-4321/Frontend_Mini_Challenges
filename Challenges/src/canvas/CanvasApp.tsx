import React, { useState, useRef, useEffect } from 'react';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import { Tool, Shape } from './types';
import './CanvasApp.css';

const CanvasApp: React.FC = () => {
  const [color, setColor] = useState('#FFFFFF');
  const [size, setSize] = useState(5);
  const [tool, setTool] = useState<Tool>('brush');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 60; // Subtract toolbar height
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#1E1E1E';
        context.fillRect(0, 0, canvas.width, canvas.height);
        const initialState = context.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialState]);
        setHistoryIndex(0);
      }
    }
  }, []);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.putImageData(history[historyIndex - 1], 0, 0);
        }
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.putImageData(history[historyIndex + 1], 0, 0);
        }
      }
    }
  };

  const reset = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#1E1E1E';
        context.fillRect(0, 0, canvas.width, canvas.height);
        const newState = context.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([newState]);
        setHistoryIndex(0);
      }
    }
  };

  const download = (format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `canvas-drawing.${format}`;
      link.click();
    }
  };

  const updateHistory = (newState: ImageData) => {
    setHistory(prevHistory => [...prevHistory.slice(0, historyIndex + 1), newState]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  };

  return (
    <div className="canvas-app">
      <Toolbar
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        tool={tool}
        setTool={setTool}
        undo={undo}
        redo={redo}
        reset={reset}
        download={download}
      />
      <Canvas
        canvasRef={canvasRef}
        color={color}
        size={size}
        tool={tool}
        currentShape={currentShape}
        setCurrentShape={setCurrentShape}
        updateHistory={updateHistory}
      />
    </div>
  );
};

export default CanvasApp;