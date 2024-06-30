import React, { useState, useRef, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface AnimatedPieChartProps {
  data: PieChartData[];
  width?: number;
  height?: number;
  title?: string;
  fontFamily?: string;
  backgroundColor?: string;
  titleFontSize?: number;
  titleColor?: string;
  labelFontSize?: number;
  labelColor?: string;
  showPercentage?: boolean;
  percentageFontSize?: number;
  percentageColor?: string;
  sliceSpacing?: number;
  margin?: string;
  padding?: string;
}

const AnimatedPieChart: React.FC<AnimatedPieChartProps> = ({
  data,
  width = 400,
  height = 400,
  title = 'Animated Pie Chart',
  fontFamily = 'Arial, sans-serif',
  backgroundColor = '#2a2a2a',
  titleFontSize = 24,
  titleColor = 'white',
  labelFontSize = 12,
  labelColor = 'white',
  showPercentage = true,
  percentageFontSize = 14,
  percentageColor = 'white',
  sliceSpacing = 2,
  margin = '0',
  padding = '2rem',
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        const { width, height } = containerRef.current!.getBoundingClientRect();
        setContainerSize({ width, height });
      };
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartSize = Math.min(containerSize.width, containerSize.height) - 40; // Subtracting some padding
  const radius = chartSize / 2 * 0.8; // Adjust this value to change the pie size relative to the container

  let startAngle = 0;

  return (
    <div 
      className="chart-container" 
      style={{ 
        backgroundColor, 
        fontFamily, 
        width, 
        height,
        margin,
        padding,
        position: 'relative',
      }}
      ref={containerRef}
    >
      <h2 className="chart-title" style={{ 
        fontSize: titleFontSize,
        color: titleColor,
        textAlign: 'center',
        marginBottom: '1rem',
      }}>{title}</h2>
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: `calc(100% - ${titleFontSize + 20}px)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <svg 
          width={chartSize} 
          height={chartSize} 
          viewBox={`0 0 ${chartSize} ${chartSize}`}
          style={{ overflow: 'visible' }}
        >
          <g transform={`translate(${chartSize / 2}, ${chartSize / 2})`}>
            {data.map((item, index) => {
              const percentage = item.value / total;
              const endAngle = startAngle + percentage * 360;

              const startX = Math.cos((startAngle * Math.PI) / 180) * radius;
              const startY = Math.sin((startAngle * Math.PI) / 180) * radius;
              const endX = Math.cos((endAngle * Math.PI) / 180) * radius;
              const endY = Math.sin((endAngle * Math.PI) / 180) * radius;

              const largeArcFlag = percentage > 0.5 ? 1 : 0;

              const pathData = [
                `M ${startX} ${startY}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                'L 0 0',
              ].join(' ');

              const middleAngle = startAngle + (percentage * 360) / 2;
              const labelX = Math.cos((middleAngle * Math.PI) / 180) * (radius * 0.7);
              const labelY = Math.sin((middleAngle * Math.PI) / 180) * (radius * 0.7);

              const slice = (
                <g key={index} className="slice" onMouseEnter={() => setHoveredSlice(index)} onMouseLeave={() => setHoveredSlice(null)}>
                  <path
                    d={pathData}
                    fill={item.color}
                    stroke={backgroundColor}
                    strokeWidth={sliceSpacing}
                    className="slice-path"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    fill={labelColor}
                    fontSize={labelFontSize}
                    className="slice-label"
                  >
                    {item.label}
                  </text>
                  {showPercentage && (
                    <text
                      x={labelX}
                      y={labelY + labelFontSize + 5}
                      textAnchor="middle"
                      fill={percentageColor}
                      fontSize={percentageFontSize}
                      className="slice-percentage"
                    >
                      {(percentage * 100).toFixed(1)}%
                    </text>
                  )}
                </g>
              );

              startAngle = endAngle;
              return slice;
            })}
          </g>
        </svg>
      </div>
      {hoveredSlice !== null && (
        <div className="tooltip">
          <FaInfoCircle style={{ marginRight: '5px' }} />
          {data[hoveredSlice].label}: {((data[hoveredSlice].value / total) * 100).toFixed(1)}%
        </div>
      )}
      <style jsx>{`
        .chart-container {
          display: flex;
          flex-direction: column;
          color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .slice-path {
          transition: transform 0.3s ease;
        }
        .slice:hover .slice-path {
          transform: scale(1.05);
        }
        .slice-label, .slice-percentage {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .slice:hover .slice-label, .slice:hover .slice-percentage {
          opacity: 1;
        }
        .tooltip {
          position: absolute;
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          pointer-events: none;
          top: 10px;
          right: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateIn {
          from { transform: rotate(-180deg) scale(0); opacity: 0; }
          to { transform: rotate(0) scale(1); opacity: 1; }
        }
        .slice {
          animation: rotateIn 1s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default AnimatedPieChart;