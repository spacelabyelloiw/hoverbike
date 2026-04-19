import * as THREE from "three";

export type PrototypeTelemetry = {
  boostCharges: number;
  boosting: boolean;
  distance: number;
  drifting: boolean;
  recoveryHint: string | null;
  section: string;
  speedKph: number;
  steering: number;
};

type PrototypeOptions = {
  onTelemetry: (telemetry: PrototypeTelemetry) => void;
};

const TRACK_HALF_WIDTH = 3.4;
const MAX_BOOST_CHARGES = 3;
const TRACK_POINTS = [
  new THREE.Vector3(0, 0, 34),
  new THREE.Vector3(10, 0, 10),
  new THREE.Vector3(28, 0, -26),
  new THREE.Vector3(54, 0, -46),
  new THREE.Vector3(78, 0, -26),
  new THREE.Vector3(84, 0, 8),
  new THREE.Vector3(60, 0, 34),
  new THREE.Vector3(22, 0, 52),
  new THREE.Vector3(-14, 0, 58),
  new THREE.Vector3(-42, 0, 44),
  new THREE.Vector3(-62, 0, 12),
  new THREE.Vector3(-56, 0, -20),
  new THREE.Vector3(-26, 0, -40),
  new THREE.Vector3(-6, 0, -14),
];

const SECTION_BREAKS = [
  { ratio: 0.14, label: "Pit Straight" },
  { ratio: 0.26, label: "Turn 1 Sweep" },
  { ratio: 0.4, label: "Harbor Esses" },
  { ratio: 0.55, label: "Stadium Bend" },
  { ratio: 0.69, label: "Back Straight" },
  { ratio: 0.83, label: "Hairpin Sector" },
  { ratio: 1, label: "Final Curve" },
];

