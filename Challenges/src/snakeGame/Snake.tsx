import React from 'react';

interface SnakeProps {
    snakeDots: number[][];
}

const Snake: React.FC<SnakeProps> = ({ snakeDots }) => {
    return (
        <>
            {snakeDots.map((dot, i) => (
                <div key={i} className={i === snakeDots.length - 1 ? 'snake-head' : 'snake-dot'} style={{ left: `${dot[0]}%`, top: `${dot[1]}%` }} />
            ))}
        </>
    );
};

export default Snake;
