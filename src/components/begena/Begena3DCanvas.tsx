import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BEGENA_PARTS, CAMERA_PRESETS } from '../../data/begenaExplorerData';
import { begenaAudio } from './BegenaAudioEngine';

interface Begena3DCanvasProps {
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  activePresetId?: string;
  isAutoRotate?: boolean;
}

// Procedural textures generator
function createBegenaTexture(type: 'front_parchment' | 'rear_parchment' | 'side_wood' | 'top_deck' | 'burgundy_wood' | 'blonde_wood' | 'inzira_leather'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (type === 'front_parchment') {
      // Natural blonde/honey wood veneer with subtle vertical grain (matching reference photo)
      const grad = ctx.createLinearGradient(0, 0, 0, 1024);
      grad.addColorStop(0, '#e5c494');
      grad.addColorStop(0.35, '#d9b27e');
      grad.addColorStop(0.7, '#cba069');
      grad.addColorStop(1, '#be8f55');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Vertical wood grain lines
      ctx.fillStyle = 'rgba(110, 65, 25, 0.07)';
      for (let i = 0; i < 220; i++) {
        const x = Math.random() * 1024;
        const w = Math.random() * 3 + 1;
        ctx.fillRect(x, 0, w, 1024);
      }

      // Fine wood pores & subtle variations
      ctx.fillStyle = 'rgba(255, 235, 195, 0.12)';
      for (let i = 0; i < 80; i++) {
        const x = Math.random() * 1024;
        const w = Math.random() * 4 + 2;
        ctx.fillRect(x, 0, w, 1024);
      }

      // 4 diagonal corner tension lines (clearly visible in reference photo)
      ctx.strokeStyle = 'rgba(95, 50, 18, 0.38)';
      ctx.lineWidth = 4;
      const cornerLen = 135;
      // Top-left
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(cornerLen, cornerLen); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(1024, 0); ctx.lineTo(1024 - cornerLen, cornerLen); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(0, 1024); ctx.lineTo(cornerLen, 1024 - cornerLen); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(1024, 1024); ctx.lineTo(1024 - cornerLen, 1024 - cornerLen); ctx.stroke();

      // Subtle perimeter border line
      ctx.strokeStyle = 'rgba(100, 52, 18, 0.45)';
      ctx.lineWidth = 10;
      ctx.strokeRect(8, 8, 1008, 1008);
    } else if (type === 'rear_parchment') {
      // Golden yellow skin for back with diagonal tension seams and central medallion (Image 2 & 3)
      const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 650);
      grad.addColorStop(0, '#f2b52d');
      grad.addColorStop(0.7, '#d38612');
      grad.addColorStop(1, '#984007');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // 4 diagonal tension seams radiating from 4 corners to center
      ctx.strokeStyle = 'rgba(90, 35, 8, 0.65)';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(512, 512);
      ctx.moveTo(1024, 0); ctx.lineTo(512, 512);
      ctx.moveTo(0, 1024); ctx.lineTo(512, 512);
      ctx.moveTo(1024, 1024); ctx.lineTo(512, 512);
      ctx.stroke();

      // Tension stitch marks along seams
      ctx.strokeStyle = 'rgba(255, 245, 210, 0.85)';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 14]);
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(512, 512);
      ctx.moveTo(1024, 0); ctx.lineTo(512, 512);
      ctx.moveTo(0, 1024); ctx.lineTo(512, 512);
      ctx.moveTo(1024, 1024); ctx.lineTo(512, 512);
      ctx.stroke();
      ctx.setLineDash([]);

      // Central circular medallion with cross (Image 2 & 3)
      ctx.fillStyle = '#4e1219';
      ctx.beginPath();
      ctx.arc(512, 512, 140, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#2d070b';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Embossed cream Ethiopian Orthodox Cross inside the medallion
      ctx.fillStyle = '#f8ebd1';
      const cx = 512;
      const cy = 512;
      const w = 24;
      const h = 135;
      ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
      ctx.fillRect(cx - h / 2.8, cy - w / 2, h / 1.4, w);
      // Stepped arm ends
      ctx.fillRect(cx - w, cy - h / 2 - 8, w * 2, 8);
      ctx.fillRect(cx - w, cy + h / 2, w * 2, 8);
      ctx.fillRect(cx - h / 2.8 - 8, cy - w, 8, w * 2);
      ctx.fillRect(cx + h / 2.8, cy - w, 8, w * 2);
    } else if (type === 'side_wood') {
      // Warm blonde wood / parchment for the tapered sides
      const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
      grad.addColorStop(0, '#e8a928');
      grad.addColorStop(0.5, '#d38c1a');
      grad.addColorStop(1, '#a3500c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Fine wood streaks
      ctx.fillStyle = 'rgba(120, 60, 15, 0.15)';
      for (let i = 0; i < 90; i++) {
        ctx.fillRect(0, Math.random() * 1024, 1024, Math.random() * 3 + 1);
      }
    } else if (type === 'top_deck') {
      // Top slanted deck wood/parchment
      const grad = ctx.createLinearGradient(0, 0, 0, 1024);
      grad.addColorStop(0, '#d99420');
      grad.addColorStop(0.6, '#b86d14');
      grad.addColorStop(1, '#4e141a'); // blends into dark wood at the back
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);
    } else if (type === 'burgundy_wood') {
      // Warm reddish-brown African mahogany / cedar (matching reference photo)
      const grad = ctx.createLinearGradient(0, 0, 1024, 0);
      grad.addColorStop(0, '#542218');
      grad.addColorStop(0.5, '#763425');
      grad.addColorStop(1, '#471911');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      ctx.fillStyle = 'rgba(30, 10, 6, 0.35)';
      for (let i = 0; i < 200; i++) {
        ctx.fillRect(0, Math.random() * 1024, 1024, Math.random() * 3 + 1);
      }
      ctx.fillStyle = 'rgba(150, 75, 50, 0.18)';
      for (let i = 0; i < 90; i++) {
        ctx.fillRect(0, Math.random() * 1024, 1024, Math.random() * 2 + 1);
      }
    } else if (type === 'blonde_wood') {
      // Blonde pine for bridge and pegs
      const grad = ctx.createLinearGradient(0, 0, 1024, 0);
      grad.addColorStop(0, '#e5cca3');
      grad.addColorStop(0.5, '#f3deb9');
      grad.addColorStop(1, '#dcbe95');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      ctx.fillStyle = 'rgba(130, 85, 40, 0.16)';
      for (let i = 0; i < 100; i++) {
        ctx.fillRect(0, Math.random() * 1024, 1024, Math.random() * 2 + 1);
      }
    } else {
      // Inzira leather buffer
      ctx.fillStyle = '#baa07b';
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.fillStyle = 'rgba(80, 50, 20, 0.2)';
      for (let i = 0; i < 120; i++) {
        ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 16, 16);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Generate watertight solid truncated-pyramid soundbox geometry matching Image 2 exactly
function createWatertightSoundboxGeometry(
  wFront: number = 3.3,
  hFront: number = 3.6,
  zFront: number = 0.35,
  yBottomFront: number = -2.6,
  wBack: number = 1.7,
  hBack: number = 1.9,
  zBack: number = -1.35,
  yBottomBack: number = -2.05
): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();

  const hwF = wFront / 2;
  const hwB = wBack / 2;
  const yTopFront = yBottomFront + hFront;
  const yTopBack = yBottomBack + hBack;

  // 8 Corner Vertices
  const v0 = [-hwF, yBottomFront, zFront]; // front bottom-left
  const v1 = [hwF, yBottomFront, zFront];  // front bottom-right
  const v2 = [hwF, yTopFront, zFront];     // front top-right
  const v3 = [-hwF, yTopFront, zFront];    // front top-left

  const v4 = [-hwB, yBottomBack, zBack];   // back bottom-left
  const v5 = [hwB, yBottomBack, zBack];    // back bottom-right
  const v6 = [hwB, yTopBack, zBack];       // back top-right
  const v7 = [-hwB, yTopBack, zBack];      // back top-left

  // 6 Quads (12 Triangles), 36 vertices total
  const positions: number[] = [
    // 1. FRONT FACE (Group 0)
    ...v0, ...v1, ...v2,  ...v0, ...v2, ...v3,
    // 2. BACK FACE (Group 1)
    ...v5, ...v4, ...v7,  ...v5, ...v7, ...v6,
    // 3. TOP DECK (Group 2)
    ...v3, ...v2, ...v6,  ...v3, ...v6, ...v7,
    // 4. BOTTOM FACE (Group 3)
    ...v4, ...v5, ...v1,  ...v4, ...v1, ...v0,
    // 5. LEFT SIDE (Group 4)
    ...v4, ...v0, ...v3,  ...v4, ...v3, ...v7,
    // 6. RIGHT SIDE (Group 5)
    ...v1, ...v5, ...v6,  ...v1, ...v6, ...v2
  ];

  const uvs: number[] = [
    // Front
    0, 0,  1, 0,  1, 1,   0, 0,  1, 1,  0, 1,
    // Back
    0, 0,  1, 0,  1, 1,   0, 0,  1, 1,  0, 1,
    // Top
    0, 0,  1, 0,  1, 1,   0, 0,  1, 1,  0, 1,
    // Bottom
    0, 0,  1, 0,  1, 1,   0, 0,  1, 1,  0, 1,
    // Left
    0, 0,  1, 0,  1, 1,   0, 0,  1, 1,  0, 1,
    // Right
    0, 0,  1, 0,  1, 1,   0, 0,  1, 1,  0, 1
  ];

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

  // Multi-material groups: 6 vertices per face
  geom.addGroup(0, 6, 0);   // Front (front_parchment)
  geom.addGroup(6, 6, 1);   // Back (rear_parchment)
  geom.addGroup(12, 6, 2);  // Top (top_deck)
  geom.addGroup(18, 6, 3);  // Bottom (side_wood)
  geom.addGroup(24, 6, 4);  // Left (side_wood)
  geom.addGroup(30, 6, 5);  // Right (side_wood)

  geom.computeVertexNormals();
  return geom;
}

