import React from 'react';
import { FaRedo } from 'react-icons/fa';

interface ControlsProps {
    resetGame: () => void;
}

const Controls: React.FC<ControlsProps> = ({ resetGame }) => {
    return (
        <div className="controls-snake">
            <button onClick={resetGame}>
                <FaRedo /> Reset
            </button>
        </div>
    );
};

export default Controls;
