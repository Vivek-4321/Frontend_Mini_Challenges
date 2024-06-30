import React from 'react';
import { FaCircleNotch } from 'react-icons/fa';
import "./SkeletonLoader.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = ''
}) => (
  <div 
    className={`skeleton ${className}`} 
    style={{ width, height, borderRadius }}
  />
);

interface SkeletonLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ isLoading, children }) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-content">
        <Skeleton height="50px" className="title" />
        <Skeleton height="20px" width="80%" />
        <Skeleton height="20px" width="90%" />
        <Skeleton height="20px" width="75%" />
      </div>
      <div className="skeleton-footer">
        <FaCircleNotch className="loading-icon" />
        <span>Loading...</span>
      </div>
    </div>
  );
};

// Example usage
const ExampleComponent: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SkeletonLoader isLoading={isLoading}>
      <div className="content">
        <h1>Welcome to My Dark-themed App</h1>
        <p>This is some example content that will be shown when loading is complete.</p>
        <p>It replaces the skeleton loader.</p>
      </div>
    </SkeletonLoader>
  );
};

export default function App() {
  return (
    <div className="skeleton-app">
      <ExampleComponent />
    </div>
  );
}