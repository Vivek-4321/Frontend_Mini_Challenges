import React, { useState } from 'react';
import CustomDraggable from './CustomDraggable';
import './CustomDraggableWrapper.css';

interface DraggableItem {
  id: string;
  content: React.ReactNode;
}

interface DraggableWrapperProps {
  items: DraggableItem[];
  onItemMove?: (id: string, x: number, y: number) => void;
}

const CustomDraggableWrapper: React.FC<DraggableWrapperProps> = ({ items, onItemMove }) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragEnd = (id: string, x: number, y: number) => {
    setDraggedItem(null);
    if (onItemMove) {
      onItemMove(id, x, y);
    }
  };

  return (
    <div className="custom-dnd-wrapper">
      {items.map((item) => (
        <CustomDraggable
          key={item.id}
          id={item.id}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {item.content}
        </CustomDraggable>
      ))}
      {draggedItem && <div className="custom-dnd-drag-overlay" />}
    </div>
  );
};

export default CustomDraggableWrapper;