// Generate the authentic cable-twist / rope-braid fluted column geometry (matching reference photo)
function createBarleyTwistPillarGeometry(
  height: number = 6.8,
  coreRadius: number = 0.22,
  twistAmplitude: number = 0.095,
  rotations: number = 5.8,
  heightSegments: number = 180,
  radialSegments: number = 48
): THREE.BufferGeometry {
  const geom = new THREE.CylinderGeometry(
    coreRadius,
    coreRadius * 1.08,
    height,
    radialSegments,
    heightSegments,
    false
  );

  const pos = geom.attributes.position;
  const halfH = height / 2;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const angle = Math.atan2(z, x);
    const baseR = Math.sqrt(x * x + z * z);

    const yRatio = (y + halfH) / height;
    const twistAngle = yRatio * Math.PI * 2 * rotations;

    // Double-helix angle
    const phi = 2 * (angle - twistAngle);
    const cosPhi = Math.cos(phi);

    // Sculpted concave-groove / sharp-ridge fluting (matching reference photo)
    // Uses sharpened harmonic profile: sharp helical ridge crest and deep concave hollow
    const flute = Math.sign(cosPhi) * Math.pow(Math.abs(cosPhi), 0.72);

    // Smooth transition at the bottom (seats into soundbox deck) and top (seats into cap block)
    let blend = 1.0;
    if (yRatio < 0.05) {
      blend = Math.max(0, yRatio / 0.05);
    } else if (yRatio > 0.95) {
      blend = Math.max(0, (1 - yRatio) / 0.05);
    }

    const rMod = baseR + flute * twistAmplitude * blend;

    pos.setX(i, Math.cos(angle) * rMod);
    pos.setZ(i, Math.sin(angle) * rMod);
  }

  geom.computeVertexNormals();
  return geom;
}

