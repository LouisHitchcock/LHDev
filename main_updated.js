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
    animateCameraTo(
      { x: 0.4652825026116795, y: 1.6808014388855963, z: -0.666160593402512 },
      { pitch: -2.9797559502866244, yaw: 0.5966921693795699, roll: 3.050108851901814 },
      2000
    );
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

  camera.position.set(4.766378949970454, 3.401219859066642, -1.9678530779199426);
  camera.rotation.set(-2.234360704827261, 0.9861125311950485, 2.323988061728519);
  controls.target.set(0, 1.5, 0);
  camera.updateProjectionMatrix();
  controls.update();
  setTimeout(() => { controls.enabled = true; }, 500);
  console.log("Camera position set to initial predefined location.");

  window.addEventListener('resize', handleResize);

  loadHDRI();
  loadModel();
  animate();
}

function animateCameraTo(targetPosition, targetRotation, duration) {
  const startPosition = { ...camera.position };
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
      startRotation.x + (targetRotation.pitch - startRotation.x) * easeInOut,
      startRotation.y + (targetRotation.yaw - startRotation.y) * easeInOut,
      startRotation.z + (targetRotation.roll - startRotation.z) * easeInOut
    );

    controls.target.set(0, 1.5, 0);
    camera.updateProjectionMatrix();
    controls.update();

    if (t < 1) {
      requestAnimationFrame(animationStep);
    } else {
      console.log("Camera animation complete.");
    }
  }
  requestAnimationFrame(animationStep);
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

  loader.load('https://pub-30df16020b794c51aa9c0ebb9d25a52f.r2.dev/simplify-0-75.glb', function (gltf) {
    model = gltf.scene;
    scene.add(model);
    model.rotation.y = THREE.MathUtils.degToRad(defaultModelRotation);
    modelLoaded = true;
    checkLoadingComplete();
  });
}

function checkLoadingComplete() {
  if (modelLoaded && hdriLoaded) {
    console.log("All assets loaded successfully");
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  console.log("Resize event handled");
}

function saveCameraState() {
  const cameraState = {
    position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
    rotation: { pitch: camera.rotation.x, yaw: camera.rotation.y, roll: camera.rotation.z }
  };
  savedCameraStates.push(cameraState);
  console.log("Camera state saved:", cameraState);
}

function restoreLastCameraState() {
  if (savedCameraStates.length === 0) {
    console.log("No saved camera states.");
    return;
  }
  const lastState = savedCameraStates[savedCameraStates.length - 1];
  animateCameraTo(lastState.position, lastState.rotation, 2000);
  console.log("Camera restored to:", lastState);
}

printCameraPositionCheckbox.addEventListener('change', function(event) {
  if (event.target.checked) {
    console.log("Camera Position Logging Enabled");
    setInterval(() => {
      console.log(`Camera Position: { x: ${camera.position.x.toFixed(3)}, y: ${camera.position.y.toFixed(3)}, z: ${camera.position.z.toFixed(3)} }`);
      console.log(`Camera Rotation: { pitch: ${camera.rotation.x.toFixed(3)}, yaw: ${camera.rotation.y.toFixed(3)}, roll: ${camera.rotation.z.toFixed(3)} }`);
    }, 1000);
  }
});



function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

init();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50;
scene.add(light);

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.ShadowMaterial({ opacity: 0.5 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);
