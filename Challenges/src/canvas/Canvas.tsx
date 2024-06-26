import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tool, Shape, ShapeTool } from './types';
import ZoomControls from './ZoomControls';

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  color: string;
  size: number;
  tool: Tool;
  currentShape: Shape | null;
  setCurrentShape: React.Dispatch<React.SetStateAction<Shape | null>>;
  updateHistory: (newState: ImageData) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  color,
  size,
  tool,
  currentShape,
  setCurrentShape,
  updateHistory,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingPointsRef = useRef<{ x: number; y: number }[]>([]);

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    if (canvas && tempCanvas) {
      const width = window.innerWidth * 2;
      const height = window.innerHeight * 2;
      canvas.width = width;
      canvas.height = height;
      tempCanvas.width = width;
      tempCanvas.height = height;
      const context = canvas.getContext('2d');
      const tempContext = tempCanvas.getContext('2d');
      if (context && tempContext) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        tempContext.lineCap = 'round';
        tempContext.lineJoin = 'round';
        // Fill the canvas with a background color
        context.fillStyle = '#0E0F0E';
        context.fillRect(0, 0, width, height);
      }
    }
  }, [canvasRef]);

  useEffect(() => {
    initializeCanvas();
    window.addEventListener('resize', initializeCanvas);
    return () => {
      window.removeEventListener('resize', initializeCanvas);
    };
  }, [initializeCanvas]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [size]);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return; // Only proceed if left mouse button is pressed
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - panOffset.x) / zoom;
      const y = (e.clientY - rect.top - panOffset.y) / zoom;

      if (isShapeTool(tool)) {
        setCurrentShape({
          type: tool,
          startX: x,
          startY: y,
          endX: x,
          endY: y,
          color,
          size,
        });
      } else {
        drawingPointsRef.current = [{ x, y }];
      }
      setIsDrawing(true);
    }
  }, [zoom, tool, color, size, setCurrentShape, panOffset]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const tempCanvas = tempCanvasRef.current;
    if (canvas && tempCanvas) {
      const context = canvas.getContext('2d');
      const tempContext = tempCanvas.getContext('2d');
      if (context && tempContext) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - panOffset.x) / zoom;
        const y = (e.clientY - rect.top - panOffset.y) / zoom;

        if (isShapeTool(tool) && currentShape) {
          tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempContext.drawImage(canvas, 0, 0);
          drawShape(tempContext, { ...currentShape, endX: x, endY: y });
        } else {
          drawingPointsRef.current.push({ x, y });
          drawSmoothLine(context);
        }
      }
    }
  }, [isDrawing, zoom, tool, currentShape, panOffset]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    if (canvasRef.current && tempCanvasRef.current) {
      const canvas = canvasRef.current;
      const tempCanvas = tempCanvasRef.current;
      const context = canvas.getContext('2d');
      const tempContext = tempCanvas.getContext('2d');
      if (context && tempContext) {
        if (isShapeTool(tool) && currentShape) {
          context.drawImage(tempCanvas, 0, 0);
          tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        }
        const newState = context.getImageData(0, 0, canvas.width, canvas.height);
        updateHistory(newState);
      }
    }
    setCurrentShape(null);
    drawingPointsRef.current = [];
  }, [tool, currentShape, updateHistory]);

  const drawSmoothLine = (context: CanvasRenderingContext2D) => {
    const points = drawingPointsRef.current;
    if (points.length < 2) return;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 2; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    context.quadraticCurveTo(
      points[points.length - 2].x,
      points[points.length - 2].y,
      points[points.length - 1].x,
      points[points.length - 1].y
    );

    context.strokeStyle = tool === 'eraser' ? '#0E0F0E' : color;
    context.lineWidth = size / zoom;
    context.stroke();
  };

  const drawShape = (context: CanvasRenderingContext2D, shape: Shape) => {
    const { type, startX, startY, endX, endY, color, size } = shape;
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = size / zoom;

    switch (type) {
      case 'line':
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        break;
      case 'square':
        context.rect(startX, startY, endX - startX, endY - startY);
        break;
      case 'circle':
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        context.arc(startX, startY, radius, 0, 2 * Math.PI);
        break;
      case 'diamond':
        context.moveTo(startX, startY + (endY - startY) / 2);
        context.lineTo(startX + (endX - startX) / 2, startY);
        context.lineTo(endX, startY + (endY - startY) / 2);
        context.lineTo(startX + (endX - startX) / 2, endY);
        context.closePath();
        break;
    }
    context.stroke();
  };

  const isShapeTool = (tool: Tool): tool is ShapeTool => {
    return ['line', 'square', 'circle', 'diamond'].includes(tool);
  };

  const handleZoom = useCallback((newZoom: number) => {
    setZoom(newZoom);
    if (canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      canvas.style.transition = 'transform 0.3s ease';
      canvas.style.transform = `scale(${newZoom})`;
      canvas.style.transformOrigin = 'top left';
    }
  }, []);

  const startPanning = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 4 || (e.buttons === 1 && e.altKey)) { // Middle mouse button or Alt + left click
      setIsPanning(true);
    }
  }, []);

  const pan = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      setPanOffset(prevOffset => ({
        x: prevOffset.x + e.movementX,
        y: prevOffset.y + e.movementY
      }));
    }
  }, [isPanning]);

  const stopPanning = useCallback(() => {
    setIsPanning(false);
  }, []);

  
  return (
    <div 
      ref={containerRef} 
      className="canvas-container" 
      style={{ 
        position: 'relative', 
        overflow: 'hidden',
        width: '100vw',
        height: 'calc(100vh - 60px)', // Subtract toolbar height
        cursor: isPanning ? 'grabbing' : 'default'
      }}
      onMouseDown={startPanning}
      onMouseMove={pan}
      onMouseUp={stopPanning}
      onMouseLeave={stopPanning}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
        transition: isPanning ? 'none' : 'transform 0.3s ease',
      }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            transition: 'transform 0.3s ease',
          }}
        />
        <canvas
          ref={tempCanvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            transition: 'transform 0.3s ease',
          }}
        />
      </div>
      {(tool === 'brush' || tool === 'eraser') && (
        <div
          ref={cursorRef}
          className="cursor-preview"
          style={{
            width: `${size / zoom}px`,
            height: `${size / zoom}px`,
            border: '1px solid white',
            borderRadius: '50%',
            position: 'fixed',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
      <ZoomControls zoom={zoom} onZoomChange={handleZoom} />
    </div>
  );
};

export default Canvas;