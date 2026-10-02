import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useDeviceCapability } from '@/hooks/use-device-capability';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Bubble trail particles in 3D
const BubbleTrail = ({ turtlePos }) => {
  const count = 24;
  const meshRef = useRef();
  const bubbles = useRef(
    Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(0, -100, 0),
      vel: new THREE.Vector3(0, 0, 0),
      life: 0,
      maxLife: 0,
      size: 0,
    }))
  );
  const spawnTimer = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (document.body.classList.contains('nav-open')) return;
    if (!meshRef.current) return;
    spawnTimer.current += delta;
    if (spawnTimer.current > 0.12) {
      spawnTimer.current = 0;
      const b = bubbles.current.find((b) => b.life <= 0);
      if (b) {
        b.pos.set(
          turtlePos.current.x + (Math.random() - 0.5) * 0.4,
          turtlePos.current.y + (Math.random() - 0.5) * 0.3,
          turtlePos.current.z + (Math.random() - 0.5) * 0.4
        );
        b.vel.set((Math.random() - 0.5) * 0.3, 0.3 + Math.random() * 0.5, (Math.random() - 0.5) * 0.3);
        b.maxLife = 1.5 + Math.random() * 2;
        b.life = b.maxLife;
        b.size = 0.02 + Math.random() * 0.05;
      }
    }
    bubbles.current.forEach((b, i) => {
      if (b.life > 0) {
        b.life -= delta;
        b.pos.add(b.vel.clone().multiplyScalar(delta));
        b.vel.y += delta * 0.1;
        const scale = b.size * (b.life / b.maxLife);
        dummy.position.copy(b.pos);
        dummy.scale.setScalar(scale);
      } else {
        dummy.scale.setScalar(0);
        dummy.position.set(0, -100, 0);
      }
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#22d3ee" transparent opacity={0.5} emissive="#22d3ee" emissiveIntensity={0.3} />
    </instancedMesh>
  );
};

// The 3D Turtle model with full playful behavior
const TurtleModel = ({ scrollProgress, mousePos }) => {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/turtle.glb');
  const mixer = useRef(null);
  const turtlePos = useRef(new THREE.Vector3(0, 0, 5));
  const prevScroll = useRef(0);
  const scrollSpeed = useRef(0);
  const swimTime = useRef(0);
  const totalRotation = useRef(0);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = child.material.clone();
        child.material.envMapIntensity = 1.5;
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    if (animations && animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(clonedScene);
      animations.forEach((clip) => {
        const action = mixer.current.clipAction(clip);
        action.play();
        action.setLoop(THREE.LoopRepeat);
      });
    }
    return () => { if (mixer.current) mixer.current.stopAllAction(); };
  }, [animations, clonedScene]);

  useFrame((state, delta) => {
    if (document.body.classList.contains('nav-open')) return;
    if (!group.current || document.body.classList.contains('nav-open')) return;

    // Animation mixer
    if (mixer.current) {
      const animSpeed = 1 + Math.abs(scrollSpeed.current) * 4;
      mixer.current.update(delta * animSpeed);
    }

    const sp = scrollProgress.current;
    scrollSpeed.current = THREE.MathUtils.lerp(scrollSpeed.current, (sp - prevScroll.current) * 60, 0.1);
    prevScroll.current = sp;
    swimTime.current += delta;

    const t = sp; // 0 = top, 1 = bottom

    // === SCALE: starts at 0, grows to full size by 10% scroll, larger at footer ===
    let targetScale;
    if (t < 0.1) {
      // Hero: scale from 0 to 1.5
      targetScale = THREE.MathUtils.smoothstep(t, 0, 0.1) * 1.5;
    } else if (t > 0.88) {
      // Footer: grow bigger (up to 2.5)
      const footerT = THREE.MathUtils.smoothstep(t, 0.88, 1.0);
      targetScale = 1.5 + footerT * 1.0;
    } else {
      targetScale = 1.5;
    }
    const currentScale = THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.06);
    group.current.scale.setScalar(currentScale);

    // === POSITION: turtle follows the cursor ===
    let targetX, targetY, targetZ;

    // Convert mouse position (-1 to 1) to 3D world coordinates
    // Multipliers reduced heavily so the turtle stays far away from the edges
    const cursorX = mousePos.current.x * 2.5; 
    const cursorY = mousePos.current.y * -1.5; 

    if (t <= 0.05) {
      // Start at center of hero, begin following cursor
      const heroT = THREE.MathUtils.smoothstep(t, 0, 0.05);
      targetX = THREE.MathUtils.lerp(0, cursorX, heroT);
      targetY = THREE.MathUtils.lerp(0, cursorY, heroT);
      targetZ = 4;
    } else if (t > 0.88) {
      // Footer: continue following cursor but move slightly closer to camera
      const footerT = THREE.MathUtils.smoothstep(t, 0.88, 1.0);
      targetX = cursorX + Math.sin(swimTime.current * 0.8) * 0.5;
      targetY = cursorY + Math.sin(swimTime.current * 1.2) * 0.3;
      targetZ = THREE.MathUtils.lerp(4, 3, footerT);
    } else {
      // Main journey: follow cursor with playful offset
      const journeyT = (t - 0.05) / 0.83;
      
      // Follow cursor with gentle swimming offset
      targetX = cursorX + Math.sin(swimTime.current * 0.8) * 0.5;
      targetY = cursorY + Math.sin(swimTime.current * 1.2) * 0.3 + Math.cos(journeyT * Math.PI * 2) * 0.4;
      targetZ = 4 + Math.sin(journeyT * Math.PI * 3) * 1.5;
    }

    // Smooth interpolation - slightly delayed to feel organic/alive
    const lerpSpeed = t > 0.88 ? 0.02 : 0.045;
    turtlePos.current.x = THREE.MathUtils.lerp(turtlePos.current.x, targetX, lerpSpeed);
    turtlePos.current.y = THREE.MathUtils.lerp(turtlePos.current.y, targetY, lerpSpeed);
    turtlePos.current.z = THREE.MathUtils.lerp(turtlePos.current.z, targetZ, lerpSpeed);
    group.current.position.copy(turtlePos.current);

    // === ROTATION: full 360° playful rotation showing all sides ===
    if (t > 0.88) {
      // Footer: slow settling rotation, face the user
      const footerT = THREE.MathUtils.smoothstep(t, 0.88, 1.0);
      totalRotation.current = THREE.MathUtils.lerp(totalRotation.current, Math.PI * 0.1, 0.02);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, totalRotation.current, 0.03);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.1, 0.03);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.03);
    } else {
      // Face toward cursor movement direction + 360° rotation from scrolling
      const dx = targetX - turtlePos.current.x;
      const dy = targetY - turtlePos.current.y;
      
      // Y rotation: face cursor direction + continuous spin from scroll
      // Y rotation: face cursor direction
      const cursorAngle = Math.atan2(dx, 1); // heading toward cursor
      totalRotation.current = cursorAngle;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, totalRotation.current, 0.04);

      // X rotation: tilt toward cursor vertically
      const pitchToward = dy * 0.3 + scrollSpeed.current * 0.4 + Math.sin(swimTime.current * 2) * 0.06;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pitchToward, 0.04);

      // Z rotation: bank into turns
      const bankAngle = -dx * 0.15 + Math.cos(swimTime.current * 1.5) * 0.1;
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, bankAngle, 0.04);
    }
  });

  return (
    <group>
      <primitive ref={group} object={clonedScene} scale={0.01} />
      <BubbleTrail turtlePos={turtlePos} />
    </group>
  );
};

