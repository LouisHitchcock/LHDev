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
    camera.position.set(0.4652825026116795, 1.6808014388855963, -0.666160593402512);
    camera.rotation.set(-2.9797559502866244, 0.5966921693795699, 3.050108851901814);
    controls.target.set(0, 1.5, 0);
    camera.updateProjectionMatrix();
    controls.update();
    setTimeout(() => { controls.enabled = true; }, 500);
    console.log("Camera position set to predefined location.");
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

  camera.position.set(4.766378949970454, 3.401219859066642, -1.9678530779199426);
  camera.rotation.set(-2.234360704827261, 0.9861125311950485, 2.323988061728519);
  controls.target.set(0, 1.5, 0);
  camera.updateProjectionMatrix();
  controls.update();
  setTimeout(() => { controls.enabled = true; }, 500);
  console.log("Camera position set to initial predefined location.");

  window.addEventListener('resize', handleResize);
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

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
