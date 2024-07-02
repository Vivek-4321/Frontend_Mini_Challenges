import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface DataPoint {
  value: number;
  timestamp: number;
}

interface AnimatedLineGraphProps {
  width?: number;
  height?: number;
  dataInterval?: number;
  lineColor?: string;
  backgroundColor?: string;
  maxDataPoints?: number;
  animationDuration?: number;
  showTooltip?: boolean;
  showCurrentValue?: boolean;
  showTitle?: boolean;
  yAxisRange?: [number, number];
  xAxisRange?: [number, number];  // New prop for x-axis range
  lineThickness?: number;
  fontFamily?: string;
  titleFontSize?: number;
  labelFontSize?: number;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  getData?: () => Promise<number>;
  viewMode?: 'scrolling' | 'compressed';
  showNodes?: boolean;
  showGridLines?: boolean;
  axisColor?: string;  // New prop for axis color
  axisLabelColor?: string;  // New prop for axis label color
  axisTitleColor?: string;  // New prop for axis title color
  gridLineColor?: string;  // New prop for grid line color
  tooltipBackgroundColor?: string;  // New prop for tooltip background color
  tooltipTextColor?: string;  // New prop for tooltip text color
}

const AnimatedLineGraph: React.FC<AnimatedLineGraphProps> = ({
  width = 800,
  height = 500,
  dataInterval = 600,
  lineColor="#FF5733",  //#4CAF50'
  backgroundColor = '#2a2a2a',
  maxDataPoints = 100,
  animationDuration = 500,
  showTooltip = true,
  showCurrentValue = true,
  showTitle = false,
  yAxisRange = [-100, 100],
  xAxisRange = [0, 500],  // Default x-axis range
  lineThickness = 3,
  fontFamily = 'Arial, sans-serif',
  titleFontSize = 24,
  labelFontSize = 12,
  title = 'Dynamic Line Graph',
  xAxisLabel = 'Time',
  yAxisLabel = 'Value',
  getData = async () => (Math.random() - 0.5) * 200,
  viewMode = 'scrolling',
  showNodes = true,
  showGridLines = true,
  axisColor = '#888',  // Default axis color
  axisLabelColor = '#888',  // Default axis label color
  axisTitleColor = '#888',  // Default axis title color
  gridLineColor = '#444',  // Default grid line color
  tooltipBackgroundColor = 'rgba(40, 40, 40, 0.9)',  // Default tooltip background color
  tooltipTextColor = 'white',  // Default tooltip text color
  gradientIntensity = 0.7,  // Default gradient intensity
  gradientColors = ['rgba(255,87,51,0.8)', 'rgba(255,87,51,0.4)', 'rgba(255,87,51,0)'],  // Custom gradient colors (optional)
}) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);

  const padding = useMemo(() => ({ top: 40, right: 40, bottom: 60, left: 60 }), []);
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const [minValue, maxValue] = yAxisRange;
  const [minX, maxX] = xAxisRange;

  // Function to adjust color opacity
  const adjustColorOpacity = (color: string, opacity: number): string => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

    // Gradient colors based on lineColor or custom gradientColors
    const gradientColorStops = useMemo(() => {
      if (gradientColors) {
        return gradientColors.map((color, index) => ({
          offset: `${index * 50}%`,
          stopColor: color,
        }));
      }
      return [
        { offset: '0%', stopColor: adjustColorOpacity(lineColor, gradientIntensity) },
        { offset: '50%', stopColor: adjustColorOpacity(lineColor, gradientIntensity * 0.6) },
        { offset: '100%', stopColor: adjustColorOpacity(lineColor, 0) },
      ];
    }, [lineColor, gradientIntensity, gradientColors]);
  

  const getX = useCallback((index: number): number => {
    if (viewMode === 'compressed') {
      return (index / (data.length - 1 || 1)) * graphWidth + padding.left;
    } else {
      return ((index / (maxDataPoints - 1)) * (maxX - minX) + minX) / (maxX - minX) * graphWidth + padding.left;
    }
  }, [graphWidth, padding.left, maxDataPoints, data.length, viewMode, minX, maxX]);

  const getY = useCallback((value: number): number => 
    graphHeight - ((value - minValue) / (maxValue - minValue)) * graphHeight + padding.top,
    [graphHeight, padding.top, minValue, maxValue]
  );

  function getCssVariableValue(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  }


  useEffect(() => {
    const fetchData = async () => {
      const newValue = await getData();
      setData(prevData => {
        const newData = [
          ...prevData,
          { value: Math.max(minValue, Math.min(maxValue, newValue)), timestamp: Date.now() }
        ];
        return viewMode === 'scrolling' ? newData.slice(-maxDataPoints) : newData;
      });
    };

    const interval = setInterval(fetchData, dataInterval);

    return () => clearInterval(interval);
  }, [dataInterval, maxDataPoints, minValue, maxValue, getData, viewMode]);

  const linePath = useMemo(() => 
    data.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.value)}`
    ).join(' '),
    [data, getX, getY]
  );

  const areaPath = useMemo(() => 
    `${linePath} L ${getX(data.length - 1)} ${getY(minValue)} L ${padding.left} ${getY(minValue)} Z`,
    [linePath, getX, getY, data.length, padding.left, minValue]
  );

  useEffect(() => {
    if (data.length < 2) return;

    const svg = svgRef.current;
    if (!svg) return;

    const lineSegment = svg.querySelector('.line-segment') as SVGPathElement;
    const areaGradient = svg.querySelector('.area-gradient') as SVGPathElement;
    const mainPath = svg.querySelector('.line-path') as SVGPathElement;

    const prevX = getX(data.length - 2);
    const prevY = getY(data[data.length - 2].value);
    const newX = getX(data.length - 1);
    const newY = getY(data[data.length - 1].value);

    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / animationDuration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out

      const currentX = prevX + (newX - prevX) * easedProgress;
      const currentY = prevY + (newY - prevY) * easedProgress;

      lineSegment.setAttribute('d', `M ${prevX} ${prevY} L ${currentX} ${currentY}`);
      
      const updatedLinePath = data.slice(0, -1).map((point, index) => 
        `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.value)}`
      ).join(' ') + ` L ${currentX} ${currentY}`;
      
      mainPath.setAttribute('d', updatedLinePath);
      areaGradient.setAttribute('d', `${updatedLinePath} L ${currentX} ${getY(minValue)} L ${padding.left} ${getY(minValue)} Z`);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        lineSegment.setAttribute('d', '');
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, getX, getY, animationDuration, padding.left, minValue]);

  const yAxisLabels = useMemo(() => 
    [minValue, (minValue + maxValue) / 2, maxValue].map(value => (
      <text key={`y-${value}`} x={padding.left - 10} y={getY(value)} className="axis-label" textAnchor="end">
        {value}
      </text>
    )),
    [minValue, maxValue, padding.left, getY]
  );

  const xAxisLabels = useMemo(() => {
    const totalPoints = viewMode === 'compressed' ? data.length : maxDataPoints;
    return [0, 25, 50, 75, 100].map(value => (
      <text 
        key={`x-${value}`} 
        x={getX(Math.floor(totalPoints * (value / 100)))} 
        y={height - padding.bottom + 20} 
        className="axis-label"
      >
        {viewMode === 'compressed' ? `${value}%` : `${minX + (value / 100) * (maxX - minX)}`}
      </text>
    ));
  }, [getX, height, padding.bottom, maxDataPoints, data.length, viewMode, minX, maxX]);

  const gridLines = useMemo(() => {
    if (!showGridLines) return null;

    const horizontalLines = Array.from({ length: 5 }, (_, i) => (
      <line
        key={`h-${i}`}
        x1={padding.left}
        y1={padding.top + (graphHeight / 4) * i}
        x2={width - padding.right}
        y2={padding.top + (graphHeight / 4) * i}
        className="grid-line"
      />
    ));

    const verticalLines = Array.from({ length: 5 }, (_, i) => (
      <line
        key={`v-${i}`}
        x1={padding.left + (graphWidth / 4) * i}
        y1={padding.top}
        x2={padding.left + (graphWidth / 4) * i}
        y2={height - padding.bottom}
        className="grid-line"
      />
    ));

    return [...horizontalLines, ...verticalLines];
  }, [showGridLines, padding.left, padding.top, padding.right, padding.bottom, graphHeight, graphWidth, width, height]);

  return (
    <div className="graph-container" style={{ backgroundColor, fontFamily }}>
    <h2 className="graph-title" style={showTitle ? {} : { display: 'none' }}>{title}</h2>

      <div className="graph-content">
        <svg className="graph-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" ref={svgRef}>
          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              {/* <stop offset="0%" stopColor={`${lineColor}80`} />
              <stop offset="50%" stopColor={`${lineColor}40`} />
              <stop offset="100%" stopColor={`${lineColor}00`} /> */}
              {gradientColorStops.map((stop, index) => (
              <stop key={index} offset={stop.offset} stopColor={stop.stopColor} />
            ))}
            </linearGradient>
          </defs>
          
          {showGridLines && gridLines}

          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} className="axis" />
          <line x1={padding.left} y1={getY(0)} x2={width - padding.right} y2={getY(0)} className="axis" />
          
          {xAxisLabels}
          {yAxisLabels}

          <text x={width / 2} y={height - 10} className="axis-title">{xAxisLabel}</text>
          <text x={-height / 2} y={20} className="axis-title" transform="rotate(-90)">{yAxisLabel}</text>

          <path d={areaPath} className="area-gradient" />
          <path d={linePath} className="line-path" style={{ stroke: lineColor, strokeWidth: lineThickness }} />
          <path d="" className="line-segment" style={{ stroke: lineColor, strokeWidth: lineThickness }} />

          {showNodes && showTooltip && data.map((point, index) => (
            <circle
              key={point.timestamp}
              cx={getX(index)}
              cy={getY(point.value)}
              r="4"
              className="data-point"
              style={{ fill: lineColor }}
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {showTooltip && hoveredPoint !== null && (
            <g>
              <rect
                x={getX(hoveredPoint) - 30}
                y={getY(data[hoveredPoint].value) - 30}
                width="60"
                height="20"
                rx="5"
                ry="5"
                className="tooltip-bg"
              />
              <text
                x={getX(hoveredPoint)}
                y={getY(data[hoveredPoint].value) - 15}
                className="tooltip-text"
              >
                {data[hoveredPoint].value.toFixed(2)}
              </text>
            </g>
          )}
        </svg>
        {showCurrentValue && data.length > 0 && (
          <div className="current-value">
            {data.length > 1 && data[data.length - 1].value > data[data.length - 2].value ? (
              <FiArrowUp className="arrow up" />
            ) : (
              <FiArrowDown className="arrow down" />
            )}
            <span className="value-text">
              {data[data.length - 1]?.value.toFixed(2) || '0.00'}
            </span>
          </div>
        )}
      </div>
      <style jsx>{`
        .graph-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 90vh;
          color: var(--color-light);
          padding: 2rem;
          background-color: ${getCssVariableValue('--color-primary')} !important;
        }
        .graph-title {
          font-size: ${titleFontSize}px;
          font-weight: bold;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .graph-content {
          position: relative;
          width: 100%;
          max-width: ${width}px;
          height: ${height}px;
          border-radius: 1rem;
          padding: 1.5rem;
          border: 3px solid ${getCssVariableValue('--color-dark')};
          box-shadow:  20px 20px 60px #0a0b0a,
    -20px -20px 60px #121412;
        }
        .graph-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .line-path, .line-segment {
          fill: none;
          filter: drop-shadow(0 2px 4px ${lineColor}80);
        }
        .area-gradient {
          fill: url(#areaGradient);
          opacity: 1;
        }
        .data-point {
          filter: drop-shadow(0 2px 4px ${lineColor}80);
        }
        .data-point:hover {
          r: 6;
        }
        .tooltip-bg {
          fill: ${tooltipBackgroundColor};
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }
        .tooltip-text {
          fill: ${tooltipTextColor};
          font-size: ${labelFontSize}px;
          font-weight: bold;
          text-anchor: middle;
        }
        .current-value {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          align-items: center;
          background-color: ${getCssVariableValue('--color-dark')};
          border-radius: 9999px;
          padding: 0.5rem 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .arrow {
          margin-right: 0.5rem;
          font-size: 1.2rem;
        }
        .arrow.up {
          color: #4CAF50;
        }
        .arrow.down {
          color: #f44336;
        }
        .value-text {
          font-size: 1rem;
          font-weight: bold;
        }
        .axis {
          stroke: ${axisColor};
          stroke-width: 1;
        }
        .axis-label {
          fill: ${axisLabelColor};
          font-size: ${labelFontSize}px;
          text-anchor: middle;
        }
        .axis-title {
          fill: ${axisTitleColor};
          font-size: ${labelFontSize + 2}px;
          text-anchor: middle;
        }
        .grid-line {
          stroke: ${gridLineColor};
          stroke-width: 1;
          stroke-dasharray: 5, 5;
        }
      `}</style>
    </div>
  );
};

export default AnimatedLineGraph;
