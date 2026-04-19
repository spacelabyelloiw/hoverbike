import * as THREE from "three";

export function createPrototypeScene(
  renderer: THREE.WebGLRenderer,
  canvas: HTMLCanvasElement,
) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#07111f");
  scene.fog = new THREE.Fog("#07111f", 12, 48);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 5.5, 12);

  const ambientLight = new THREE.AmbientLight("#7dd3ff", 1.2);
  const sunLight = new THREE.DirectionalLight("#ffd18a", 2.1);
  sunLight.position.set(8, 12, 6);
  scene.add(ambientLight, sunLight);

  const trackMaterial = new THREE.MeshStandardMaterial({
    color: "#17243d",
    metalness: 0.2,
    roughness: 0.65,
    emissive: "#12213a",
    emissiveIntensity: 0.5,
  });

  const laneMaterial = new THREE.MeshStandardMaterial({
    color: "#33d3ff",
    emissive: "#33d3ff",
    emissiveIntensity: 0.8,
  });

  const platform = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 24), trackMaterial);
  platform.position.set(0, 0, 0);
  scene.add(platform);

  const loop = new THREE.Mesh(
    new THREE.TorusGeometry(4, 0.45, 24, 72),
    new THREE.MeshStandardMaterial({
      color: "#ff7e47",
      emissive: "#ff7e47",
      emissiveIntensity: 0.9,
    }),
  );
  loop.rotation.x = Math.PI / 2;
  loop.position.set(0, 4.2, -3.5);
  scene.add(loop);

  const hoverbike = new THREE.Group();
  const bikeBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.35, 3.2),
    new THREE.MeshStandardMaterial({
      color: "#f2f6ff",
      emissive: "#54f4ff",
      emissiveIntensity: 0.4,
      metalness: 0.35,
      roughness: 0.4,
    }),
  );
  const bikeCanopy = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.2, 1),
    new THREE.MeshStandardMaterial({
      color: "#ff4db0",
      emissive: "#ff4db0",
      emissiveIntensity: 0.6,
    }),
  );
  bikeCanopy.position.set(0, 0.25, 0.1);

  const hoverGlow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.9, 0.05, 32),
    new THREE.MeshBasicMaterial({
      color: "#47e8ff",
      transparent: true,
      opacity: 0.6,
    }),
  );
  hoverGlow.position.set(0, -0.3, 0);

  hoverbike.add(bikeBody, bikeCanopy, hoverGlow);
  hoverbike.position.set(0, 0.8, 6);
  scene.add(hoverbike);

  const laneLines = Array.from({ length: 10 }, (_, index) => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 1.5), laneMaterial);
    line.position.set(0, 0.28, 9 - index * 2.6);
    scene.add(line);
    return line;
  });

  const skyline = Array.from({ length: 14 }, (_, index) => {
    const height = 2 + (index % 5) * 1.3;
    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, height, 1.5),
      new THREE.MeshStandardMaterial({
        color: index % 2 === 0 ? "#24375d" : "#1a2b4a",
        emissive: index % 3 === 0 ? "#172b4a" : "#0f1e33",
        emissiveIntensity: 0.5,
      }),
    );
    const side = index % 2 === 0 ? -1 : 1;
    tower.position.set(side * (4.5 + (index % 3) * 1.4), height / 2 - 0.1, 8 - index * 2.3);
    scene.add(tower);
    return tower;
  });

  const clock = new THREE.Clock();
  let rafId = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }

  function animate() {
    const elapsed = clock.getElapsedTime();
    const bob = Math.sin(elapsed * 2.6) * 0.08;
    const sway = Math.sin(elapsed * 1.2) * 0.12;

    hoverbike.position.y = 0.82 + bob;
    hoverbike.rotation.z = sway * 0.25;
    hoverbike.position.z = 6 - (elapsed * 3.5) % 18;

    laneLines.forEach((line, index) => {
      line.position.z = 9 - ((elapsed * 7 + index * 2.6) % 24);
    });

    skyline.forEach((tower, index) => {
      tower.rotation.y = elapsed * 0.04 * (index % 2 === 0 ? 1 : -1);
    });

    camera.lookAt(0, 1.4, 0);
    renderer.render(scene, camera);
    rafId = window.requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener("resize", resize);

  return function stop() {
    window.cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    renderer.dispose();
  };
}
