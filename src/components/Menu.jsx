import React from "react";

const Menu = ({ onSelect }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "20px",
        zIndex: 10000,
        background: "rgba(255, 255, 255, 0.7)",
        padding: "10px 20px",
        borderRadius: "10px",
      }}
    >
      <button onClick={() => onSelect("pizza")}>Pizza</button>
      <button onClick={() => onSelect("sushi")}>Sushi</button>
    </div>
  );
};

export default Menu;