export function createPrototypeScene(
  renderer: THREE.WebGLRenderer,
  canvas: HTMLCanvasElement,
  options: PrototypeOptions,
) {
  const curve = new THREE.CatmullRomCurve3(TRACK_POINTS, true, "catmullrom", 0.2);
  const trackLength = approximateCurveLength(curve, 320);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#07111f");
  scene.fog = new THREE.Fog("#07111f", 44, 170);

  const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 240);
  camera.position.set(0, 5.2, 14);

  const ambientLight = new THREE.AmbientLight("#7dd3ff", 1.4);
  const sunLight = new THREE.DirectionalLight("#ffd18a", 2.4);
  sunLight.position.set(18, 26, 12);
  scene.add(ambientLight, sunLight);

  const trackMaterial = new THREE.MeshStandardMaterial({
    color: "#16243b",
    metalness: 0.14,
    roughness: 0.78,
    emissive: "#112038",
    emissiveIntensity: 0.45,
  });

  const runoffMaterial = new THREE.MeshStandardMaterial({
    color: "#0f1829",
    emissive: "#0f1829",
    emissiveIntensity: 0.25,
    roughness: 0.92,
  });

  const laneMaterial = new THREE.MeshBasicMaterial({
    color: "#33d3ff",
  });

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(280, 280),
    new THREE.MeshStandardMaterial({
      color: "#091321",
      emissive: "#091321",
      emissiveIntensity: 0.1,
      roughness: 1,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.28;
  scene.add(ground);

  const runoff = new THREE.Mesh(createTrackRibbonGeometry(curve, TRACK_HALF_WIDTH + 1.5, 240), runoffMaterial);
  runoff.position.y = -0.02;
  scene.add(runoff);

  const track = new THREE.Mesh(createTrackRibbonGeometry(curve, TRACK_HALF_WIDTH, 240), trackMaterial);
  track.position.y = 0.02;
  scene.add(track);

  const edgeMarkers = createEdgeMarkers(curve, laneMaterial);
  scene.add(edgeMarkers);

  const laneMarkers = createLaneMarkers(curve, laneMaterial);
  scene.add(laneMarkers);

  const skyline = createSkyline(curve);
  scene.add(skyline);

  const startGate = createStartGate(curve);
  scene.add(startGate);

  const bikePivot = new THREE.Group();
  const hoverbike = new THREE.Group();

  const bikeBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.35, 3.2),
    new THREE.MeshStandardMaterial({
      color: "#f2f6ff",
      emissive: "#54f4ff",
      emissiveIntensity: 0.45,
      metalness: 0.35,
      roughness: 0.38,
    }),
  );

  const bikeCanopy = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.2, 1),
    new THREE.MeshStandardMaterial({
      color: "#ff4db0",
      emissive: "#ff4db0",
      emissiveIntensity: 0.65,
    }),
  );
  bikeCanopy.position.set(0, 0.25, 0.15);

  const hoverGlowMaterial = new THREE.MeshBasicMaterial({
    color: "#47e8ff",
    transparent: true,
    opacity: 0.62,
  });
  const hoverGlow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.9, 0.05, 32),
    hoverGlowMaterial,
  );
  hoverGlow.position.set(0, -0.3, 0);

  const boostGlowMaterial = new THREE.MeshBasicMaterial({
    color: "#ff8d62",
    transparent: true,
    opacity: 0.1,
  });
  const boostGlow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.08, 24),
    boostGlowMaterial,
  );
  boostGlow.rotation.x = Math.PI / 2;
  boostGlow.position.set(0, -0.02, -1.95);

  hoverbike.add(bikeBody, bikeCanopy, hoverGlow, boostGlow);
  bikePivot.add(hoverbike);
  scene.add(bikePivot);

  const input = {
    accelerate: false,
    brake: false,
    boost: false,
    drift: false,
    reset: false,
    steerLeft: false,
    steerRight: false,
  };

  const state = {
    boostCharges: MAX_BOOST_CHARGES,
    distance: 0,
    lateralVelocity: 0,
    recoveryHint: null as string | null,
    speed: 18,
    x: 0,
    yaw: 0,
    yawVelocity: 0,
  };

  const clock = new THREE.Clock();
  const up = new THREE.Vector3(0, 1, 0);
  const forwardAxis = new THREE.Vector3(0, 0, 1);
  const tempForward = new THREE.Vector3();
  const tempSide = new THREE.Vector3();
  const tempPoint = new THREE.Vector3();
  const tempLook = new THREE.Vector3();
  const tempCamera = new THREE.Vector3();
  let rafId = 0;

  function setInput(code: string, active: boolean) {
    switch (code) {
      case "ArrowUp":
      case "KeyW":
      case "AltLeft":
      case "AltRight":
        input.accelerate = active;
        break;
      case "ArrowDown":
      case "KeyS":
        input.brake = active;
        break;
      case "ArrowLeft":
      case "KeyA":
        input.steerLeft = active;
        break;
      case "ArrowRight":
      case "KeyD":
        input.steerRight = active;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        input.boost = active;
        break;
      case "Space":
        input.drift = active;
        break;
      case "KeyR":
        input.reset = active;
        break;
      default:
        break;
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
      event.preventDefault();
    }
    setInput(event.code, true);
  }

  function handleKeyUp(event: KeyboardEvent) {
    setInput(event.code, false);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }

  function animate() {
    const delta = Math.min(clock.getDelta(), 1 / 20);
    const elapsed = clock.getElapsedTime();

    const steeringInput = Number(input.steerRight) - Number(input.steerLeft);
    const drifting = input.drift;
    const acceleration = input.accelerate ? 17 : 0;
    const braking = input.brake ? 24 : 0;
    const passiveDrag = state.speed * 0.72;
    const canBoost = input.boost && state.boostCharges > 0.05;
    const boostAcceleration = canBoost ? 26 : 0;
    const maxSpeed = canBoost ? 46 : drifting ? 31 : 36;

    state.speed += (acceleration + boostAcceleration - braking - passiveDrag) * delta;
    state.speed = THREE.MathUtils.clamp(state.speed, 0, maxSpeed);

    if (canBoost) {
      state.boostCharges = Math.max(0, state.boostCharges - delta * 0.82);
    } else {
      const rechargeRate = drifting ? 0.34 : 0.18;
      state.boostCharges = Math.min(MAX_BOOST_CHARGES, state.boostCharges + delta * rechargeRate);
    }

    const steeringStrength = drifting ? 2.9 : 2.1;
    const yawAssist = drifting ? 3.6 : 5.4;
    state.yawVelocity += steeringInput * steeringStrength * delta;
    state.yawVelocity -= state.yawVelocity * yawAssist * delta;
    state.yaw += state.yawVelocity * delta;
    state.yaw *= drifting ? 0.995 : 0.99;

    const lateralAcceleration = drifting ? 18 : 12;
    const lateralDrag = drifting ? 4.2 : 6.4;
    const steerBias = state.speed * (drifting ? 0.018 : 0.012);
    state.lateralVelocity += steeringInput * (lateralAcceleration + steerBias) * delta;
    state.lateralVelocity -= state.lateralVelocity * lateralDrag * delta;
    state.lateralVelocity += state.yawVelocity * (drifting ? 1.2 : 0.8);
    state.x += state.lateralVelocity * delta;

    if (Math.abs(state.x) > TRACK_HALF_WIDTH) {
      state.x = THREE.MathUtils.clamp(state.x, -TRACK_HALF_WIDTH, TRACK_HALF_WIDTH);
      state.speed *= 0.982;
      state.yawVelocity *= 0.45;
      state.lateralVelocity *= -0.18;
      state.recoveryHint = "Track edge scrape";
    }

    if (input.reset) {
      state.x = 0;
      state.lateralVelocity = 0;
      state.yaw = 0;
      state.yawVelocity = 0;
      state.speed = 12;
      state.recoveryHint = "Manual reset";
    }

    state.distance += state.speed * delta;
    const courseDistance = state.distance % trackLength;
    const courseRatio = courseDistance / trackLength;
    const currentSection =
      SECTION_BREAKS.find((section) => courseRatio <= section.ratio)?.label ??
      SECTION_BREAKS[SECTION_BREAKS.length - 1].label;

    const t = courseDistance / trackLength;
    curve.getPointAt(t, tempPoint);
    curve.getTangentAt(t, tempForward).normalize();
    tempSide.set(-tempForward.z, 0, tempForward.x).normalize();

    const bob = Math.sin(elapsed * 7 + state.distance * 0.08) * (0.06 + state.speed * 0.0011);
    const pitch = -state.speed * 0.006 - (canBoost ? 0.06 : 0) + (input.brake ? 0.08 : 0);
    const bank = THREE.MathUtils.clamp(state.yawVelocity * 4.6, -0.75, 0.75) - steeringInput * 0.06;

    bikePivot.position.copy(tempPoint).addScaledVector(tempSide, state.x).addScaledVector(up, 0.86 + bob);
    bikePivot.quaternion.setFromUnitVectors(forwardAxis, tempForward);
    hoverbike.rotation.set(
      THREE.MathUtils.damp(hoverbike.rotation.x, pitch, 7, delta),
      0,
      THREE.MathUtils.damp(hoverbike.rotation.z, bank, 8, delta),
    );

    hoverGlow.scale.setScalar(1 + state.speed * 0.008 + (drifting ? 0.12 : 0));
    hoverGlowMaterial.opacity = 0.42 + state.speed * 0.01;
    boostGlowMaterial.opacity = canBoost ? 0.9 : 0.1;
    boostGlow.scale.setScalar(canBoost ? 1.45 : 0.95);

    tempLook.copy(bikePivot.position).addScaledVector(tempForward, 14).addScaledVector(up, 1.2);
    tempCamera
      .copy(bikePivot.position)
      .addScaledVector(tempForward, -(9.4 - state.speed * 0.04))
      .addScaledVector(up, 4.8)
      .addScaledVector(tempSide, state.x * 0.2);

    camera.position.lerp(tempCamera, 1 - Math.exp(-5.2 * delta));
    camera.lookAt(tempLook);

    renderer.render(scene, camera);
    options.onTelemetry({
      boostCharges: state.boostCharges,
      boosting: canBoost,
      distance: courseDistance,
      drifting,
      recoveryHint: state.recoveryHint,
      section: currentSection,
      speedKph: state.speed * 11.2,
      steering: steeringInput,
    });
    state.recoveryHint = null;

    rafId = window.requestAnimationFrame(animate);
  }

  resize();
  animate();

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return function stop() {
    window.cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    renderer.dispose();
  };
}

