// App.js
import React, { useState } from "react";
import CameraFeed from "./components/CameraFeed";
import CharacterScene from "./components/CharacterScene";
import Menu from "./components/Menu";

function App() {
  const [started, setStarted] = useState(false);
  const [item, setItem] = useState(null);

  return (
    <>
      <CameraFeed />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        <CharacterScene heldItem={item} />
      </div>
      {!started ? (
        <button
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "16px 24px",
            fontSize: "1.2rem",
            zIndex: 10,
          }}
          onClick={() => setStarted(true)}
        >
          Start
        </button>
      ) : (
        <Menu onSelect={setItem} />
      )}
    </>
  );
}

export default App;
