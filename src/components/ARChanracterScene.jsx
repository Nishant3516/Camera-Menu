// ARCharacterScene.js
import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Character = ({ position }) => {
  const { scene } = useGLTF("/assets/character.glb");
  return (
    <primitive object={scene} position={position} scale={[0.3, 0.3, 0.3]} />
  );
};

const Item = ({ type, position }) => {
  const { scene } = useGLTF(`/assets/${type}.glb`);
  return (
    <primitive object={scene} position={position} scale={[0.3, 0.3, 0.3]} />
  );
};

const ARScene = ({ heldItem }) => {
  const { gl, scene, camera } = useThree();
  const [hitPosition, setHitPosition] = useState(null);
  const hitTestSourceRef = useRef();
  const refSpace = useRef();

  useEffect(() => {
    const startARSession = async () => {
      gl.xr.enabled = true;

      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "local-floor"],
      });

      gl.xr.setSession(session);

      refSpace.current = await session.requestReferenceSpace("viewer");

      hitTestSourceRef.current = await session.requestHitTestSource({
        space: refSpace.current,
      });

      session.addEventListener("end", () => {
        hitTestSourceRef.current = null;
      });
    };

    if (navigator.xr) {
      navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
        if (supported) startARSession();
      });
    }
  }, [gl]);

  useFrame((state) => {
    const xrFrame = state.gl.xr.getFrame();
    const referenceSpace = state.gl.xr.getReferenceSpace();

    if (!xrFrame || !hitTestSourceRef.current || !referenceSpace) return;

    const hitTestResults = xrFrame.getHitTestResults(hitTestSourceRef.current);
    if (hitTestResults.length > 0) {
      const hit = hitTestResults[0];
      const pose = hit.getPose(referenceSpace);
      const pos = new THREE.Vector3().fromArray(
        pose.transform.position.toArray()
      );

      setHitPosition(pos);
    }
  });

  return (
    <>
      {hitPosition && (
        <Suspense fallback={null}>
          <Character position={hitPosition} />
          {heldItem && <Item type={heldItem} position={hitPosition} />}
        </Suspense>
      )}
    </>
  );
};

const ARCharacterScene = ({ heldItem }) => {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh" }}
      camera={{ near: 0.01, far: 20 }}
      onCreated={({ gl }) => {
        gl.xr.enabled = true;
      }}
    >
      <ARScene heldItem={heldItem} />
    </Canvas>
  );
};

export default ARCharacterScene;
