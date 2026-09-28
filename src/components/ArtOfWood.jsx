import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

function ringTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#b98a58'; g.fillRect(0, 0, 256, 256);
  for (let r = 128; r > 0; r -= 5) {
    g.beginPath(); g.arc(128 + Math.sin(r) * 2, 128 + Math.cos(r * 1.3) * 2, r, 0, Math.PI * 2);
    g.strokeStyle = r % 10 === 0 ? 'rgba(80,44,20,.55)' : 'rgba(120,70,36,.3)'; g.lineWidth = 1.4; g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function Scene({ progress }) {
  const wood = useLoader(THREE.TextureLoader, '/img/wood-3d.webp');
  const rings = useMemo(ringTexture, []);
  const root = useRef(), log = useRef(), planks = useRef(), table = useRef(), chairs = useRef(), tableMat = useRef();
  useMemo(() => { wood.wrapS = wood.wrapT = THREE.RepeatWrapping; wood.colorSpace = THREE.SRGBColorSpace; wood.anisotropy = 4; }, [wood]);

  const raw = new THREE.Color('#efe1cb'), fin = new THREE.Color('#d8b48a');
  useFrame((state) => {
    const p = progress.current, s = p * 4, t = state.clock.elapsedTime;
    root.current.rotation.y = t * 0.18 + p * 1.6;
    const w0 = 1 - sm(0.7, 1.1, s);
    log.current.scale.setScalar(Math.max(0.001, w0)); log.current.visible = w0 > 0.01;
    const w1 = sm(0.7, 1.1, s) * (1 - sm(1.8, 2.2, s));
    planks.current.scale.setScalar(Math.max(0.001, w1)); planks.current.visible = w1 > 0.01;
    planks.current.children.forEach((m, i) => { m.position.y = (i - 2) * (0.12 + 0.32 * (1 - sm(1.0, 2.0, s))); });
    const w2 = sm(1.8, 2.3, s);
    table.current.scale.setScalar(Math.max(0.001, w2)); table.current.visible = w2 > 0.01;
    const f = sm(2.4, 3.2, s);
    if (tableMat.current) { tableMat.current.color.copy(raw).lerp(fin, f); tableMat.current.roughness = 0.95 - 0.6 * f; tableMat.current.metalness = 0.02 + 0.06 * f; }
    const w4 = sm(3.3, 3.9, s);
    chairs.current.scale.setScalar(Math.max(0.001, w4)); chairs.current.visible = w4 > 0.01;
  });

  const mat = (c = '#efe1cb', r = 0.9) => <meshStandardMaterial map={wood} color={c} roughness={r} />;
  const Chair = ({ x, z, ry }) => (
    <group position={[x, 0, z]} rotation={[0, ry, 0]}>
      <mesh position={[0, 0.45, 0]} castShadow><boxGeometry args={[0.55, 0.07, 0.55]} />{mat('#d8b48a', 0.4)}</mesh>
      <mesh position={[0, 0.85, -0.25]} castShadow><boxGeometry args={[0.55, 0.7, 0.06]} />{mat('#d8b48a', 0.4)}</mesh>
      {[[-0.23, -0.23], [0.23, -0.23], [-0.23, 0.23], [0.23, 0.23]].map(([a, b], i) => <mesh key={i} position={[a, 0.22, b]} castShadow><boxGeometry args={[0.06, 0.44, 0.06]} />{mat('#c39a6c', 0.45)}</mesh>)}
    </group>
  );

  return (
    <>
      <ambientLight intensity={0.55} color="#fff1dc" />
      <directionalLight position={[3.5, 5, 3]} intensity={2.2} color="#fff0d6" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} />
      <pointLight position={[-3, 1.5, -2]} intensity={12} color="#c9a45c" />
      <group ref={root} position={[0, -0.35, 0]}>
        <group ref={log}>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.85, 0.85, 2.6, 48]} />
            <meshStandardMaterial attach="material-0" map={wood} color="#b98a58" roughness={1} />
            <meshStandardMaterial attach="material-1" map={rings} roughness={0.9} />
            <meshStandardMaterial attach="material-2" map={rings} roughness={0.9} />
          </mesh>
        </group>
        <group ref={planks} position={[0, 0.95, 0]}>
          {[0, 1, 2, 3, 4].map((i) => <mesh key={i} castShadow><boxGeometry args={[2.6, 0.12, 1.1 - (i % 2) * 0.12]} />{mat('#eadbc2', 0.95)}</mesh>)}
        </group>
        <group ref={table}>
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow><boxGeometry args={[2.3, 0.14, 1.2]} /><meshStandardMaterial ref={tableMat} map={wood} color="#e8c9a0" roughness={0.9} /></mesh>
          {[[-1, -0.5], [1, -0.5], [-1, 0.5], [1, 0.5]].map(([a, b], i) => <mesh key={i} position={[a * 0.95, 0.42, b * 0.45]} castShadow><boxGeometry args={[0.13, 0.84, 0.13]} />{mat('#d9bd97', 0.7)}</mesh>)}
          <mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[1.8, 0.07, 0.09]} />{mat('#d9bd97', 0.7)}</mesh>
        </group>
        <group ref={chairs}>
          <Chair x={-0.5} z={0.95} ry={Math.PI} /><Chair x={0.5} z={-0.95} ry={0} />
          <mesh position={[0.7, 1.13, 0.1]} castShadow><cylinderGeometry args={[0.09, 0.12, 0.3, 24]} /><meshStandardMaterial color="#efe6d4" roughness={0.5} /></mesh>
        </group>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.36, 0]} receiveShadow><planeGeometry args={[14, 14]} /><shadowMaterial opacity={0.4} /></mesh>
    </>
  );
}

export default function ArtOfWood({ progress }) {
  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [3.6, 2.5, 5.0], fov: 34 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} onCreated={({ camera }) => camera.lookAt(0, 0.5, 0)}>
      <Suspense fallback={null}><Scene progress={progress} /></Suspense>
    </Canvas>
  );
}
