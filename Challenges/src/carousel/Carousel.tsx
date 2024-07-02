import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Carousel.css';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  category?: string;
  actionText?: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  return (
    <div className="carousel">
      <div className="carousel-container">
        {items.map((item, index) => (
          <div key={item.id} className="carousel-item">
            <img src={item.image} alt={item.title} />
            <div className="carousel-item-overlay">
              <span className="category">{item.category}</span>
              <h3>{item.title}</h3>
              {item.actionText && (
                <button className="action-button">{item.actionText}</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-button prev" onClick={prevSlide}>
        <FaChevronLeft />
      </button>
      <button className="carousel-button next" onClick={nextSlide}>
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Carousel;