const UnderwaterAtmosphere = () => (
  <>
    <ambientLight intensity={0.4} color="#0891b2" />
    <directionalLight position={[5, 10, 5]} intensity={0.9} color="#22d3ee" />
    <pointLight position={[-3, 5, 2]} intensity={0.5} color="#06b6d4" distance={20} />
    <pointLight position={[3, -2, -3]} intensity={0.3} color="#0e7490" distance={15} />
    <spotLight position={[0, 15, 0]} angle={0.4} penumbra={1} intensity={0.6} color="#22d3ee" />
    <fog attach="fog" args={['#011627', 8, 30]} />
  </>
);

const TurtleCanvas = ({ scrollProgress, mousePos }) => (
  <Canvas
    camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 100 }}
    gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true }}
    dpr={[1, 1]}
    frameloop="always"
    style={{ background: 'transparent' }}
  >
    <UnderwaterAtmosphere />
    <Suspense fallback={null}>
      <TurtleModel scrollProgress={scrollProgress} mousePos={mousePos} />
      <Environment preset="night" />
    </Suspense>
  </Canvas>
);

const ScrollTurtle3D = () => {
  const { isMobile, isLowEnd, ready } = useDeviceCapability();
  const scrollProgress = useRef(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Disable heavy 3D canvas and event listeners completely on mobile / low-end
    if (!ready || isMobile || isLowEnd) return;

    const timer = setTimeout(() => setVisible(true), 800);

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.current = docHeight > 0 ? scrollTop / docHeight : 0;
        ticking = false;
      });
    };

    let mouseTicking = false;
    const handleMouseMove = (e) => {
      if (mouseTicking) return;
      mouseTicking = true;
      requestAnimationFrame(() => {
        mousePos.current = {
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        };
        mouseTicking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ready, isMobile, isLowEnd]);

  if (!ready || isMobile || isLowEnd || !visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      <TurtleCanvas scrollProgress={scrollProgress} mousePos={mousePos} />
    </div>
  );
};

// useGLTF.preload('/models/turtle.glb');
export default ScrollTurtle3D;
