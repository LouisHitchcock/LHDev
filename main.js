import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/DRACOLoader.js';

let scene, camera, renderer, controls, hdrEnvTexture, model, ground;

// Reference existing loading screen from HTML
const loadingScreen = document.getElementById('loading-screen');
const loadingText = document.getElementById('loading-text');

init();
loadModel();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbababa);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(2, 2, 4);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 1;
  controls.maxDistance = 10;

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  light.castShadow = true;
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  new RGBELoader()
    .setPath('./scene/')
    .load('environment.hdr', function (texture) {
      hdrEnvTexture = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = hdrEnvTexture;

      ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.ShadowMaterial({ opacity: 0.5 }));
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      pmremGenerator.dispose();
    });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      console.log("Resize event handled");
    }, 200);
  });
}

function loadModel() {
  const loadingManager = new THREE.LoadingManager();

  loadingManager.onProgress = (url, loaded, total) => {
    if (total > 0) {
      const progress = Math.floor((loaded / total) * 100);
      loadingText.innerText = `Loading... ${progress}%`;
    }
  };

  loadingManager.onLoad = () => {
    console.log('Model successfully loaded');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500); // Allow fade-out animation
  };

  try {
    const loader = new GLTFLoader(loadingManager);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);

    const modelUrl = 'https://pub-30df16020b794c51aa9c0ebb9d25a52f.r2.dev/model.glb';

    loader.load(
      modelUrl,
      function (gltf) {
        model = gltf.scene;
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        model.rotation.y = THREE.MathUtils.degToRad(82);
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the model:', error);
        alert("Failed to load the model. Please try again later.");
      }
    );
  } catch (error) {
    console.error('Critical error:', error);
    alert("An unexpected error occurred. Please refresh the page.");
  }
}

function animate() {
  try {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  } catch (error) {
    console.error('Error during rendering:', error);
  }
}
