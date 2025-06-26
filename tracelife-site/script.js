import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js';

function init(container, color) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  const geometry = new THREE.CylinderGeometry(1, 1, 2, 64);
  const material = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.3,
    roughness: 0.3
  });
  const can = new THREE.Mesh(geometry, material);
  scene.add(can);

  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.z = 4;

  function animate() {
    requestAnimationFrame(animate);
    can.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

const colors = ['#a1d2ff', '#ff9393', '#c6ffa1', '#fff1a1', '#d1a1ff'];
['can1', 'can2', 'can3', 'can4', 'can5'].forEach((id, i) => {
  init(document.getElementById(id), colors[i]);
});
