// components/Scene.jsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Character from "./Character";

export default function Scene({ selectedItem }) {
  return (
    <Canvas className="three-canvas">
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Character selectedItem={selectedItem} />
      </Suspense>
      <OrbitControls target={[0, 0, 0]} />
    </Canvas>
  );
}