// Generate the authentic 3D Ethiopian Lalibela-style stepped cross finial (matching reference photo)
function createAuthenticLalibelaCrossGroup(woodMat: THREE.Material): THREE.Group {
  const group = new THREE.Group();
  const u = 0.10;

  // 1. Outer stepped cross silhouette with integral neck
  const shape = new THREE.Shape();

  // Neck bottom (rests on cap block)
  shape.moveTo(-u * 0.9, -u * 7.0);
  shape.lineTo(u * 0.9, -u * 7.0);
  shape.lineTo(u * 0.9, -u * 4.8);

  // Bottom-right quadrant steps leading to right arm
  shape.lineTo(u * 1.8, -u * 4.8);
  shape.lineTo(u * 1.8, -u * 3.6);
  shape.lineTo(u * 2.8, -u * 3.6);
  shape.lineTo(u * 2.8, -u * 2.2);
  shape.lineTo(u * 3.8, -u * 2.2);
  shape.lineTo(u * 3.8, -u * 1.0);
  shape.lineTo(u * 4.8, -u * 1.0);

  // Right arm tip (stepped diamond)
  shape.lineTo(u * 6.0, 0); // Rightmost diamond point
  shape.lineTo(u * 4.8, u * 1.0);
  shape.lineTo(u * 3.8, u * 1.0);
  shape.lineTo(u * 3.8, u * 2.2);

  // Top-right notch between right and top arms
  shape.lineTo(u * 2.8, u * 2.2);
  shape.lineTo(u * 2.8, u * 3.6);
  shape.lineTo(u * 1.8, u * 3.6);
  shape.lineTo(u * 1.8, u * 4.8);
  shape.lineTo(u * 1.0, u * 4.8);

  // Top arm tip (stepped diamond)
  shape.lineTo(0, u * 6.0); // Topmost diamond point
  shape.lineTo(-u * 1.0, u * 4.8);
  shape.lineTo(-u * 1.8, u * 4.8);

  // Top-left notch between top and left arms
  shape.lineTo(-u * 1.8, u * 3.6);
  shape.lineTo(-u * 2.8, u * 3.6);
  shape.lineTo(-u * 2.8, u * 2.2);
  shape.lineTo(-u * 3.8, u * 2.2);
  shape.lineTo(-u * 3.8, u * 1.0);
  shape.lineTo(-u * 4.8, u * 1.0);

  // Left arm tip (stepped diamond)
  shape.lineTo(-u * 6.0, 0); // Leftmost diamond point
  shape.lineTo(-u * 4.8, -u * 1.0);
  shape.lineTo(-u * 3.8, -u * 1.0);
  shape.lineTo(-u * 3.8, -u * 2.2);

  // Bottom-left notch
  shape.lineTo(-u * 2.8, -u * 2.2);
  shape.lineTo(-u * 2.8, -u * 3.6);
  shape.lineTo(-u * 1.8, -u * 3.6);
  shape.lineTo(-u * 1.8, -u * 4.8);
  shape.lineTo(-u * 0.9, -u * 4.8);
  shape.closePath();

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.10,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.018,
    bevelThickness: 0.018
  };

  const mainGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  mainGeo.center();
  const mainMesh = new THREE.Mesh(mainGeo, woodMat);
  mainMesh.castShadow = true;
  group.add(mainMesh);

  // 2. Concentric stepped face relief (front and back) matching the carved channels in photo
  const innerShape = new THREE.Shape();
  const iu = u * 0.74;
  innerShape.moveTo(0, iu * 5.2);
  innerShape.lineTo(iu * 1.2, iu * 4.0);
  innerShape.lineTo(iu * 2.2, iu * 4.0);
  innerShape.lineTo(iu * 2.2, iu * 2.6);
  innerShape.lineTo(iu * 3.4, iu * 2.6);
  innerShape.lineTo(iu * 3.4, iu * 1.2);
  innerShape.lineTo(iu * 5.2, 0);
  innerShape.lineTo(iu * 3.4, -iu * 1.2);
  innerShape.lineTo(iu * 3.4, -iu * 2.6);
  innerShape.lineTo(iu * 2.2, -iu * 2.6);
  innerShape.lineTo(iu * 2.2, -iu * 4.0);
  innerShape.lineTo(iu * 1.2, -iu * 4.0);
  innerShape.lineTo(0, -iu * 5.2);
  innerShape.lineTo(-iu * 1.2, -iu * 4.0);
  innerShape.lineTo(-iu * 2.2, -iu * 4.0);
  innerShape.lineTo(-iu * 2.2, -iu * 2.6);
  innerShape.lineTo(-iu * 3.4, -iu * 2.6);
  innerShape.lineTo(-iu * 3.4, -iu * 1.2);
  innerShape.lineTo(-iu * 5.2, 0);
  innerShape.lineTo(-iu * 3.4, iu * 1.2);
  innerShape.lineTo(-iu * 3.4, iu * 2.6);
  innerShape.lineTo(-iu * 2.2, iu * 2.6);
  innerShape.lineTo(-iu * 2.2, iu * 4.0);
  innerShape.lineTo(-iu * 1.2, iu * 4.0);
  innerShape.closePath();

  const innerExtrude: THREE.ExtrudeGeometryOptions = {
    depth: 0.02,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.012,
    bevelThickness: 0.012
  };
  const innerGeo = new THREE.ExtrudeGeometry(innerShape, innerExtrude);
  innerGeo.center();

  // Central diamond boss
  const diamondShape = new THREE.Shape();
  const cu = 0.22;
  diamondShape.moveTo(0, cu);
  diamondShape.lineTo(cu, 0);
  diamondShape.lineTo(0, -cu);
  diamondShape.lineTo(-cu, 0);
  diamondShape.closePath();

  const diamondExtrude: THREE.ExtrudeGeometryOptions = {
    depth: 0.025,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.012,
    bevelThickness: 0.012
  };
  const diamondGeo = new THREE.ExtrudeGeometry(diamondShape, diamondExtrude);
  diamondGeo.center();

  // Front face relief
  const frontInner = new THREE.Mesh(innerGeo, woodMat);
  frontInner.position.set(0, 0.08, 0.052);
  group.add(frontInner);

  const frontDiamond = new THREE.Mesh(diamondGeo, woodMat);
  frontDiamond.position.set(0, 0.08, 0.065);
  group.add(frontDiamond);

  // Back face relief
  const backInner = new THREE.Mesh(innerGeo, woodMat);
  backInner.position.set(0, 0.08, -0.052);
  group.add(backInner);

  const backDiamond = new THREE.Mesh(diamondGeo, woodMat);
  backDiamond.position.set(0, 0.08, -0.065);
  group.add(backDiamond);

  // Pedestal base collar
  const collarGeo = new THREE.BoxGeometry(0.24, 0.06, 0.16);
  const collarMesh = new THREE.Mesh(collarGeo, woodMat);
  collarMesh.position.set(0, -0.62, 0);
  group.add(collarMesh);

  return group;
}

