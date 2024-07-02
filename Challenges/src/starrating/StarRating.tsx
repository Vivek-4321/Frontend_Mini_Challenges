import React, { useState, useCallback, useEffect } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import "./StarRating.css";

interface StarRatingProps {
  totalStars?: number;
  initialRating?: number;
  onChange?: (rating: number) => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  glowColor?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  totalStars = 5,
  initialRating = 0,
  onChange,
  size = 24,
  activeColor = "#ffd700",
  inactiveColor = "#e4e5e9",
  glowColor = "#fff9c4",
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLLabelElement>, index: number) => {
      const star = event.currentTarget.getBoundingClientRect();
      const starCenter = star.left + star.width / 2;
      const isLeftHalf = event.clientX < starCenter;
      setHover(index + (isLeftHalf ? 0.5 : 1));
    },
    []
  );

  const handleClick = useCallback(() => {
    setRating(hover);
    if (onChange) {
      onChange(hover);
    }
  }, [hover, onChange]);

  return (
    <div className="star-rating-container">
      <div
        className="star-rating"
        style={
          {
            "--star-size": `${size}px`,
            "--active-color": activeColor,
            "--inactive-color": inactiveColor,
            "--glow-color": glowColor,
          } as React.CSSProperties
        }
      >
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          const isActiveHalf = hover - index === 0.5;
          const isActiveFull = starValue <= Math.floor(hover);
          const isActive = isActiveHalf || isActiveFull;
          return (
            <label
              key={index}
              className={`star-label ${isActive ? "active" : ""}`}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => setHover(rating)}
              onClick={handleClick}
            >
              <input type="radio" name="rating" value={starValue} />
              {isActiveHalf ? (
                <FaStarHalfAlt className="star half" />
              ) : (
                <FaStar className="star" />
              )}
            </label>
          );
        })}
        <span className="rating-value">{hover.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default StarRating;
