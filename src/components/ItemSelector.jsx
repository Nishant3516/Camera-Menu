// components/ItemSelector.jsx
import React from "react";

export default function ItemSelector({ onSelect }) {
  return (
    <div className="menu">
      <button onClick={() => onSelect("pizza")}>🍕 Pizza</button>
      <button onClick={() => onSelect("sushi")}>🍣 Sushi</button>
    </div>
  );
}
