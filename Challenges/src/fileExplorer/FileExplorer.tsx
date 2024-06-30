import React, { useState } from 'react';
import './FileExplorer.css';

type Element = {
  id: number;
  content: string;
};

const initialElements: Element[] = [
  { id: 1, content: 'Element 1' },
  { id: 2, content: 'Element 2' },
  { id: 3, content: 'Element 3' },
];

const FileExplorer: React.FC = () => {
  const [elements, setElements] = useState<Element[]>(initialElements);
  const [box1Elements, setBox1Elements] = useState<Element[]>([]);
  const [box2Elements, setBox2Elements] = useState<Element[]>([]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, element: Element) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(element));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDropBox1 = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedElement = JSON.parse(e.dataTransfer.getData('text/plain')) as Element;
    setBox1Elements([...box1Elements, droppedElement]);
  };

  const handleDropBox2 = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedElement = JSON.parse(e.dataTransfer.getData('text/plain')) as Element;
    setBox2Elements([...box2Elements, droppedElement]);
  };

  const handleRemoveFromBox1 = (element: Element) => {
    setBox1Elements(box1Elements.filter((el) => el.id !== element.id));
  };

  const handleRemoveFromBox2 = (element: Element) => {
    setBox2Elements(box2Elements.filter((el) => el.id !== element.id));
  };

  return (
    <div className="App dark-theme">
      <h1>Drag and Drop Elements</h1>
      <div className="container">
        <div className="elements-container">
          <h2>Elements</h2>
          {elements.map((element) => (
            <div
              key={element.id}
              className="element"
              draggable
              onDragStart={(e) => handleDragStart(e, element)}
            >
              {element.content}
            </div>
          ))}
        </div>
        <div
          className="box"
          onDragOver={handleDragOver}
          onDrop={handleDropBox1}
        >
          <h2>Drop Box 1</h2>
          <div className="box-content">
            {box1Elements.map((element) => (
              <div
                key={element.id}
                className="box-element"
                draggable
                onDragStart={(e) => handleDragStart(e, element)}
                onDragOver={handleDragOver}
                onDrop={() => handleRemoveFromBox1(element)}
              >
                {element.content}
              </div>
            ))}
          </div>
        </div>
        <div
          className="box"
          onDragOver={handleDragOver}
          onDrop={handleDropBox2}
        >
          <h2>Drop Box 2</h2>
          <div className="box-content">
            {box2Elements.map((element) => (
              <div
                key={element.id}
                className="box-element"
                draggable
                onDragStart={(e) => handleDragStart(e, element)}
                onDragOver={handleDragOver}
                onDrop={() => handleRemoveFromBox2(element)}
              >
                {element.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