function approximateCurveLength(curve: THREE.CatmullRomCurve3, samples: number) {
  let total = 0;
  let previous = curve.getPointAt(0);
  for (let index = 1; index <= samples; index += 1) {
    const point = curve.getPointAt(index / samples);
    total += point.distanceTo(previous);
    previous = point;
  }
  return total;
}

function createTrackRibbonGeometry(
  curve: THREE.CatmullRomCurve3,
  halfWidth: number,
  segments: number,
) {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const point = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    curve.getPointAt(t, point);
    curve.getTangentAt(t, tangent).normalize();
    side.set(-tangent.z, 0, tangent.x).normalize();

    const left = point.clone().addScaledVector(side, -halfWidth);
    const right = point.clone().addScaledVector(side, halfWidth);

    positions.push(left.x, left.y, left.z, right.x, right.y, right.z);
    normals.push(0, 1, 0, 0, 1, 0);
    uvs.push(0, t * 14, 1, t * 14);

    if (index < segments) {
      const base = index * 2;
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}

function createEdgeMarkers(curve: THREE.CatmullRomCurve3, material: THREE.Material) {
  const group = new THREE.Group();
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  const point = new THREE.Vector3();

  for (let index = 0; index < 96; index += 1) {
    const t = index / 96;
    curve.getPointAt(t, point);
    curve.getTangentAt(t, tangent).normalize();
    side.set(-tangent.z, 0, tangent.x).normalize();

    [-1, 1].forEach((direction) => {
      const marker = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 1.2), material);
      marker.position
        .copy(point)
        .addScaledVector(side, direction * (TRACK_HALF_WIDTH + 0.24))
        .addScaledVector(new THREE.Vector3(0, 1, 0), 0.2);
      marker.lookAt(marker.position.clone().add(tangent));
      group.add(marker);
    });
  }

  return group;
}

