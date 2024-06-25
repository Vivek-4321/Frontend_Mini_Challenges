import React from 'react';
import { FaBrush, FaEraser, FaSquare, FaCircle, FaMinus, FaUndo, FaRedo, FaTrash, FaDownload } from 'react-icons/fa';
import { BsDiamond } from 'react-icons/bs';
import { MdColorLens } from 'react-icons/md';
import { Tool } from './types';

interface ToolbarProps {
  color: string;
  setColor: (color: string) => void;
  size: number;
  setSize: (size: number) => void;
  tool: Tool;
  setTool: (tool: Tool) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  download: (format: 'png' | 'jpeg') => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  color,
  setColor,
  size,
  setSize,
  tool,
  setTool,
  undo,
  redo,
  reset,
  download,
}) => {
  return (
    <div className="toolbar">
      <button className={tool === 'brush' ? 'active' : ''} onClick={() => setTool('brush')}><FaBrush /></button>
      <button className={tool === 'eraser' ? 'active' : ''} onClick={() => setTool('eraser')}><FaEraser /></button>
      <button className={tool === 'line' ? 'active' : ''} onClick={() => setTool('line')}><FaMinus /></button>
      <button className={tool === 'square' ? 'active' : ''} onClick={() => setTool('square')}><FaSquare /></button>
      <button className={tool === 'circle' ? 'active' : ''} onClick={() => setTool('circle')}><FaCircle /></button>
      <button className={tool === 'diamond' ? 'active' : ''} onClick={() => setTool('diamond')}><BsDiamond /></button>
      <div className="color-picker">
        <MdColorLens className="color-icon" style={{ color: color }} />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </div>
      <input
        type="range"
        min="1"
        max="50"
        value={size}
        onChange={(e) => setSize(parseInt(e.target.value))}
      />
      <button onClick={undo}><FaUndo /></button>
      <button onClick={redo}><FaRedo /></button>
      <button onClick={reset}><FaTrash /></button>
      <button onClick={() => download('png')}><FaDownload /></button>
    </div>
  );
};

export default Toolbar;