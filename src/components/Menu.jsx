// Menu.js
import React from "react";

const Menu = ({ onSelect }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "80px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <button onClick={() => onSelect("pizza")}>Pizza</button>
      <button onClick={() => onSelect("sushi")}>Sushi</button>
    </div>
  );
};

export default Menu;
