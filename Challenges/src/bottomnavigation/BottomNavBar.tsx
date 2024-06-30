import React, { useState } from 'react';
import { FaHome, FaSearch, FaUser, FaCog } from 'react-icons/fa';
import './BottomNavBar.css';

interface NavItem {
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { icon: FaHome, label: 'Home' },
  { icon: FaSearch, label: 'Search' },
  { icon: FaUser, label: 'Profile' },
  { icon: FaCog, label: 'Settings' },
];

const BottomNavBar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <nav className="bottom-nav">
      {navItems.map((item, index) => (
        <button
          key={item.label}
          className={`nav-item ${index === activeIndex ? 'active' : ''}`}
          onClick={() => setActiveIndex(index)}
        >
          <item.icon className="icon" />
          <span className="label">{item.label}</span>
          {index === activeIndex && <div className="active-indicator" />}
        </button>
      ))}
      <div 
        className="slider" 
        style={{ 
          transform: `translateX(${activeIndex * 100}%)`,
          width: `${100 / navItems.length}%`
        }}
      />
    </nav>
  );
};

export default BottomNavBar;