export const Begena3DCanvas: React.FC<Begena3DCanvasProps> = ({
  selectedPartId,
  onSelectPart,
  activePresetId = 'full',
  isAutoRotate = false
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const partMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const animFrameIdRef = useRef<number | null>(null);

  const cameraTargetPos = useRef<THREE.Vector3 | null>(null);
  const cameraLookAtPos = useRef<THREE.Vector3 | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        setIsLoading(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      setIsLoading(false);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#161311');
    scene.fog = new THREE.FogExp2('#161311', 0.038);

    // 2. Camera - Framing full Begena from front with breathing room
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.45, 14.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.0;
    controls.maxDistance = 28.0;
    controls.target.set(0, 1.10, 0);
    controls.maxPolarAngle = Math.PI / 2 + 0.15;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#fff5e3', 2.8);
    sunLight.position.set(4.5, 7.5, 5.0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0001;
    scene.add(sunLight);

    const skyBlueLight = new THREE.DirectionalLight('#bcdcff', 1.0);
    skyBlueLight.position.set(-5, 4, 3);
    scene.add(skyBlueLight);

    const warmRimLight = new THREE.DirectionalLight('#ffaa40', 1.8);
    warmRimLight.position.set(0, 5, -6);
    scene.add(warmRimLight);

    // Floor contact shadow
    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#110e0c',
      roughness: 0.85,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.7;
    floor.receiveShadow = true;
    scene.add(floor);

    // 6. BUILD EXACT 3D BEGENA MODEL MATCHING IMAGE 2
    const begenaGroup = new THREE.Group();
    scene.add(begenaGroup);

    // Textures & Materials
    const frontParchmentTex = createBegenaTexture('front_parchment');
    const rearParchmentTex = createBegenaTexture('rear_parchment');
    const sideWoodTex = createBegenaTexture('side_wood');
    const topDeckTex = createBegenaTexture('top_deck');
    const burgundyWoodTex = createBegenaTexture('burgundy_wood');
    const blondeWoodTex = createBegenaTexture('blonde_wood');
    const inziraLeatherTex = createBegenaTexture('inzira_leather');

    const frontParchmentMat = new THREE.MeshStandardMaterial({
      map: frontParchmentTex,
      roughness: 0.55,
      metalness: 0.02
    });

    const rearParchmentMat = new THREE.MeshStandardMaterial({
      map: rearParchmentTex,
      roughness: 0.55,
      metalness: 0.02
    });

    const topDeckMat = new THREE.MeshStandardMaterial({
      map: topDeckTex,
      roughness: 0.5,
      metalness: 0.04
    });

    const sideWoodMat = new THREE.MeshStandardMaterial({
      map: sideWoodTex,
      roughness: 0.55,
      metalness: 0.03
    });

    const burgundyWoodMat = new THREE.MeshStandardMaterial({
      map: burgundyWoodTex,
      roughness: 0.38,
      metalness: 0.04
    });

    const blondeWoodMat = new THREE.MeshStandardMaterial({
      map: blondeWoodTex,
      roughness: 0.45,
      metalness: 0.02
    });

    const inziraMat = new THREE.MeshStandardMaterial({
      color: '#151210',
      roughness: 0.92,
      metalness: 0.02
    });

    const stringMat = new THREE.MeshStandardMaterial({
      color: '#f5edd8', // Ivory/cream strings as photographed
      roughness: 0.35,
      metalness: 0.05,
      emissive: '#1c1812',
      emissiveIntensity: 0.12
    });

    // A) WATERTIGHT CONTINUOUS SOUNDBOX (Matching Image 2)
    const zFront = 0.35;
    const soundboxGeo = createWatertightSoundboxGeometry(
      3.3,   // wFront
      3.6,   // hFront
      zFront,// zFront
      -2.6,  // yBottomFront
      1.7,   // wBack
      1.9,   // hBack
      -1.35, // zBack
      -2.05  // yBottomBack
    );

    const soundboxMaterials = [
      frontParchmentMat, // 0: Front
      rearParchmentMat,  // 1: Back
      topDeckMat,        // 2: Top
      sideWoodMat,       // 3: Bottom
      sideWoodMat,       // 4: Left
      sideWoodMat        // 5: Right
    ];

    const soundboxMesh = new THREE.Mesh(soundboxGeo, soundboxMaterials);
    soundboxMesh.castShadow = true;
    soundboxMesh.receiveShadow = true;
    soundboxMesh.userData = { partId: 'soundbox' };
    begenaGroup.add(soundboxMesh);
    partMeshesRef.current.set('soundbox', soundboxMesh);
    partMeshesRef.current.set('soundboard', soundboxMesh);
    partMeshesRef.current.set('rear_medallion', soundboxMesh);

    // Front beveled trim frame (Image 2)
    const trimMat = new THREE.MeshStandardMaterial({
      map: blondeWoodTex,
      color: '#cb9a5e',
      roughness: 0.5
    });
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(3.32, 0.06, 0.06), trimMat);
    frameTop.position.set(0, 1.0 - 0.03, zFront + 0.03);
    begenaGroup.add(frameTop);

    const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(3.32, 0.06, 0.06), trimMat);
    frameBottom.position.set(0, -2.6 + 0.03, zFront + 0.03);
    begenaGroup.add(frameBottom);

    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3.6, 0.06), trimMat);
    frameLeft.position.set(-1.65 + 0.03, -0.8, zFront + 0.03);
    begenaGroup.add(frameLeft);

    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3.6, 0.06), trimMat);
    frameRight.position.set(1.65 - 0.03, -0.8, zFront + 0.03);
    begenaGroup.add(frameRight);

    // B) TWO BARLEY-TWIST SPIRAL PILLARS (Matching reference photo)
    // Anchored firmly through top deck of soundbox behind the front parchment soundboard
    const pillarHeight = 6.4;
    const pillarBottomSpacing = 1.15;
    const pillarTopSpacing = 1.62;
    const flareAngle = Math.atan2(pillarTopSpacing - pillarBottomSpacing, pillarHeight);

    // Anchor down cleanly into soundbox top deck (deck is at y ≈ 0.74 at z = -0.04)
    // With pillarZ = -0.04 and radius = 0.315, front edge is at 0.275 < 0.35 (front soundboard face)
    const pillarBaseY = 0.58;
    const pillarCenterY = pillarBaseY + pillarHeight / 2;
    const pillarZ = -0.04;

    // Left Pillar - deeply carved helical fluting
    const leftPillarGeo = createBarleyTwistPillarGeometry(pillarHeight, 0.22, 0.095, 5.8);
    const leftPillar = new THREE.Mesh(leftPillarGeo, burgundyWoodMat);
    leftPillar.position.set(-((pillarBottomSpacing + pillarTopSpacing) / 2), pillarCenterY, pillarZ);
    leftPillar.rotation.z = flareAngle;
    leftPillar.userData = { partId: 'pillars' };

    // Right Pillar - deeply carved helical fluting (mirrored helical twist)
    const rightPillarGeo = createBarleyTwistPillarGeometry(pillarHeight, 0.22, 0.095, -5.8);
    const rightPillar = new THREE.Mesh(rightPillarGeo, burgundyWoodMat);
    rightPillar.position.set((pillarBottomSpacing + pillarTopSpacing) / 2, pillarCenterY, pillarZ);
    rightPillar.rotation.z = -flareAngle;
    rightPillar.castShadow = true;
    rightPillar.userData = { partId: 'pillars' };

    const pillarsGroup = new THREE.Group();
    pillarsGroup.userData = { partId: 'pillars' };
    pillarsGroup.add(leftPillar);
    pillarsGroup.add(rightPillar);
    begenaGroup.add(pillarsGroup);

    partMeshesRef.current.set('pillars', pillarsGroup);

    // C) CROSSBAR & CAP BLOCKS
    const crossbarGroup = new THREE.Group();
    const crossbarY = pillarBaseY + pillarHeight - 0.2;
    const crossbarZ = pillarZ;

    const capBlockGeo = new THREE.BoxGeometry(0.76, 0.40, 0.52);
    const leftCap = new THREE.Mesh(capBlockGeo, burgundyWoodMat);
    leftCap.position.set(-pillarTopSpacing, crossbarY, crossbarZ);
    leftCap.castShadow = true;
    crossbarGroup.add(leftCap);

    const rightCap = new THREE.Mesh(capBlockGeo, burgundyWoodMat);
    rightCap.position.set(pillarTopSpacing, crossbarY, crossbarZ);
    rightCap.castShadow = true;
    crossbarGroup.add(rightCap);

    // Decorative carved horizontal molding on front face of each cap block (matching reference photo)
    const moldingGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.70, 20);
    moldingGeo.rotateZ(Math.PI / 2);

    const leftMolding = new THREE.Mesh(moldingGeo, burgundyWoodMat);
    leftMolding.position.set(-pillarTopSpacing, crossbarY, crossbarZ + 0.27);
    leftMolding.castShadow = true;
    crossbarGroup.add(leftMolding);

    const rightMolding = new THREE.Mesh(moldingGeo, burgundyWoodMat);
    rightMolding.position.set(pillarTopSpacing, crossbarY, crossbarZ + 0.27);
    rightMolding.castShadow = true;
    crossbarGroup.add(rightMolding);

    const crossbarSpan = pillarTopSpacing * 2;
    const crossbarGeo = new THREE.CylinderGeometry(0.12, 0.12, crossbarSpan - 0.25, 24);
    crossbarGeo.rotateZ(Math.PI / 2);
    const crossbarRod = new THREE.Mesh(crossbarGeo, burgundyWoodMat);
    crossbarRod.position.set(0, crossbarY, crossbarZ);
    crossbarRod.castShadow = true;
    crossbarGroup.add(crossbarRod);

    crossbarGroup.userData = { partId: 'crossbar' };
    begenaGroup.add(crossbarGroup);
    partMeshesRef.current.set('crossbar', crossbarGroup);

    // D) AUTHENTIC ETHIOPIAN LALIBELA STEPPED CROSS FINIALS (Matching reference photo)
    const crossesGroup = new THREE.Group();

    const leftCross = createAuthenticLalibelaCrossGroup(burgundyWoodMat);
    leftCross.position.set(-pillarTopSpacing, crossbarY + 0.90, crossbarZ);
    leftCross.traverse((child) => {
      if (child instanceof THREE.Mesh) child.castShadow = true;
    });
    crossesGroup.add(leftCross);

    const rightCross = createAuthenticLalibelaCrossGroup(burgundyWoodMat);
    rightCross.position.set(pillarTopSpacing, crossbarY + 0.90, crossbarZ);
    rightCross.traverse((child) => {
      if (child instanceof THREE.Mesh) child.castShadow = true;
    });
    crossesGroup.add(rightCross);

    crossesGroup.userData = { partId: 'crosses' };
    begenaGroup.add(crossesGroup);
    partMeshesRef.current.set('crosses', crossesGroup);

    // E) 10 CLEAN CYLINDRICAL FRICTION PEGS (Alternating herringbone tilt, matching reference photo)
    const pegsGroup = new THREE.Group();
    const pegGeo = new THREE.CylinderGeometry(0.042, 0.050, 0.72, 20);

    const pegSpan = 1.35;
    const pegSpacing = pegSpan / 9;

    for (let i = 0; i < 10; i++) {
      const pegSubGroup = new THREE.Group();
      const pegX = -pegSpan / 2 + i * pegSpacing;

      const pegBody = new THREE.Mesh(pegGeo, blondeWoodMat);
      pegBody.castShadow = true;

      const angleSign = i % 2 === 0 ? 1 : -1;
      pegBody.rotation.x = angleSign * 0.38;
      pegBody.rotation.z = -angleSign * 0.08;

      pegSubGroup.position.set(pegX, crossbarY + 0.10, crossbarZ);
      pegSubGroup.add(pegBody);
      pegsGroup.add(pegSubGroup);
    }

    pegsGroup.userData = { partId: 'pegs' };
    begenaGroup.add(pegsGroup);
    partMeshesRef.current.set('pegs', pegsGroup);

    // F) OPEN-BOX BRIDGE (Feres) - CENTERED on the soundbox face (matching reference photo)
    const bridgeGroup = new THREE.Group();
    const bridgeWidth = 1.34;
    const bridgeHeight = 0.46;
    const bridgeDepth = 0.35;
    const bridgeY = -0.82; // Perfectly centered on soundboard (soundboard runs from -2.60 to +1.0)
    const bridgeZ = zFront + bridgeDepth / 2;

    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(bridgeWidth, bridgeHeight, 0.06), blondeWoodMat);
    frontWall.position.set(0, 0, bridgeDepth / 2);
    frontWall.castShadow = true;
    bridgeGroup.add(frontWall);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(bridgeWidth, bridgeHeight, 0.06), blondeWoodMat);
    backWall.position.set(0, 0, -bridgeDepth / 2);
    bridgeGroup.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.06, bridgeHeight, bridgeDepth), blondeWoodMat);
    leftWall.position.set(-bridgeWidth / 2, 0, 0);
    bridgeGroup.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.06, bridgeHeight, bridgeDepth), blondeWoodMat);
    rightWall.position.set(bridgeWidth / 2, 0, 0);
    bridgeGroup.add(rightWall);

    bridgeGroup.position.set(0, bridgeY, bridgeZ);
    bridgeGroup.userData = { partId: 'bridge' };
    begenaGroup.add(bridgeGroup);
    partMeshesRef.current.set('bridge', bridgeGroup);

    // 10 BLACK LEATHER INZIRA BUFFERS (Matching reference photo)
    const inziraGroup = new THREE.Group();
    const stringSpanAtBridge = 1.12;
    const stringSpacingAtBridge = stringSpanAtBridge / 9;

    const inziraPieceGeo = new THREE.BoxGeometry(0.065, 0.17, 0.05);

    for (let i = 0; i < 10; i++) {
      const ix = -stringSpanAtBridge / 2 + i * stringSpacingAtBridge;
      const inziraMesh = new THREE.Mesh(inziraPieceGeo, inziraMat);
      inziraMesh.position.set(ix, bridgeY + 0.02, bridgeZ + bridgeDepth / 2 + 0.02);
      inziraGroup.add(inziraMesh);
    }

    inziraGroup.userData = { partId: 'inzira' };
    begenaGroup.add(inziraGroup);
    partMeshesRef.current.set('inzira', inziraGroup);

    // G) TURNED WOODEN TAILPIECE (Wag) - matching reference photo
    const tailpieceGroup = new THREE.Group();
    const tailpieceWidth = 2.15;
    const tailpieceY = -2.36;
    const tailpieceZ = zFront + 0.09;

    const tailpieceGeo = new THREE.CylinderGeometry(0.075, 0.075, tailpieceWidth, 24);
    tailpieceGeo.rotateZ(Math.PI / 2);
    const tailpieceRod = new THREE.Mesh(tailpieceGeo, blondeWoodMat);
    tailpieceRod.castShadow = true;
    tailpieceGroup.add(tailpieceRod);

    // Flared lathe-turned end finials matching reference photo
    const flaredEndGeo = new THREE.CylinderGeometry(0.10, 0.075, 0.14, 20);
    flaredEndGeo.rotateZ(Math.PI / 2);

    const leftFlaredEnd = new THREE.Mesh(flaredEndGeo, blondeWoodMat);
    leftFlaredEnd.position.set(-tailpieceWidth / 2 - 0.06, 0, 0);
    leftFlaredEnd.rotation.y = Math.PI;
    tailpieceGroup.add(leftFlaredEnd);

    const rightFlaredEnd = new THREE.Mesh(flaredEndGeo, blondeWoodMat);
    rightFlaredEnd.position.set(tailpieceWidth / 2 + 0.06, 0, 0);
    tailpieceGroup.add(rightFlaredEnd);

    const coilGeo = new THREE.CylinderGeometry(0.082, 0.082, 1.4, 16);
    coilGeo.rotateZ(Math.PI / 2);
    const coilMesh = new THREE.Mesh(coilGeo, stringMat);
    tailpieceGroup.add(coilMesh);

    // Two authentic parchment leather anchoring straps (matching reference photo)
    const strapMat = new THREE.MeshStandardMaterial({
      color: '#e2d3be',
      roughness: 0.75,
      metalness: 0.02
    });
    const strapGeo = new THREE.CylinderGeometry(0.088, 0.088, 0.20, 16);
    strapGeo.rotateZ(Math.PI / 2);

    const leftStrap = new THREE.Mesh(strapGeo, strapMat);
    leftStrap.position.set(-0.76, 0, 0);
    leftStrap.userData = { partId: 'straps' };
    tailpieceGroup.add(leftStrap);

    const rightStrap = new THREE.Mesh(strapGeo, strapMat);
    rightStrap.position.set(0.76, 0, 0);
    rightStrap.userData = { partId: 'straps' };
    tailpieceGroup.add(rightStrap);

    const strapsGroup = new THREE.Group();
    strapsGroup.add(leftStrap);
    strapsGroup.add(rightStrap);
    strapsGroup.userData = { partId: 'straps' };
    partMeshesRef.current.set('straps', strapsGroup);

    tailpieceGroup.position.set(0, tailpieceY, tailpieceZ);
    tailpieceGroup.userData = { partId: 'tailpiece' };
    begenaGroup.add(tailpieceGroup);
    partMeshesRef.current.set('tailpiece', tailpieceGroup);

    // H) THE 10 STRINGS
    const stringsGroup = new THREE.Group();
    stringsGroup.userData = { partId: 'strings' };
    partMeshesRef.current.set('strings', stringsGroup);

    for (let i = 0; i < 10; i++) {
      const pegX = -pegSpan / 2 + i * pegSpacing;
      const bridgeX = -stringSpanAtBridge / 2 + i * stringSpacingAtBridge;
      const tailX = bridgeX * 1.14; // Strings fan out gently towards the dowel (matching photo)

      const topPoint = new THREE.Vector3(pegX, crossbarY + 0.05, crossbarZ + 0.20);
      const bridgePoint = new THREE.Vector3(bridgeX, bridgeY + bridgeHeight / 2 + 0.04, bridgeZ + bridgeDepth / 2 + 0.04);
      const bottomPoint = new THREE.Vector3(tailX, tailpieceY, tailpieceZ + 0.04);

      const curve = new THREE.CatmullRomCurve3([topPoint, bridgePoint, bottomPoint]);
      const stringGeo = new THREE.TubeGeometry(curve, 32, 0.016, 8, false);

      const stringMesh = new THREE.Mesh(stringGeo, stringMat.clone());
      stringMesh.castShadow = true;
      stringMesh.userData = {
        partId: `string_${i + 1}`,
        isString: true,
        stringIndex: i + 1
      };

      const hitGeo = new THREE.TubeGeometry(curve, 16, 0.09, 6, false);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = {
        partId: `string_${i + 1}`,
        isString: true,
        stringIndex: i + 1
      };
      stringMesh.add(hitMesh);

      stringsGroup.add(stringMesh);
      partMeshesRef.current.set(`string_${i + 1}`, stringMesh);
    }
    begenaGroup.add(stringsGroup);

    setIsLoading(false);

    // 7. Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedPart = (event: MouseEvent | TouchEvent): string | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ('touches' in event) {
        if (event.touches.length === 0) return null;
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(begenaGroup.children, true);
      if (intersects.length > 0) {
        for (const hit of intersects) {
          let curr: THREE.Object3D | null = hit.object;
          while (curr && curr !== begenaGroup) {
            if (curr.userData && curr.userData.partId) {
              const partId = curr.userData.partId;
              if (partId === 'soundbox') {
                if (hit.point.z > 0.20) {
                  return 'soundboard';
                }
                if (hit.point.z < -0.75) {
                  return 'rear_medallion';
                }
                return 'soundbox';
              }
              return partId;
            }
            curr = curr.parent;
          }
        }
      }
      return null;
    };

    const handlePointerMove = (e: MouseEvent) => {
      const partId = getIntersectedPart(e);
      if (partId) {
        container.style.cursor = 'pointer';
      } else {
        container.style.cursor = 'grab';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const partId = getIntersectedPart(e);
      if (partId) {
        onSelectPart(partId);
        const partData = BEGENA_PARTS.find((p) => p.id === partId);
        if (partData && partData.audioPitchHz) {
          begenaAudio.playString(partData.audioPitchHz, true);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const partId = getIntersectedPart(e);
        if (partId) {
          onSelectPart(partId);
          const partData = BEGENA_PARTS.find((p) => p.id === partId);
          if (partData && partData.audioPitchHz) {
            begenaAudio.playString(partData.audioPitchHz, true);
          }
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousemove', handlePointerMove);
    domElement.addEventListener('click', handleClick);
    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });

    // 8. Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (cameraTargetPos.current && cameraLookAtPos.current) {
        camera.position.lerp(cameraTargetPos.current, 0.06);
        controls.target.lerp(cameraLookAtPos.current, 0.06);

        if (
          camera.position.distanceTo(cameraTargetPos.current) < 0.04 &&
          controls.target.distanceTo(cameraLookAtPos.current) < 0.04
        ) {
          cameraTargetPos.current = null;
          cameraLookAtPos.current = null;
        }
      }

      if (isAutoRotate && !cameraTargetPos.current) {
        begenaGroup.rotation.y += 0.005;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousemove', handlePointerMove);
      domElement.removeEventListener('click', handleClick);
      domElement.removeEventListener('touchstart', handleTouchStart);

      controls.dispose();
      renderer.dispose();
      scene.clear();
      partMeshesRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!controlsRef.current || !cameraRef.current) return;

    if (selectedPartId) {
      // Keep the Begena rock-solid and stable when strings are played or clicked!
      // Do not jerk, zoom in, or destabilize the view during string interaction.
      if (selectedPartId.startsWith('string_') || selectedPartId === 'strings') {
        return;
      }

      const part = BEGENA_PARTS.find((p) => p.id === selectedPartId);
      if (part && part.cameraFocus) {
        cameraTargetPos.current = new THREE.Vector3(...part.cameraFocus.position);
        cameraLookAtPos.current = new THREE.Vector3(...part.cameraFocus.target);
      }
    } else if (activePresetId) {
      const preset = CAMERA_PRESETS.find((p) => p.id === activePresetId);
      if (preset) {
        cameraTargetPos.current = new THREE.Vector3(...preset.position);
        cameraLookAtPos.current = new THREE.Vector3(...preset.target);
      }
    }
  }, [selectedPartId, activePresetId]);

  useEffect(() => {
    partMeshesRef.current.forEach((obj, partId) => {
      const isSelected =
        selectedPartId === partId ||
        (selectedPartId === 'strings' && partId.startsWith('string_')) ||
        (selectedPartId === 'tailpiece' && partId === 'straps');

      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m, idx) => {
              if (m && 'emissive' in m) {
                const mat = m as THREE.MeshStandardMaterial;
                let faceSelected = isSelected;
                if (partId === 'soundbox' || partId === 'soundboard' || partId === 'rear_medallion') {
                  if (selectedPartId === 'soundboard') {
                    faceSelected = idx === 0; // Front soundboard face
                  } else if (selectedPartId === 'rear_medallion') {
                    faceSelected = idx === 1; // Rear medallion face
                  } else if (selectedPartId === 'soundbox') {
                    faceSelected = idx >= 2; // Frame sides, deck, and bottom
                  }
                }

                if (faceSelected) {
                  mat.emissive.set('#ff9b42');
                  mat.emissiveIntensity = 0.65;
                } else {
                  mat.emissive.set('#000000');
                  mat.emissiveIntensity = 0.0;
                }
              }
            });
          } else if (child.material && 'emissive' in child.material) {
            const mat = child.material as THREE.MeshStandardMaterial;
            if (isSelected) {
              mat.emissive.set('#ff9b42');
              mat.emissiveIntensity = 0.75;
            } else {
              mat.emissive.set('#000000');
              mat.emissiveIntensity = 0.0;
            }
          }
        }
      });
    });
  }, [selectedPartId]);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full min-h-[480px] flex flex-col items-center justify-center bg-[#181513] text-amber-200 p-8 rounded-2xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-900/60 border border-amber-600/50 flex items-center justify-center text-amber-400 text-2xl font-bold">
          !
        </div>
        <h3 className="text-xl font-bold font-display text-white">3D Accelerator Notice</h3>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md">
          Hardware WebGL acceleration is not active on your current browser window. You can still inspect all Begena components, Amharic definitions, and audio tones from the side selector panel.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-[620px] rounded-2xl overflow-hidden bg-[#161311] select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {isLoading && (
        <div className="absolute inset-0 bg-[#161311]/90 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 z-20">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <span className="text-xs font-mono text-amber-300 tracking-wider uppercase font-bold">
            Constructing 3D Begena Model...
          </span>
        </div>
      )}

      <div className="absolute top-4 left-4 pointer-events-none z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white/80 text-[11px] font-medium shadow-lg">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>Click parts to inspect • Drag to rotate • Scroll to zoom</span>
      </div>
    </div>
  );
};
