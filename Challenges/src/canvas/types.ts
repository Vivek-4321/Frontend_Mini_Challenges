export type Tool = 'brush' | 'eraser' | 'line' | 'square' | 'circle' | 'diamond';
export type ShapeTool = 'line' | 'square' | 'circle' | 'diamond';

export interface Shape {
  type: ShapeTool;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  size: number;
}