import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let scene, camera, renderer, controls, hdrEnvTexture, model, ground;

// Debug variable: Set to true to display sliders, false to hide them
const Debug = true;

init();
loadModel();
animate();

function init() {
  // Toggle slider visibility based on Debug
  const controlsDiv = document.getElementById('controls');
  controlsDiv.classList.toggle('hidden', !Debug);

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbababa); // Solid grey background

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  document.body.appendChild(renderer.domElement);

  // Camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(2, 2, 4);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 1;
  controls.maxDistance = 10;

  // Add Light with Shadows
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 50;
  light.shadow.camera.left = -5;
  light.shadow.camera.right = 5;
  light.shadow.camera.top = 5;
  light.shadow.camera.bottom = -5;
  scene.add(light);

  // Add Ambient Light
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  // Load HDRI Environment
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  new RGBELoader()
    .setPath('./scene/')
    .load('environment.hdr', function (texture) {
      hdrEnvTexture = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = hdrEnvTexture;

      // Create Ground Plane to "flatten" the floor
      const groundMaterial = new THREE.ShadowMaterial({
        opacity: 0.5,
      });
      ground = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50),
        groundMaterial
      );
      ground.rotation.x = -Math.PI / 2; // Make it horizontal
      ground.position.y = 0; // Default position (set to 0)
      ground.receiveShadow = true;
      scene.add(ground);

      pmremGenerator.dispose();
    });

  // Resize Handling
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Sliders
  const hdriRotationSlider = document.getElementById('hdriRotation');
  const modelRotationSlider = document.getElementById('modelRotation');
  const groundHeightSlider = document.getElementById('groundHeight');

  hdriRotationSlider.addEventListener('input', updateHdriRotation);
  modelRotationSlider.addEventListener('input', updateModelRotation);
  groundHeightSlider.addEventListener('input', updateGroundHeight);

  // Set default model rotation and ground height
  modelRotationSlider.value = 82;
  groundHeightSlider.value = 0;
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.setPath('./scene/');
  loader.load('model.glb', function (gltf) {
    model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        // Use MeshStandardMaterial to support reflectivity
        if (!(child.material instanceof THREE.MeshStandardMaterial)) {
          child.material = new THREE.MeshStandardMaterial({
            color: child.material.color,
            roughness: 0.5,
            metalness: 0.5,
            envMap: hdrEnvTexture,
          });
        }
        child.castShadow = true; // Enable shadows for the model
        child.receiveShadow = true; // Allow the model to receive shadows
      }
    });

    // Set the default rotation of the model to 82° (Y-axis)
    model.rotation.y = THREE.MathUtils.degToRad(82);
    console.log(`Model Rotation (Y): 82°`);

    scene.add(model);
  });
}

function updateHdriRotation() {
  const rotation = THREE.MathUtils.degToRad(document.getElementById('hdriRotation').value);
  if (hdrEnvTexture) {
    hdrEnvTexture.matrixAutoUpdate = false;
    hdrEnvTexture.matrix.makeRotationY(rotation);
  }
}

function updateModelRotation() {
  const rotation = THREE.MathUtils.degToRad(document.getElementById('modelRotation').value);
  if (model) {
    model.rotation.y = rotation;
    console.log(`Model Rotation (Y): ${THREE.MathUtils.radToDeg(rotation)}°`);
  }
}

function updateGroundHeight() {
  const height = parseFloat(document.getElementById('groundHeight').value);
  if (ground) {
    ground.position.y = height;
    console.log(`Ground Height: ${height}`);
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
