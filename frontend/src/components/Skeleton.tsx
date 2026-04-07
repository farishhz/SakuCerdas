import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '1rem', 
  borderRadius = '0.5rem',
  className = '' 
}) => {
  return (
    <div 
      className={`pulse-animate ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'rgba(139, 92, 246, 0.1)',
        display: 'inline-block'
      }}
    />
  );
};

export default Skeleton;
