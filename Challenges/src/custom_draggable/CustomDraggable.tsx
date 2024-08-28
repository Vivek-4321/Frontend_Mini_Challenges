import React, { useState, useRef, useEffect } from 'react';
import { FaGripVertical } from 'react-icons/fa';
import './CustomDraggable.css';

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
}

const CustomDraggable: React.FC<DraggableProps> = ({ id, children, onDragStart, onDragEnd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ... (same as before)
  }, [isDragging, id, onDragEnd, position.x, position.y]);

  const handleMouseDown = () => {
    // ... (same as before)
  };

  return (
    <div
      ref={dragRef}
      className={`custom-dnd-draggable ${isDragging ? 'custom-dnd-dragging' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div className="custom-dnd-drag-handle" onMouseDown={handleMouseDown}>
        <FaGripVertical />
      </div>
      <div className="custom-dnd-draggable-content">{children}</div>
    </div>
  );
};

export default CustomDraggable;