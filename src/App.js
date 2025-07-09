import React, { useState } from "react";
import ARCharacterScene from "./ARCharacterScene";
import Menu from "./Menu";

function App() {
  const [item, setItem] = useState(null);
  const [arStarted, setArStarted] = useState(false);

  return (
    <>
      {!arStarted && (
        <div
          onClick={() => setArStarted(true)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "24px",
            zIndex: 9999,
            cursor: "pointer",
          }}
        >
          Tap to Start AR
        </div>
      )}

      {arStarted && (
        <>
          <ARCharacterScene heldItem={item} />
          <Menu onSelect={setItem} />
        </>
      )}
    </>
  );
}

export default App;