function createLaneMarkers(curve: THREE.CatmullRomCurve3, material: THREE.Material) {
  const group = new THREE.Group();
  const tangent = new THREE.Vector3();
  const point = new THREE.Vector3();

  for (let index = 0; index < 72; index += 1) {
    const t = index / 72;
    curve.getPointAt(t, point);
    curve.getTangentAt(t, tangent).normalize();

    const marker = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 2.2), material);
    marker.position.copy(point).addScaledVector(new THREE.Vector3(0, 1, 0), 0.06);
    marker.lookAt(marker.position.clone().add(tangent));
    group.add(marker);
  }

  return group;
}

function createSkyline(curve: THREE.CatmullRomCurve3) {
  const group = new THREE.Group();
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  const point = new THREE.Vector3();

  for (let index = 0; index < 36; index += 1) {
    const t = index / 36;
    curve.getPointAt(t, point);
    curve.getTangentAt(t, tangent).normalize();
    side.set(-tangent.z, 0, tangent.x).normalize();

    const distance = 12 + (index % 4) * 4;
    const height = 5 + (index % 5) * 2.2;
    const sideDir = index % 2 === 0 ? -1 : 1;

    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, height, 3.2),
      new THREE.MeshStandardMaterial({
        color: index % 2 === 0 ? "#24375d" : "#1a2b4a",
        emissive: index % 3 === 0 ? "#172b4a" : "#0f1e33",
        emissiveIntensity: 0.55,
      }),
    );
    tower.position
      .copy(point)
      .addScaledVector(side, sideDir * distance)
      .addScaledVector(new THREE.Vector3(0, 1, 0), height / 2 - 0.2);
    group.add(tower);
  }

  return group;
}

function createStartGate(curve: THREE.CatmullRomCurve3) {
  const group = new THREE.Group();
  const point = curve.getPointAt(0);
  const tangent = curve.getTangentAt(0).normalize();
  const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

  const leftPillar = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 3.8, 0.4),
    new THREE.MeshStandardMaterial({
      color: "#1d2f4d",
      emissive: "#13233a",
      emissiveIntensity: 0.35,
    }),
  );
  leftPillar.position.copy(point).addScaledVector(side, -(TRACK_HALF_WIDTH + 0.8)).addScaledVector(new THREE.Vector3(0, 1, 0), 1.9);

  const rightPillar = leftPillar.clone();
  rightPillar.position.copy(point).addScaledVector(side, TRACK_HALF_WIDTH + 0.8).addScaledVector(new THREE.Vector3(0, 1, 0), 1.9);

  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(TRACK_HALF_WIDTH * 2 + 1.6, 0.28, 0.4),
    new THREE.MeshStandardMaterial({
      color: "#ff7e47",
      emissive: "#ff7e47",
      emissiveIntensity: 0.9,
    }),
  );
  bridge.position.copy(point).addScaledVector(new THREE.Vector3(0, 1, 0), 3.8);

  group.add(leftPillar, rightPillar, bridge);
  return group;
}
