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

const PlaneOutline = ({ position, size, color }) => {
  const geometryRef = useRef();

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.computeBoundingBox();
    }
  }, []);

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry ref={geometryRef} args={[size, size]} />
      <meshBasicMaterial
        color={color}
        wireframe={true}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
};

const ARScene = ({ heldItem }) => {
  const { gl, camera } = useThree();
  const [hitPosition, setHitPosition] = useState(null);
  const [detectedPlane, setDetectedPlane] = useState(null);
  const hitTestSourceRef = useRef();
  const refSpace = useRef();

  useEffect(() => {
    const startAR = async () => {
      if (!navigator.xr) {
        alert("WebXR not supported on this browser");
        return;
      }

      const supported = await navigator.xr.isSessionSupported("immersive-ar");
      if (!supported) {
        alert("AR not supported on this device");
        return;
      }

      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "local-floor"],
      });

      gl.xr.enabled = true;
      gl.xr.setReferenceSpaceType("local-floor");
      gl.xr.setSession(session);

      const refSpaceVal = await session.requestReferenceSpace("viewer");
      refSpace.current = refSpaceVal;

      const hitTestSource = await session.requestHitTestSource({
        space: refSpaceVal,
      });
      hitTestSourceRef.current = hitTestSource;

      session.addEventListener("end", () => {
        hitTestSourceRef.current = null;
      });
    };

    startAR();
  }, [gl]);

  useFrame((state) => {
    const frame = state.gl.xr.getFrame();
    const referenceSpace = state.gl.xr.getReferenceSpace();

    if (!frame || !hitTestSourceRef.current || !referenceSpace) return;

    const hits = frame.getHitTestResults(hitTestSourceRef.current);
    if (hits.length > 0) {
      const hit = hits[0];
      const pose = hit.getPose(referenceSpace);
      if (pose) {
        const pos = new THREE.Vector3().fromArray(
          pose.transform.position.toArray()
        );
        setHitPosition(pos);
        setDetectedPlane({ position: pos, size: 0.5 });
      }
    } else {
      setDetectedPlane(null);
    }
  });

  return (
    <>
      {!detectedPlane && hitPosition && (
        <PlaneOutline position={hitPosition} size={0.3} color="green" />
      )}

      {detectedPlane && (
        <PlaneOutline
          position={detectedPlane.position}
          size={detectedPlane.size}
          color="blue"
        />
      )}

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
      style={{
        width: "100vw",
        height: "100vh",
        background: "transparent",
        pointerEvents: "none",
      }}
      gl={{ alpha: true, preserveDrawingBuffer: true }}
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
