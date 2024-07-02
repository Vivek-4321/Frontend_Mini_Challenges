// SplitPane.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './SplitPane.module.css';

interface SplitPaneProps {
  direction: 'horizontal' | 'vertical';
  children: React.ReactNode[];
  sliderPositions?: number[];
}

const SplitPane: React.FC<SplitPaneProps> = ({ direction, children, sliderPositions = [] }) => {
  const [sizes, setSizes] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const separatorRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (containerRef.current) {
      const totalSize = direction === 'horizontal' ? containerRef.current.offsetWidth : containerRef.current.offsetHeight;
      const paneCount = children.length;
      const initialSizes = new Array(paneCount).fill(totalSize / paneCount);
      setSizes(initialSizes);
    }
  }, [children.length, direction]);

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    const startPosition = direction === 'horizontal' ? e.clientX : e.clientY;
    const startSizes = [...sizes];

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const endPosition = direction === 'horizontal' ? e.clientX : e.clientY;
        const diff = endPosition - startPosition;

        const newSizes = [...startSizes];
        newSizes[index] += diff;
        newSizes[index + 1] -= diff;

        // Ensure sizes don't go below 0
        newSizes[index] = Math.max(newSizes[index], 0);
        newSizes[index + 1] = Math.max(newSizes[index + 1], 0);

        setSizes(newSizes);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.splitPane} ${styles[direction]}`}
    >
      {children.map((child, index) => (
        <React.Fragment key={index}>
          <div
            className={styles.pane}
            style={{ flex: sizes[index] ? `0 0 ${sizes[index]}px` : '1 1 0' }}
          >
            {child}
          </div>
          {index < children.length - 1 && sliderPositions.includes(index) && (
            <div
              ref={(el) => (separatorRefs.current[index] = el)}
              className={`${styles.separator} ${styles[`separator${direction}`]}`}
              onMouseDown={handleMouseDown(index)}
            >
              <div className={styles.sliderHandle} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SplitPane;