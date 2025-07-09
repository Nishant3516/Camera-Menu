// CharacterScene.js
import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Character = ({ heldItem }) => {
  const groupRef = useRef(); // <group> wrapper ref
  const { scene } = useGLTF("/assets/character.glb");
  const { camera } = useThree();
  const [scaled, setScaled] = useState(false);

  useEffect(() => {
    if (!groupRef.current || scaled) return;

    const box = new THREE.Box3().setFromObject(groupRef.current);
    const size = new THREE.Vector3();
    box.getSize(size);

    const desiredScreenFraction = 0.3;
    const distance = camera.position.z;
    const verticalFov = THREE.MathUtils.degToRad(camera.fov);
    const screenHeight = 2 * Math.tan(verticalFov / 2) * distance;

    const scale = (desiredScreenFraction * screenHeight) / size.y;
    groupRef.current.scale.setScalar(scale);

    const center = new THREE.Vector3();
    box.getCenter(center);
    groupRef.current.position.sub(center.multiplyScalar(scale));

    setScaled(true); // prevent re-scaling on re-renders
  }, [camera, scaled]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
};

const Item = ({ type }) => {
  const { scene } = useGLTF(`/assets/${type}.glb`);
  const targetHeight = 0.5;

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);

    const scale = targetHeight / size.y;
    scene.scale.setScalar(scale);

    // Optional centering
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center.multiplyScalar(scale));
  }, [scene]);

  return <primitive object={scene} />;
};

const CharacterScene = ({ heldItem }) => {
  return (
    <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <Suspense fallback={null}>
        <Character heldItem={heldItem} />
        {heldItem && <Item type={heldItem} />}
      </Suspense>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default CharacterScene;
