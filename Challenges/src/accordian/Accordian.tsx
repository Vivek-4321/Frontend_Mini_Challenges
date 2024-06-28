import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface AccordionItemProps {
  title: string;
  content: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      <div className="accordion-content">
        <div className="accordion-content-inner">{content}</div>
      </div>
    </div>
  );
};

const Accordion: React.FC = () => {
  const items = [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
    { title: 'Section 3', content: 'Content for section 3' },
  ];

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <AccordionItem key={index} title={item.title} content={item.content} />
      ))}
    </div>
  );
};

export default function App() {
  return (
    <div className="app">
      <h1>Animated Accordion</h1>
      <Accordion />
      <style>{`
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          margin: 0;
          padding: 0;
        }
        .app {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1rem;
        }
        h1 {
          text-align: center;
          color: #333;
        }
        .accordion {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .accordion-item {
          border-bottom: 1px solid #e0e0e0;
        }
        .accordion-item:last-child {
          border-bottom: none;
        }
        .accordion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 1rem;
          background-color: #fff;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .accordion-header:hover {
          background-color: #f5f5f5;
        }
        .accordion-header span {
          font-weight: bold;
          font-size: 1.1rem;
          color: #333;
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
        }
        .accordion-content-inner {
          padding: 0 1rem;
          color: #666;
        }
        .accordion-item.open .accordion-content {
          max-height: 200px;
          padding: 1rem 0;
        }
        .accordion-item.open .accordion-header {
          background-color: #e6f7ff;
        }
        .accordion-header svg {
          transition: transform 0.3s ease;
        }
        .accordion-item.open .accordion-header svg {
          transform: rotate(180deg);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .accordion-item.open .accordion-content-inner {
          animation: fadeIn 0.5s ease;
        }
      `}</style>
    </div>
  );
}