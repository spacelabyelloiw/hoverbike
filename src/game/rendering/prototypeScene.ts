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

const TRACK_HALF_WIDTH = 2.55;
const MAX_BOOST_CHARGES = 3;
const COURSE_LENGTH = 420;
const COURSE_SECTIONS = [
  { maxDistance: 70, label: "Downtown Launch" },
  { maxDistance: 130, label: "Building Thread" },
  { maxDistance: 200, label: "Transit Ramp Rise" },
  { maxDistance: 265, label: "Skybridge Loop" },
  { maxDistance: 330, label: "Rooftop Dash" },
  { maxDistance: 380, label: "Interior Dive" },
  { maxDistance: 420, label: "Grand Helix Finale" },
];

export function createPrototypeScene(
  renderer: THREE.WebGLRenderer,
  canvas: HTMLCanvasElement,
  options: PrototypeOptions,
) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#07111f");
  scene.fog = new THREE.Fog("#07111f", 16, 72);

  const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 140);
  camera.position.set(0, 5.4, 11.8);

  const ambientLight = new THREE.AmbientLight("#7dd3ff", 1.4);
  const sunLight = new THREE.DirectionalLight("#ffd18a", 2.2);
  sunLight.position.set(8, 12, 6);
  scene.add(ambientLight, sunLight);

  const trackMaterial = new THREE.MeshStandardMaterial({
    color: "#17243d",
    metalness: 0.16,
    roughness: 0.72,
    emissive: "#12213a",
    emissiveIntensity: 0.55,
  });

  const laneMaterial = new THREE.MeshStandardMaterial({
    color: "#33d3ff",
    emissive: "#33d3ff",
    emissiveIntensity: 0.85,
  });

  const platform = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.55, 42), trackMaterial);
  platform.position.set(0, 0, 0);
  scene.add(platform);

  const trackShoulders = [-3.35, 3.35].map((x) => {
    const barrier = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.9, 42),
      new THREE.MeshStandardMaterial({
        color: "#ff7e47",
        emissive: "#ff7e47",
        emissiveIntensity: 0.75,
      }),
    );
    barrier.position.set(x, 0.5, 0);
    scene.add(barrier);
    return barrier;
  });

  const loop = new THREE.Mesh(
    new THREE.TorusGeometry(4, 0.45, 24, 72),
    new THREE.MeshStandardMaterial({
      color: "#ff7e47",
      emissive: "#ff7e47",
      emissiveIntensity: 0.9,
    }),
  );
  loop.rotation.x = Math.PI / 2;
  loop.position.set(0, 4.6, -12);
  scene.add(loop);

  const loopPillars = [-5.8, 5.8].map((x) => {
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 7.5, 0.5),
      new THREE.MeshStandardMaterial({
        color: "#20324f",
        emissive: "#12213a",
        emissiveIntensity: 0.35,
      }),
    );
    pillar.position.set(x, 3.3, -12);
    scene.add(pillar);
    return pillar;
  });

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
  boostGlow.position.set(0, -0.02, 1.95);

  hoverbike.add(bikeBody, bikeCanopy, hoverGlow, boostGlow);
  hoverbike.position.set(0, 0.85, 7.2);
  scene.add(hoverbike);

  const laneLines = Array.from({ length: 16 }, (_, index) => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 1.8), laneMaterial);
    line.position.set(0, 0.3, 15 - index * 3.1);
    scene.add(line);
    return line;
  });

  const sideLights = Array.from({ length: 18 }, (_, index) => {
    const x = index % 2 === 0 ? -2.95 : 2.95;
    const marker = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.14, 1),
      new THREE.MeshBasicMaterial({
        color: index % 4 === 0 ? "#36d3ff" : "#ff5f93",
      }),
    );
    marker.position.set(x, 0.36, 12 - index * 2.4);
    scene.add(marker);
    return marker;
  });

  const skyline = Array.from({ length: 18 }, (_, index) => {
    const height = 2.4 + (index % 5) * 1.4;
    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, height, 1.5),
      new THREE.MeshStandardMaterial({
        color: index % 2 === 0 ? "#24375d" : "#1a2b4a",
        emissive: index % 3 === 0 ? "#172b4a" : "#0f1e33",
        emissiveIntensity: 0.5,
      }),
    );
    const side = index % 2 === 0 ? -1 : 1;
    tower.position.set(side * (5.2 + (index % 3) * 1.75), height / 2 - 0.1, 15 - index * 4.4);
    scene.add(tower);
    return tower;
  });

  const billboards = Array.from({ length: 8 }, (_, index) => {
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.1, 0.12),
      new THREE.MeshStandardMaterial({
        color: "#0f1d31",
        emissive: index % 2 === 0 ? "#36d3ff" : "#ff5f93",
        emissiveIntensity: 1.15,
      }),
    );
    sign.position.set(index % 2 === 0 ? -4.2 : 4.2, 2.25, 10 - index * 7);
    scene.add(sign);
    return sign;
  });

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
    recoveryHint: null as string | null,
    speed: 16,
    x: 0,
    yaw: 0,
    yawVelocity: 0,
  };

  const clock = new THREE.Clock();
  let rafId = 0;

  function setInput(code: string, active: boolean) {
    switch (code) {
      case "ArrowUp":
      case "KeyW":
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
    const acceleration = input.accelerate ? 16 : 0;
    const braking = input.brake ? 24 : 0;
    const passiveDrag = state.speed * 0.62;
    const canBoost = input.boost && state.boostCharges > 0.05;
    const boostAcceleration = canBoost ? 28 : 0;
    const maxSpeed = canBoost ? 44 : drifting ? 30 : 34;

    state.speed += (acceleration + boostAcceleration - braking - passiveDrag + 6) * delta;
    state.speed = THREE.MathUtils.clamp(state.speed, 0, maxSpeed);

    if (canBoost) {
      state.boostCharges = Math.max(0, state.boostCharges - delta * 0.82);
    } else {
      const rechargeRate = drifting ? 0.34 : 0.18;
      state.boostCharges = Math.min(MAX_BOOST_CHARGES, state.boostCharges + delta * rechargeRate);
    }

    const steeringStrength = drifting ? 2.8 : 1.9;
    const yawAssist = drifting ? 3.8 : 5.2;
    state.yawVelocity += steeringInput * steeringStrength * delta;
    state.yawVelocity -= state.yawVelocity * yawAssist * delta;
    state.yaw += state.yawVelocity * delta;
    state.yaw *= drifting ? 0.995 : 0.99;

    const lateralVelocity = state.yawVelocity * 5.2 + steeringInput * delta * 3.4;
    state.x += lateralVelocity;

    if (Math.abs(state.x) > TRACK_HALF_WIDTH) {
      state.x = THREE.MathUtils.clamp(state.x, -TRACK_HALF_WIDTH, TRACK_HALF_WIDTH);
      state.speed *= 0.985;
      state.yawVelocity *= 0.45;
      state.recoveryHint = "Guardrail scrape";
    }

    if (input.reset) {
      state.x = 0;
      state.yaw = 0;
      state.yawVelocity = 0;
      state.speed = 12;
      state.recoveryHint = "Manual reset";
    }

    state.distance += state.speed * delta;
    const courseDistance = state.distance % COURSE_LENGTH;
    const currentSection =
      COURSE_SECTIONS.find((section) => courseDistance <= section.maxDistance)?.label ??
      COURSE_SECTIONS[COURSE_SECTIONS.length - 1].label;

    const bob = Math.sin(elapsed * 7 + state.distance * 0.08) * (0.06 + state.speed * 0.0012);
    const pitch = -state.speed * 0.006 - (canBoost ? 0.06 : 0) + (input.brake ? 0.08 : 0);
    const bank = THREE.MathUtils.clamp(-state.yawVelocity * 4.6, -0.75, 0.75) + steeringInput * 0.06;

    hoverbike.position.x = THREE.MathUtils.damp(hoverbike.position.x, state.x, 9, delta);
    hoverbike.position.y = 0.86 + bob;
    hoverbike.rotation.x = THREE.MathUtils.damp(hoverbike.rotation.x, pitch, 7, delta);
    hoverbike.rotation.y = THREE.MathUtils.damp(hoverbike.rotation.y, state.yaw, 9, delta);
    hoverbike.rotation.z = THREE.MathUtils.damp(hoverbike.rotation.z, bank, 8, delta);

    hoverGlow.scale.setScalar(1 + state.speed * 0.008 + (drifting ? 0.12 : 0));
    hoverGlowMaterial.opacity = 0.42 + state.speed * 0.01;
    boostGlowMaterial.opacity = canBoost ? 0.9 : 0.1;
    boostGlow.scale.setScalar(canBoost ? 1.45 : 0.95);

    laneLines.forEach((line, index) => {
      line.position.z = 15 - ((state.distance * 1.8 + index * 3.1) % 49);
    });

    sideLights.forEach((marker, index) => {
      marker.position.z = 12 - ((state.distance * 1.8 + index * 2.4) % 44);
    });

    skyline.forEach((tower, index) => {
      tower.position.z = 15 - ((state.distance * 0.9 + index * 4.4) % 78);
      tower.rotation.y = elapsed * 0.04 * (index % 2 === 0 ? 1 : -1);
    });

    billboards.forEach((sign, index) => {
      sign.position.z = 10 - ((state.distance * 1.1 + index * 7) % 66);
    });

    loop.rotation.z = elapsed * 0.2;
    trackShoulders.forEach((barrier, index) => {
      barrier.material.emissiveIntensity = 0.45 + (canBoost ? 0.4 : 0) + index * 0.05;
    });
    loopPillars.forEach((pillar) => {
      pillar.scale.y = 1 + Math.sin(elapsed * 0.6) * 0.02;
    });

    const cameraTarget = new THREE.Vector3(hoverbike.position.x * 0.55, 2.1, hoverbike.position.z - 4.4);
    const cameraPosition = new THREE.Vector3(hoverbike.position.x * 0.38, 4.9, hoverbike.position.z + 10.2 - state.speed * 0.06);
    camera.position.lerp(cameraPosition, 1 - Math.exp(-5.4 * delta));
    camera.lookAt(cameraTarget);

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
