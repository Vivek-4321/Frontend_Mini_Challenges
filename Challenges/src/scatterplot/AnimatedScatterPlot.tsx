import React, { useState, useRef, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

interface DataPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

interface AnimatedScatterPlotProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  title?: string;
  fontFamily?: string;
  backgroundColor?: string;
  titleFontSize?: number;
  titleColor?: string;
  axisColor?: string;
  axisLabelColor?: string;
  axisLabelFontSize?: number;
  defaultPointColor?: string;
  pointSize?: number;
  pointHoverSize?: number;
  animationDuration?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  margin?: { top: number; right: number; bottom: number; left: number };
  showGridLines?: boolean;
  gridLineColor?: string;
}

const AnimatedScatterPlot: React.FC<AnimatedScatterPlotProps> = ({
  data,
  width = 600,
  height = 400,
  title = 'Animated Scatter Plot',
  fontFamily = 'Arial, sans-serif',
  backgroundColor = '#f0f0f0',
  titleFontSize = 24,
  titleColor = '#333',
  axisColor = '#666',
  axisLabelColor = '#555',
  axisLabelFontSize = 12,
  defaultPointColor = '#3498db',
  pointSize = 5,
  pointHoverSize = 8,
  animationDuration = 1000,
  xAxisLabel = 'X Axis',
  yAxisLabel = 'Y Axis',
  margin = { top: 40, right: 40, bottom: 60, left: 60 },
  showGridLines = true,
  gridLineColor = '#ddd'
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const xMin = Math.min(...data.map(d => d.x));
  const xMax = Math.max(...data.map(d => d.x));
  const yMin = Math.min(...data.map(d => d.y));
  const yMax = Math.max(...data.map(d => d.y));

  const xScale = (x: number) => (x - xMin) / (xMax - xMin) * chartWidth;
  const yScale = (y: number) => chartHeight - (y - yMin) / (yMax - yMin) * chartHeight;

  const xTicks = 5;
  const yTicks = 5;

  useEffect(() => {
    if (svgRef.current) {
      const svg = svgRef.current;
      const points = svg.querySelectorAll('.point');
      
      points.forEach((point, index) => {
        point.animate(
          [
            { opacity: 0, transform: 'scale(0)' },
            { opacity: 1, transform: 'scale(1)' }
          ],
          {
            duration: animationDuration,
            delay: index * 50,
            fill: 'forwards',
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
          }
        );
      });
    }
  }, [data, animationDuration]);

  return (
    <div style={{ fontFamily, backgroundColor, padding: '20px', borderRadius: '10px' }}>
      <h2 style={{ fontSize: titleFontSize, color: titleColor, textAlign: 'center', marginBottom: '20px' }}>{title}</h2>
      <svg ref={svgRef} width={width} height={height}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {showGridLines && [...Array(xTicks)].map((_, i) => (
            <line
              key={`x-grid-${i}`}
              x1={chartWidth * (i / (xTicks - 1))}
              y1={0}
              x2={chartWidth * (i / (xTicks - 1))}
              y2={chartHeight}
              stroke={gridLineColor}
              strokeDasharray="4 4"
            />
          ))}
          {showGridLines && [...Array(yTicks)].map((_, i) => (
            <line
              key={`y-grid-${i}`}
              x1={0}
              y1={chartHeight * (i / (yTicks - 1))}
              x2={chartWidth}
              y2={chartHeight * (i / (yTicks - 1))}
              stroke={gridLineColor}
              strokeDasharray="4 4"
            />
          ))}

          {/* X-axis */}
          <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke={axisColor} />
          <text x={chartWidth / 2} y={chartHeight + 40} textAnchor="middle" fill={axisLabelColor} fontSize={axisLabelFontSize}>{xAxisLabel}</text>
          
          {/* Y-axis */}
          <line x1={0} y1={0} x2={0} y2={chartHeight} stroke={axisColor} />
          <text x={-40} y={chartHeight / 2} textAnchor="middle" fill={axisLabelColor} fontSize={axisLabelFontSize} transform={`rotate(-90, -40, ${chartHeight / 2})`}>{yAxisLabel}</text>
          
          {/* Axis ticks and labels */}
          {[...Array(xTicks)].map((_, i) => (
            <g key={`x-tick-${i}`}>
              <line
                x1={chartWidth * (i / (xTicks - 1))}
                y1={chartHeight}
                x2={chartWidth * (i / (xTicks - 1))}
                y2={chartHeight + 5}
                stroke={axisColor}
              />
              <text
                x={chartWidth * (i / (xTicks - 1))}
                y={chartHeight + 20}
                textAnchor="middle"
                fill={axisLabelColor}
                fontSize={axisLabelFontSize}
              >
                {(xMin + (xMax - xMin) * (i / (xTicks - 1))).toFixed(1)}
              </text>
            </g>
          ))}
          {[...Array(yTicks)].map((_, i) => (
            <g key={`y-tick-${i}`}>
              <line
                x1={-5}
                y1={chartHeight * (i / (yTicks - 1))}
                x2={0}
                y2={chartHeight * (i / (yTicks - 1))}
                stroke={axisColor}
              />
              <text
                x={-10}
                y={chartHeight * (i / (yTicks - 1))}
                textAnchor="end"
                alignmentBaseline="middle"
                fill={axisLabelColor}
                fontSize={axisLabelFontSize}
              >
                {(yMax - (yMax - yMin) * (i / (yTicks - 1))).toFixed(1)}
              </text>
            </g>
          ))}

          {/* Data points */}
          {data.map((point, index) => (
            <circle
              key={index}
              className="point"
              cx={xScale(point.x)}
              cy={yScale(point.y)}
              r={hoveredPoint === point ? pointHoverSize : pointSize}
              fill={point.color || defaultPointColor}
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </g>
      </svg>
      
      {hoveredPoint && (
        <div className="tooltip">
          <FaInfoCircle style={{ marginRight: '5px' }} />
          {hoveredPoint.label || `(${hoveredPoint.x.toFixed(2)}, ${hoveredPoint.y.toFixed(2)})`}
        </div>
      )}
      
      <style jsx>{`
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
        .point {
          transition: r 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default AnimatedScatterPlot;