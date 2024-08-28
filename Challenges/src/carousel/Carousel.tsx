// import React, { useState, useEffect } from "react";
// import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
// import "./Carousel.css";

// export default function Carousel({ data, showPeek = true, peekWidth = 30 }) {
//   const [slide, setSlide] = useState(0);
//   const [transitioning, setTransitioning] = useState(false);

//   const nextSlide = () => {
//     if (!transitioning) {
//       setTransitioning(true);
//       setSlide((prevSlide) => (prevSlide === data.length - 1 ? 0 : prevSlide + 1));
//     }
//   };

//   const prevSlide = () => {
//     if (!transitioning) {
//       setTransitioning(true);
//       setSlide((prevSlide) => (prevSlide === 0 ? data.length - 1 : prevSlide - 1));
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setTransitioning(false);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [slide]);

//   return (
//     <div className={`carousel ${showPeek ? 'peek' : ''}`} style={{ '--peek-width': `${peekWidth}px` }}>
//       <BsArrowLeftCircleFill onClick={prevSlide} className="arrow arrow-left" />
//       <div className="slides-container">
//         {data.map((item, idx) => {
//           let className = "slide";
//           if (idx === slide) className += " active";
//           else if (idx === (slide - 1 + data.length) % data.length) className += " prev";
//           else if (idx === (slide + 1) % data.length) className += " next";

//           return (
//             <img
//               src={item.image}
//               alt={item.alt}
//               key={idx}
//               className={className}
//             />
//           );
//         })}
//       </div>
//       <BsArrowRightCircleFill onClick={nextSlide} className="arrow arrow-right" />
//       <span className="indicators">
//         {data.map((_, idx) => (
//           <button
//             key={idx}
//             className={slide === idx ? "indicator" : "indicator indicator-inactive"}
//             onClick={() => setSlide(idx)}
//           ></button>
//         ))}
//       </span>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import "./Carousel.css";

export default function Carousel({ data, showPeek = true, peekWidth = 30, margin = 10 }) {
  const [slide, setSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const nextSlide = () => {
    if (!transitioning) {
      setTransitioning(true);
      setSlide((prevSlide) => (prevSlide === data.length - 1 ? 0 : prevSlide + 1));
    }
  };

  const prevSlide = () => {
    if (!transitioning) {
      setTransitioning(true);
      setSlide((prevSlide) => (prevSlide === 0 ? data.length - 1 : prevSlide - 1));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransitioning(false);
    }, 500); // Increase transition duration

    return () => clearTimeout(timer);
  }, [slide]);

  return (
    <div
      className={`carousel ${showPeek ? 'peek' : ''}`}
      style={{ '--peek-width': `${peekWidth}px`, '--margin': `${margin}px` }}
    >
      <BsArrowLeftCircleFill onClick={prevSlide} className="arrow arrow-left" />
      <div className="slides-container">
        {data.map((item, idx) => {
          let className = "slide";
          if (idx === slide) className += " active";
          else if (idx === (slide - 1 + data.length) % data.length) className += " prev";
          else if (idx === (slide + 1) % data.length) className += " next";

          return (
            <img
              src={item.image}
              alt={item.alt}
              key={idx}
              className={className}
            />
          );
        })}
      </div>
      <BsArrowRightCircleFill onClick={nextSlide} className="arrow arrow-right" />
      <span className="indicators">
        {data.map((_, idx) => (
          <button
            key={idx}
            className={slide === idx ? "indicator" : "indicator indicator-inactive"}
            onClick={() => setSlide(idx)}
          ></button>
        ))}
      </span>
    </div>
  );
}
