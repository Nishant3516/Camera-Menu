import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Character = ({ position }) => {
  const { scene } = useGLTF("/assets/character.glb");
  return (
    <primitive object={scene} position={position} scale={[0.3, 0.3, 0.3]} />
  );
};

const ARScene = ({ heldItem }) => {
  const { gl, scene, camera } = useThree();
  const [hitPosition, setHitPosition] = useState(null);
  const ref = useRef();
  const hitTestSourceRef = useRef();

  useEffect(() => {
    gl.xr.enabled = true;

    gl.setAnimationLoop(() => {
      gl.render(scene, camera);
    });

    // Add AR Button
    const arButton = ARButton.createButton(gl, {
      requiredFeatures: ["hit-test"],
    });
    document.body.appendChild(arButton);

    const onSessionStart = (session) => {
      session.requestReferenceSpace("viewer").then((referenceSpace) => {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then((source) => {
            hitTestSourceRef.current = source;
          });
      });
    };

    gl.xr.addEventListener("sessionstart", () => {
      const session = gl.xr.getSession();
      if (session) {
        onSessionStart(session);
      }
    });

    return () => {
      if (hitTestSourceRef.current) {
        hitTestSourceRef.current.cancel();
        hitTestSourceRef.current = null;
      }

      // Cleanup AR Button if needed
      if (arButton && arButton.parentNode) {
        arButton.parentNode.removeChild(arButton);
      }
    };
  }, [gl, scene, camera]);

  useFrame((state, delta) => {
    const xrFrame = state.gl.xr.getFrame();
    const referenceSpace = state.gl.xr.getReferenceSpace();

    if (!xrFrame || !hitTestSourceRef.current) return;

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
        <group ref={ref}>
          <Suspense fallback={null}>
            <Character position={hitPosition} />
            {/* You can place item based on heldItem here too */}
          </Suspense>
        </group>
      )}
    </>
  );
};

const ARCharacterScene = ({ heldItem }) => {
  return (
    <Canvas
      style={{ height: "100vh", width: "100vw" }}
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
