'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LoaderScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.6, 7.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio <= 1.25,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.45));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.position.set(1.18, -0.12, 0);
    scene.add(root);

    const accent = new THREE.Color('#5eead4');
    const blue = new THREE.Color('#38bdf8');
    const rose = new THREE.Color('#fb7185');

    scene.add(new THREE.AmbientLight(0x9ff8ff, 0.48));

    const key = new THREE.PointLight(0x5eead4, 24, 18);
    key.position.set(-3, 3, 4);
    scene.add(key);

    const rim = new THREE.PointLight(0xfb7185, 10, 16);
    rim.position.set(4, -2, 3);
    scene.add(rim);

    const chipMat = new THREE.MeshStandardMaterial({
      color: '#071417',
      metalness: 0.8,
      roughness: 0.26,
      emissive: '#082b2f',
      emissiveIntensity: 0.35,
    });
    const lineMat = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.66 });
    const roseMat = new THREE.MeshBasicMaterial({ color: rose, transparent: true, opacity: 0.72 });
    const blueMat = new THREE.MeshBasicMaterial({ color: blue, transparent: true, opacity: 0.42 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: '#bffff7',
      transparent: true,
      opacity: 0.18,
      metalness: 0.1,
      roughness: 0.08,
      emissive: '#5eead4',
      emissiveIntensity: 0.42,
    });

    const chip = new THREE.Mesh(new THREE.BoxGeometry(2.45, 1.42, 0.18), chipMat);
    root.add(chip);

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.54, 2), glassMat);
    core.position.z = 0.32;
    root.add(core);

    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.011, 8, 112), lineMat);
    ringA.rotation.x = Math.PI / 2;
    root.add(ringA);

    const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.68, 0.008, 8, 128), blueMat);
    ringB.rotation.x = Math.PI / 2.2;
    ringB.rotation.y = 0.45;
    root.add(ringB);

    const ringC = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.009, 8, 96), roseMat);
    ringC.rotation.x = Math.PI / 2.8;
    ringC.rotation.y = -0.8;
    root.add(ringC);

    const pinGeo = new THREE.BoxGeometry(0.035, 0.22, 0.035);
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 14; i += 1) {
        const pin = new THREE.Mesh(pinGeo, i % 3 === 0 ? roseMat : lineMat);
        pin.position.set(-1.12 + i * 0.172, side * 0.82, 0.02);
        root.add(pin);
      }
    }

    const traceGeo = new THREE.BufferGeometry();
    const tracePoints: number[] = [];
    for (let i = 0; i < 72; i += 1) {
      const t = i / 71;
      const x = -4.8 + t * 9.6;
      const y = Math.sin(t * Math.PI * 4) * 0.38 - 1.9;
      tracePoints.push(x, y, -1.2);
    }
    traceGeo.setAttribute('position', new THREE.Float32BufferAttribute(tracePoints, 3));
    const trace = new THREE.Line(traceGeo, new THREE.LineBasicMaterial({ color: '#5eead4', transparent: true, opacity: 0.28 }));
    scene.add(trace);

    const stars = new THREE.BufferGeometry();
    const starCount = window.innerWidth < 700 ? 90 : 160;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      starPositions[i * 3] = (Math.random() - 0.5) * 12;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      starPositions[i * 3 + 2] = -2 - Math.random() * 5;
    }
    stars.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starField = new THREE.Points(
      stars,
      new THREE.PointsMaterial({ color: '#b7fff5', size: 0.018, transparent: true, opacity: 0.58 })
    );
    scene.add(starField);

    const pointer = { x: 0, y: 0 };
    const handlePointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.45));
      renderer.setSize(window.innerWidth, window.innerHeight);
      root.position.x = window.innerWidth < 980 ? 0.82 : 1.18;
      root.scale.setScalar(window.innerWidth < 700 ? 0.72 : 1);
    };

    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('resize', handleResize);
    handleResize();

    let raf = 0;
    const clock = new THREE.Clock();
    const render = () => {
      const elapsed = clock.getElapsedTime();

      if (!document.hidden) {
        if (!reducedMotion) {
          root.rotation.y += ((pointer.x * 0.28) - root.rotation.y) * 0.035;
          root.rotation.x += ((-pointer.y * 0.16) - root.rotation.x) * 0.035;
          core.rotation.x = elapsed * 0.42;
          core.rotation.y = elapsed * 0.58;
          ringA.rotation.z = elapsed * 0.22;
          ringB.rotation.z = -elapsed * 0.16;
          ringC.rotation.z = elapsed * 0.3;
          starField.rotation.y = elapsed * 0.015;
        }

        renderer.render(scene, camera);
      }

      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      chip.geometry.dispose();
      core.geometry.dispose();
      ringA.geometry.dispose();
      ringB.geometry.dispose();
      ringC.geometry.dispose();
      pinGeo.dispose();
      traceGeo.dispose();
      stars.dispose();
      chipMat.dispose();
      lineMat.dispose();
      roseMat.dispose();
      blueMat.dispose();
      glassMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-0 bg-[#030607]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,6,7,0.98)_0%,rgba(3,6,7,0.74)_38%,rgba(3,6,7,0.18)_100%)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(94,234,212,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(94,234,212,0.12)_1px,transparent_1px)] [background-size:64px_64px]" />
    </div>
  );
}
