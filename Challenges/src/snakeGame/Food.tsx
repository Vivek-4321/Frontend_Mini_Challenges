import React from 'react';

interface FoodProps {
    dot: number[];
}

const Food: React.FC<FoodProps> = ({ dot }) => {
    return (
        <div className="snake-food" style={{ left: `${dot[0]}%`, top: `${dot[1]}%` }} />
    );
};

export default Food;
