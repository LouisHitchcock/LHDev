import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/DRACOLoader.js';

let scene, camera, renderer, controls, hdrEnvTexture, model, ground;
let savedCameraStates = [];
let modelLoaded = false;
let hdriLoaded = false;
let debugMenuVisible = false;

const loadingScreen = document.getElementById('loading-screen');
const loadingText = document.getElementById('loading-text');
const debugMenu = document.getElementById('debug-menu');
const printModelRotationCheckbox = document.getElementById('printModelRotation');
const printCameraPositionCheckbox = document.getElementById('printCameraPosition');
const modelRotationSlider = document.getElementById('modelRotation');
const defaultModelRotation = 147;

modelRotationSlider.value = defaultModelRotation;

document.addEventListener('keydown', (event) => {
  if (event.key === 'l' || event.key === 'L') {
    controls.enabled = false;
    animateCameraTo(
      { x: 0.465, y: 1.680, z: -0.666 }, // Target Position
      { x: -2.98, y: 0.596, z: 3.05 },  // Target Rotation
      2000 // Animation Duration
    );
    setTimeout(() => { controls.enabled = true; }, 2000);
  }
  if (event.key === 's' || event.key === 'S') {
    saveCameraState();
  }
  if (event.key === 'r' || event.key === 'R') {
    restoreLastCameraState();
  }
  if (event.key === 'p' || event.key === 'P') {
    debugMenuVisible = !debugMenuVisible;
    debugMenu.style.display = debugMenuVisible ? 'block' : 'none';
  }
});

init();
loadHDRI();
loadModel();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbababa);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  camera.position.set(4.766, 3.401, -1.967);
  camera.rotation.set(-2.234, 0.986, 2.323);
  controls.target.set(0, 1.5, 0);
  camera.updateProjectionMatrix();
  controls.update();
  setTimeout(() => { controls.enabled = true; }, 500);

  window.addEventListener('resize', handleResize);

  // Directional light casting shadows
  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(12, 9, -3);
  light.castShadow = true;
  light.shadow.mapSize.width = 4096;
  light.shadow.mapSize.height = 4096;
  light.shadow.radius = 2.5;
  light.shadow.bias = -0.002;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 50;
  scene.add(light);

  // Ground plane that receives shadows
  if (!ground) {
    ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.ShadowMaterial({ opacity: 0.7 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);
  } else {
    ground.receiveShadow = true;
  }
}

function loadHDRI() {
  loadingText.innerText = "Loading HDRI...";
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  new RGBELoader()
    .setPath('./scene/')
    .load('environment.hdr', function (texture) {
      hdrEnvTexture = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = hdrEnvTexture;
      hdriLoaded = true;
      checkLoadingComplete();
      pmremGenerator.dispose();
    });
}

function loadModel() {
  loadingText.innerText = "Loading Model...";
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  loader.setDRACOLoader(dracoLoader);

  loader.load('https://pub-30df16020b794c51aa9c0ebb9d25a52f.r2.dev/modelCompressed.glb', function (gltf) {
    model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(model);
    model.rotation.y = THREE.MathUtils.degToRad(defaultModelRotation);
    modelLoaded = true;
    checkLoadingComplete();
  });
}

function checkLoadingComplete() {
  if (modelLoaded && hdriLoaded) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
}

// Smooth Camera Transition
function animateCameraTo(targetPosition, targetRotation, duration = 2000) {
  const startPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
  const startRotation = { x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z };
  let startTime = null;

  function animationStep(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const t = Math.min(elapsed / duration, 1);
    const easeInOut = t * t * (3 - 2 * t);

    camera.position.set(
      startPosition.x + (targetPosition.x - startPosition.x) * easeInOut,
      startPosition.y + (targetPosition.y - startPosition.y) * easeInOut,
      startPosition.z + (targetPosition.z - startPosition.z) * easeInOut
    );

    camera.rotation.set(
      startRotation.x + (targetRotation.x - startRotation.x) * easeInOut,
      startRotation.y + (targetRotation.y - startRotation.y) * easeInOut,
      startRotation.z + (targetRotation.z - startRotation.z) * easeInOut
    );

    controls.target.set(0, 1.5, 0);
    camera.updateProjectionMatrix();
    controls.update();

    if (t < 1) requestAnimationFrame(animationStep);
  }
  requestAnimationFrame(animationStep);
}

function saveCameraState() {
  savedCameraStates.push({ position: camera.position.clone(), rotation: camera.rotation.clone() });
}

function restoreLastCameraState() {
  if (savedCameraStates.length === 0) return;
  const lastState = savedCameraStates.pop();
  animateCameraTo(lastState.position, lastState.rotation, 2000);
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
