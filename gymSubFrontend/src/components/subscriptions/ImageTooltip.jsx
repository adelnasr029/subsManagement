import React, { useState } from "react";

const ImageTooltip = ({ imageUrl, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="tooltip-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div className="tooltip">
          <img src={imageUrl} alt="Subscriber" />
        </div>
      )}
    </div>
  );
};

export default ImageTooltip;