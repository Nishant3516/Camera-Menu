// components/Character.jsx
import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Character({ selectedItem }) {
  const { scene } = useGLTF("/assets/character.glb");
  const handRef = useRef();

  useEffect(() => {
    if (selectedItem === "pizza") loadItem("/assets/pizza.glb");
    if (selectedItem === "sushi") loadItem("/assets/sushi.glb");
  }, [selectedItem]);

  const loadItem = (url) => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      const itemScene = gltf.scene;
      if (handRef.current) {
        handRef.current.clear(); // Remove old item
        handRef.current.add(itemScene); // Add new item
      }
    });
  };

  return (
    <primitive object={scene} scale={[0.3, 0.3, 0.3]} position={[0, -1.5, 0]}>
      <group ref={handRef} position={[0.3, 1.2, 0]} />
    </primitive>
  );
}
