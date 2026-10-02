import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import { useDeviceCapability } from '@/hooks/use-device-capability';

export function RisingJellyfish({ url, scale = 1, speed = 1, startOffset = 0, xOffset = 0, zOffset = 0, rotationYOffset = 0 }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(url);
  
  // Safely clone skinned meshes so they can be animated independently
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstActionKey = Object.keys(actions)[0];
      const action = actions[firstActionKey];
      action.play();
      action.setEffectiveTimeScale(speed * 0.8);
    }

    // Apply procedural vertex shader to make tentacles wave organically
    clone.traverse((child) => {
      if (child.isMesh) {
        if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
        const maxY = child.geometry.boundingBox.max.y;
        const minY = child.geometry.boundingBox.min.y;
        const height = maxY - minY;

        // Clone material so we can apply custom uniforms safely
        child.material = child.material.clone();
        child.material.onBeforeCompile = (shader) => {
          shader.uniforms.uTime = { value: 0 };
          child.userData.shader = shader;

          shader.vertexShader = `
            uniform float uTime;
            ${shader.vertexShader}
          `;

          shader.vertexShader = shader.vertexShader.replace(
            `#include <begin_vertex>`,
            `
            #include <begin_vertex>
            
            // Normalized depth from top (0.0) to bottom (1.0)
            float normalizedDepth = max(0.0, (${maxY.toFixed(5)} - position.y) / max(0.001, ${height.toFixed(5)}));
            
            // Tentacles are usually the bottom 70% of the mesh
            float waveStrength = smoothstep(0.3, 1.0, normalizedDepth);
            
            // Apply organic sine waves based on Y position and time
            transformed.x += sin(position.y * 3.0 + uTime * 2.5) * waveStrength * ${0.1 / scale};
            transformed.z += cos(position.y * 2.5 + uTime * 2.0) * waveStrength * ${0.1 / scale};
            `
          );
        };
      }
    });
  }, [clone, actions, speed, scale]);

  useFrame(({ clock }) => {
    if (document.body.classList.contains('nav-open')) return;
    const t = clock.elapsedTime * speed + startOffset;
    
    // Update custom shader time for waving tentacles
    clone.traverse((child) => {
      if (child.isMesh && child.userData.shader) {
        child.userData.shader.uniforms.uTime.value = clock.elapsedTime * speed;
      }
    });

    if (groupRef.current) {
        // Since canvas is now fixed 100vh, we loop through a standard viewport height
        const yPos = ((t * 1.5) % 50) - 25;
        
        // Organic, wider X and Z weaving
        groupRef.current.position.x = Math.sin(t * 0.4) * 8 + Math.cos(t * 0.2) * 3 + xOffset;
        groupRef.current.position.y = yPos + Math.sin(t * 2) * 0.5; 
        groupRef.current.position.z = Math.cos(t * 0.3) * 6 + zOffset;
        
        // Complex, realistic tilt as they drift
        groupRef.current.rotation.y = rotationYOffset + Math.sin(t * 0.2) * 0.4;
        groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.2;
        groupRef.current.rotation.x = Math.cos(t * 0.4) * 0.15;
    }
  });

  return (
    <group ref={groupRef} scale={scale} dispose={null}>
      <primitive object={clone} />
    </group>
  );
}

export function SwimmingFish({ url, scale = 1, speed = 1, startOffset = 0, yOffset = 0, zOffset = 0, rotationYOffset = Math.PI }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(url);
  
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstActionKey = Object.keys(actions)[0];
      const action = actions[firstActionKey];
      action.play();
      action.setEffectiveTimeScale(speed * 0.8);
    }
  }, [clone, actions, speed]);

  useFrame(({ clock }) => {
    if (document.body.classList.contains('nav-open')) return;
    const t = clock.elapsedTime * speed + startOffset;
    
    if (groupRef.current) {
        // Faster movement across a wider area
        const xPos = ((t * 4) % 70) - 35;
        
        groupRef.current.position.x = xPos;
        // More dynamic swimming height (wobble)
        groupRef.current.position.y = yOffset + Math.sin(t * 2) * 1.5; 
        groupRef.current.position.z = Math.cos(t * 0.8) * 4 + zOffset;
        
        // Dynamic pitch and roll based on sine waves for realism
        groupRef.current.rotation.y = rotationYOffset + Math.cos(t * 1.2) * 0.15;
        groupRef.current.rotation.z = Math.cos(t * 2) * 0.15; // tilt up/down naturally
        groupRef.current.rotation.x = Math.sin(t * 0.8) * 0.2; // slight roll
    }
  });

  return (
    <group ref={groupRef} scale={scale} dispose={null}>
      <primitive object={clone} />
    </group>
  );
}

const RealisticGLBJellyfish = () => {
  const { isLowEnd, isMobile, ready } = useDeviceCapability();
  const [isHeroSection, setIsHeroSection] = React.useState(true);

  React.useEffect(() => {
    if (!ready || isLowEnd || isMobile) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsHeroSection(window.scrollY < window.innerHeight * 0.7);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [ready, isLowEnd, isMobile]);

  if (!ready || isLowEnd || isMobile) return null;

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none">
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden mix-blend-screen transition-opacity duration-700"
        style={{ opacity: isHeroSection ? 0 : 0.45 }}
      >
        <Canvas
          frameloop={isHeroSection ? 'never' : 'always'}
          camera={{ position: [0, 0, 15], fov: 45 }}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          dpr={[1, 1]}
          performance={{ min: 0.5 }}
        >
          <ambientLight intensity={1.2} color="#0c4a6e" />
          <directionalLight position={[10, 20, 10]} intensity={2.0} color="#38bdf8" />
          <pointLight position={[-10, -10, -10]} intensity={4} color="#a855f7" />
          
          {/* Constant stream of jellyfish within the fixed 100vh viewport */}
          <RisingJellyfish url="/models/jellyfish.glb" scale={5.5} speed={1.2} startOffset={0} xOffset={-5} zOffset={-5} rotationYOffset={0} />
          <RisingJellyfish url="/models/jellyfish1.glb" scale={4.5} speed={1.3} startOffset={5} xOffset={2} zOffset={-3} rotationYOffset={Math.PI / 4} />
          
          {/* Reduced number of fishes, faster speed */}
          <SwimmingFish url="/models/fish.glb" scale={2.5} speed={1.8} startOffset={0} yOffset={2} zOffset={-3} />
          <SwimmingFish url="/models/fish3.glb" scale={3.5} speed={1.4} startOffset={25} yOffset={5} zOffset={-10} />

          {/* Only render one more on non-mobile devices */}
          {!isMobile && (
            <>
              <RisingJellyfish url="/models/jellyfish2.glb" scale={5.0} speed={1.4} startOffset={12} xOffset={4} zOffset={-8} rotationYOffset={Math.PI / 8} />
            </>
          )}
        </Canvas>
      </div>
    </div>
  );
};

// Preload the models
// useGLTF.preload('/models/jellyfish.glb');
// useGLTF.preload('/models/jellyfish1.glb');

export default RealisticGLBJellyfish;
