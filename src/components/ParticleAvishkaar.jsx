import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleAvishkaar = ({ text = "AVISHKAAR" }) => {
    const mountRef = useRef(null);
    const textRef = useRef(text);

    useEffect(() => {
        textRef.current = text;
    }, [text]);

    useEffect(() => {
        let animationFrameId;

        const container = mountRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x020617, 0.005);

        const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
        camera.position.set(0, 0, 120);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
        container.appendChild(renderer.domElement);

        let particles;
        const isMobile = window.innerWidth < 768;
        // 5,000 particles on mobile (80% lower overhead), 20,000 on desktop
        const particleCount = isMobile ? 5000 : 20000;
        let positions, colors, targets, velocities;
        // Base text color glow
        const colorBase = new THREE.Color(0x22d3ee); // Cyan to match the theme perfectly
        const colorActive = new THREE.Color(0xffffff); // Bright white for interaction
        const clock = new THREE.Clock();

        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const mouse3D = new THREE.Vector3(0, 0, 0);
        let isMouseActive = false;
        
        let isVisible = true;
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
        });
        observer.observe(container);

        const onMouseMove = (event) => {
            if (isMobile) return; // Skip raycasting overhead on touch devices
            const rect = container.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            raycaster.ray.intersectPlane(mousePlane, mouse3D);
            isMouseActive = true;
        };
        const onMouseOut = () => { isMouseActive = false; };

        if (!isMobile) {
            window.addEventListener('mousemove', onMouseMove);
            container.addEventListener('mouseleave', onMouseOut);
        }

        const texCanvas = document.createElement('canvas');
        texCanvas.width = 16;
        texCanvas.height = 16;
        const context = texCanvas.getContext('2d');
        const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(13, 214, 245, 1)'); // Cyan core
        gradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.8)'); // Cyan edge
        gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 16, 16);
        const particleTexture = new THREE.CanvasTexture(texCanvas);

        const geometry = new THREE.BufferGeometry();
        positions = new Float32Array(particleCount * 3);
        targets = new Float32Array(particleCount * 3);
        velocities = new Float32Array(particleCount * 3);
        colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            targets[i * 3] = positions[i * 3];
            targets[i * 3 + 1] = positions[i * 3 + 1];
            targets[i * 3 + 2] = positions[i * 3 + 2];
            velocities[i * 3] = 0; velocities[i * 3 + 1] = 0; velocities[i * 3 + 2] = 0;
            colors[i * 3] = colorBase.r; colors[i * 3 + 1] = colorBase.g; colors[i * 3 + 2] = colorBase.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Slightly larger particle size on mobile to maintain bold legibility with fewer points
        const material = new THREE.PointsMaterial({
            size: isMobile ? 2.6 : 1.8,
            vertexColors: true,
            map: particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        const canvas2d = document.createElement('canvas');
        canvas2d.width = 2048;
        canvas2d.height = 512;
        const ctx2d = canvas2d.getContext('2d', { willReadFrequently: true });

        let lastText = "";

        const updateTargets = (newTextStr) => {
            if (!newTextStr || newTextStr.length === 0) {
                for (let i = 0; i < particleCount; i++) {
                    targets[i * 3] = (Math.random() - 0.5) * 100;
                    targets[i * 3 + 1] = (Math.random() - 0.5) * 100;
                    targets[i * 3 + 2] = (Math.random() - 0.5) * 100;
                }
                return;
            }

            ctx2d.clearRect(0, 0, canvas2d.width, canvas2d.height);
            ctx2d.fillStyle = '#2cc5d0ff';

            const width = window.innerWidth;
            let fontSize, scaleFactor, lineWidth, yOffset;

            if (width < 640) {
                fontSize = 175;
                scaleFactor = 0.17;
                lineWidth = 3;
                yOffset = 3;
            } else if (width < 1024) {
                fontSize = 250;
                scaleFactor = 0.22;
                lineWidth = 4;
                yOffset = 5;
            } else {
                fontSize = 260;
                scaleFactor = 0.24;
                lineWidth = 5;
                yOffset = 6;
            }

            ctx2d.font = `1000 ${fontSize}px "Outfit", "Inter", sans-serif`;
            ctx2d.textAlign = 'center';
            ctx2d.textBaseline = 'middle';
            ctx2d.lineJoin = 'round';
            ctx2d.lineWidth = lineWidth;
            ctx2d.strokeStyle = '#FFFFFF';
            ctx2d.strokeText(newTextStr, canvas2d.width / 2, canvas2d.height / 2);
            ctx2d.fillText(newTextStr, canvas2d.width / 2, canvas2d.height / 2);

            const imageData = ctx2d.getImageData(0, 0, canvas2d.width, canvas2d.height).data;
            const validPixels = [];
            const step = isMobile ? 4 : 2;

            for (let y = 0; y < canvas2d.height; y += step) {
                for (let x = 0; x < canvas2d.width; x += step) {
                    const idx = (y * canvas2d.width + x) * 4;
                    if (imageData[idx + 3] > 128) {
                        validPixels.push({
                            x: (x - canvas2d.width / 2) * scaleFactor,
                            y: -(y - canvas2d.height / 2) * scaleFactor + yOffset
                        });
                    }
                }
            }

            if (validPixels.length === 0) return;

            for (let i = 0; i < particleCount; i++) {
                const p = validPixels[Math.floor(Math.random() * validPixels.length)];
                targets[i * 3] = p.x + (Math.random() - 0.5) * 0.3;
                targets[i * 3 + 1] = p.y + (Math.random() - 0.5) * 0.3;
                targets[i * 3 + 2] = (Math.random() - 0.5) * 1;
            }
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (!isVisible || document.body.classList.contains('nav-open')) return;
            const time = clock.getElapsedTime();

            if (textRef.current !== lastText) {
                lastText = textRef.current;
                updateTargets(lastText);
            }

            if (particles) {
                const posAttr = particles.geometry.attributes.position;
                const colAttr = particles.geometry.attributes.color;

                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;

                    let px = posAttr.array[i3];
                    let py = posAttr.array[i3 + 1];
                    let pz = posAttr.array[i3 + 2];

                    let tx = targets[i3];
                    let ty = targets[i3 + 1];
                    let tz = targets[i3 + 2];

                    // [CHANGE HERE]: Text Wave/Float Effect - The amplitude and speed of the text floating
                    // Multiply the Math.sin / Math.cos by a larger number to make the wave bigger (e.g., 1.5 or 2.5)
                    ty += Math.sin(tx * 0.1 + time * 1.5) * 1.2; // Increased from 0.5 to 1.5
                    tz += Math.cos(tx * 0.1 + time * 1.5) * 1.2; // Increased from 0.5 to 1.5

                    let distToMouse = 999;
                    if (isMouseActive) {
                        const dx = px - mouse3D.x;
                        const dy = py - mouse3D.y;
                        const dz = pz - mouse3D.z;
                        distToMouse = Math.sqrt(dx * dx + dy * dy + dz * dz);

                        // [CHANGE HERE]: Text Mouse Interaction - Effect Radius
                        const repelRadius = 20; // increased radius
                        if (distToMouse < repelRadius) {
                            const force = (repelRadius - distToMouse) / repelRadius;
                            // [CHANGE HERE]: Text Mouse Interaction - Explode Force
                            tx += (dx / distToMouse) * force * 45; // increased force
                            ty += (dy / distToMouse) * force * 45;
                            tz += (dz / distToMouse) * force * 45;
                        }
                    }

                    velocities[i3] += (tx - px) * 0.04;
                    velocities[i3 + 1] += (ty - py) * 0.04;
                    velocities[i3 + 2] += (tz - pz) * 0.04;

                    velocities[i3] *= 0.82;
                    velocities[i3 + 1] *= 0.82;
                    velocities[i3 + 2] *= 0.82;

                    posAttr.array[i3] += velocities[i3];
                    posAttr.array[i3 + 1] += velocities[i3 + 1];
                    posAttr.array[i3 + 2] += velocities[i3 + 2];

                    let currentColor = new THREE.Color(colAttr.array[i3], colAttr.array[i3 + 1], colAttr.array[i3 + 2]);
                    let targetColor = distToMouse < 20 ? colorActive : colorBase;

                    currentColor.lerp(targetColor, 0.1);
                    colAttr.array[i3] = currentColor.r;
                    colAttr.array[i3 + 1] = currentColor.g;
                    colAttr.array[i3 + 2] = currentColor.b;
                }

                posAttr.needsUpdate = true;
                colAttr.needsUpdate = true;
            }

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (!container) return;
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
            updateTargets(textRef.current);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (!isMobile) {
                window.removeEventListener('mousemove', onMouseMove);
                container.removeEventListener('mouseleave', onMouseOut);
            }
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
            
            if (container && renderer.domElement && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            scene.clear();
        };
    }, []);

    return (
        <div className="relative z-10 w-full mt-6 -mb-12 h-[150px] md:h-[220px] flex items-center justify-center pointer-events-none">
            <div ref={mountRef} className="w-full h-full cursor-crosshair" />
        </div>
    );
};

export default ParticleAvishkaar;
