// App.jsx
import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import Scene from "./components/Scene";
import ItemSelector from "./components/ItemSelector";

export default function App() {
  const videoRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
  }, []);

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  return (
    <>
      <video ref={videoRef} autoPlay muted playsInline id="video-feed" />
      <div className="overlay">
        {!showMenu && (
          <button onClick={() => setShowMenu(true)} className="start-button">
            Start
          </button>
        )}
        {showMenu && <ItemSelector onSelect={handleItemSelect} />}
      </div>

      <Scene selectedItem={showMenu} />
    </>
  );
}
