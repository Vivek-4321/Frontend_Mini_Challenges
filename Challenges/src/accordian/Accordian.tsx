import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './Accordian.css';

interface AccordionItemProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, isOpen, onClick }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (isOpen) {
      const contentEl = contentRef.current;
      setHeight(contentEl?.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <button className="accordion-header" onClick={onClick}>
        <span>{title}</span>
        <FaChevronDown className="accordion-icon" />
      </button>
      <div className="accordion-content" style={{ height }}>
        <div ref={contentRef} className="accordion-content-inner">
          {content}
        </div>
      </div>
    </div>
  );
};

const Accordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
    { title: 'Section 3', content: 'Content for section 3' },
  ];

  const handleItemClick = (index: number) => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={index === openIndex}
          onClick={() => handleItemClick(index)}
        />
      ))}
    </div>
  );
};

export default function AccordianApp() {
  return (
    <div className="accordian-app">
      <Accordion />
      
    </div>
  );
}